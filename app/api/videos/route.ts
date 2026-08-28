import { NextRequest, NextResponse } from 'next/server';
import type { VideoResult } from '@/types';

export const runtime = 'edge';

function decodeHtml(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]*>/g, '')
    .trim();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get('q') || searchParams.get('query') || '').trim();
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 30);

  if (!query) {
    return NextResponse.json({ results: [], total: 0 });
  }

  try {
    // 1. YouTube Direct Web Scraper
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);

    const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&hl=en`;
    const res = await fetch(ytUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
      next: { revalidate: 180 },
    });
    clearTimeout(timer);

    if (res.ok) {
      const html = await res.text();
      const match = html.match(/ytInitialData\s*=\s*({.+?});<\/script>/s) || html.match(/var ytInitialData\s*=\s*({.+?});/s);

      if (match) {
        const data = JSON.parse(match[1]) as {
          contents?: {
            twoColumnSearchResultsRenderer?: {
              primaryContents?: {
                sectionListRenderer?: {
                  contents?: Array<{
                    itemSectionRenderer?: {
                      contents?: Array<{
                        videoRenderer?: {
                          videoId?: string;
                          title?: { runs?: Array<{ text?: string }> };
                          descriptionSnippet?: { runs?: Array<{ text?: string }> };
                          thumbnail?: { thumbnails?: Array<{ url?: string; width?: number; height?: number }> };
                          ownerText?: { runs?: Array<{ text?: string }> };
                          shortBylineText?: { runs?: Array<{ text?: string }> };
                          viewCountText?: { simpleText?: string };
                          shortViewCountText?: { simpleText?: string };
                          publishedTimeText?: { simpleText?: string };
                          lengthText?: { simpleText?: string };
                        };
                      }>;
                    };
                  }>;
                };
              };
            };
          };
        };

        const sectionContents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
        const videos: VideoResult[] = [];

        for (const section of sectionContents) {
          const items = section.itemSectionRenderer?.contents || [];
          for (const item of items) {
            const v = item.videoRenderer;
            if (v && v.videoId) {
              const videoId = v.videoId;
              const title = decodeHtml(v.title?.runs?.[0]?.text || 'YouTube Video');
              const description = decodeHtml(v.descriptionSnippet?.runs?.map((r) => r.text || '').join('') || '');
              const channelTitle = decodeHtml(v.ownerText?.runs?.[0]?.text || v.shortBylineText?.runs?.[0]?.text || 'YouTube Channel');
              const views = v.viewCountText?.simpleText || v.shortViewCountText?.simpleText || '';
              const publishedAt = v.publishedTimeText?.simpleText || '';
              const duration = v.lengthText?.simpleText || '';

              const thumbnails = v.thumbnail?.thumbnails || [];
              const bestThumb = thumbnails[thumbnails.length - 1]?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

              videos.push({
                id: `yt-${videoId}`,
                videoId,
                title,
                description,
                url: `https://www.youtube.com/watch?v=${videoId}`,
                embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`,
                thumbnail: bestThumb,
                channelTitle,
                views,
                publishedAt,
                duration,
                source: 'YouTube',
              });

              if (videos.length >= limit) break;
            }
          }
          if (videos.length >= limit) break;
        }

        if (videos.length > 0) {
          return NextResponse.json({
            results: videos,
            total: videos.length,
            query,
          });
        }
      }
    }

    // 2. Invidious Public Instance Fallback
    const invidiousInstances = [
      'https://inv.tux.pizza',
      'https://invidious.nerdvpn.de',
      'https://invidious.drgns.space',
    ];

    for (const inst of invidiousInstances) {
      try {
        const invRes = await fetch(`${inst}/api/v1/search?q=${encodeURIComponent(query)}&type=video`, {
          headers: { 'User-Agent': 'KhojSearch/2.0' },
          next: { revalidate: 300 },
        });

        if (invRes.ok) {
          const invData = await invRes.json() as Array<{
            videoId: string;
            title: string;
            description?: string;
            author?: string;
            publishedText?: string;
            viewCount?: number;
            lengthSeconds?: number;
            videoThumbnails?: Array<{ url: string }>;
          }>;

          if (Array.isArray(invData) && invData.length > 0) {
            const fallbackVideos: VideoResult[] = invData.slice(0, limit).map((v) => ({
              id: `yt-${v.videoId}`,
              videoId: v.videoId,
              title: v.title,
              description: v.description || '',
              url: `https://www.youtube.com/watch?v=${v.videoId}`,
              embedUrl: `https://www.youtube-nocookie.com/embed/${v.videoId}?autoplay=1`,
              thumbnail: v.videoThumbnails?.[0]?.url || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
              channelTitle: v.author || 'YouTube Channel',
              views: v.viewCount ? `${v.viewCount.toLocaleString()} views` : '',
              publishedAt: v.publishedText || '',
              duration: v.lengthSeconds ? `${Math.floor(v.lengthSeconds / 60)}:${(v.lengthSeconds % 60).toString().padStart(2, '0')}` : '',
              source: 'YouTube',
            }));

            return NextResponse.json({
              results: fallbackVideos,
              total: fallbackVideos.length,
              query,
            });
          }
        }
      } catch {}
    }

    return NextResponse.json({ results: [], total: 0, query });
  } catch (error) {
    return NextResponse.json({ error: String(error), results: [], total: 0 }, { status: 500 });
  }
}
