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

/**
 * 1. YouTube Direct Web Scraper
 */
async function fetchYouTubeVideos(query: string, limit: number = 15): Promise<VideoResult[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

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

    if (!res.ok) return [];

    const html = await res.text();
    const match = html.match(/ytInitialData\s*=\s*({.+?});<\/script>/s) || html.match(/var ytInitialData\s*=\s*({.+?});/s);

    if (!match) return [];
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

    return videos;
  } catch {
    return [];
  }
}

/**
 * 2. DailyMotion Global Video Network
 */
async function fetchDailyMotionVideos(query: string, limit: number = 10): Promise<VideoResult[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);

    const dmUrl = `https://api.dailymotion.com/videos?search=${encodeURIComponent(query)}&fields=id,title,description,thumbnail_720_url,thumbnail_480_url,thumbnail_240_url,url,duration,views_total,owner.screenname&limit=${limit}`;
    const res = await fetch(dmUrl, {
      signal: controller.signal,
      next: { revalidate: 180 },
    });
    clearTimeout(timer);

    if (!res.ok) return [];
    const data = (await res.json()) as {
      list?: Array<{
        id: string;
        title: string;
        description: string;
        thumbnail_720_url?: string;
        thumbnail_480_url?: string;
        thumbnail_240_url?: string;
        url: string;
        duration: number;
        views_total: number;
        'owner.screenname'?: string;
      }>;
    };

    const results: VideoResult[] = [];
    (data.list || []).forEach((v) => {
      const mins = Math.floor(v.duration / 60);
      const secs = (v.duration % 60).toString().padStart(2, '0');
      const durationStr = `${mins}:${secs}`;
      const thumb = v.thumbnail_720_url || v.thumbnail_480_url || v.thumbnail_240_url || '';

      results.push({
        id: `dm-${v.id}`,
        videoId: v.id,
        title: decodeHtml(v.title),
        description: decodeHtml(v.description || ''),
        url: v.url || `https://www.dailymotion.com/video/${v.id}`,
        embedUrl: `https://www.dailymotion.com/embed/video/${v.id}?autoplay=1`,
        thumbnail: thumb,
        channelTitle: v['owner.screenname'] || 'DailyMotion Creator',
        views: v.views_total ? `${v.views_total.toLocaleString()} views` : '',
        publishedAt: 'Recent',
        duration: durationStr,
        source: 'DailyMotion',
      });
    });

    return results;
  } catch {
    return [];
  }
}

/**
 * 3. Internet Archive Open Video Vault
 */
async function fetchArchiveVideos(query: string, limit: number = 8): Promise<VideoResult[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);

    const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}+AND+mediatype:movies&fl[]=identifier,title,description,year,downloads,duration&sort[]=downloads+desc&rows=${limit}&page=1&output=json`;
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 300 },
    });
    clearTimeout(timer);

    if (!res.ok) return [];
    const data = (await res.json()) as {
      response?: {
        docs?: Array<{
          identifier: string;
          title?: string;
          description?: string;
          year?: string;
          downloads?: number;
          duration?: string;
        }>;
      };
    };

    const results: VideoResult[] = [];
    (data.response?.docs || []).forEach((d) => {
      if (d.identifier) {
        results.push({
          id: `archive-${d.identifier}`,
          videoId: d.identifier,
          title: decodeHtml(d.title || d.identifier),
          description: decodeHtml(d.description || 'Historical and open video archive from Archive.org'),
          url: `https://archive.org/details/${d.identifier}`,
          embedUrl: `https://archive.org/embed/${d.identifier}`,
          thumbnail: `https://archive.org/services/img/${d.identifier}`,
          channelTitle: 'Internet Archive',
          views: d.downloads ? `${d.downloads.toLocaleString()} downloads` : '',
          publishedAt: d.year || 'Archive',
          duration: d.duration || '',
          source: 'Internet Archive',
        });
      }
    });

    return results;
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get('q') || searchParams.get('query') || '').trim();
  const limit = Math.min(parseInt(searchParams.get('limit') || '25', 10), 40);

  if (!query) {
    return NextResponse.json({ results: [], total: 0 });
  }

  try {
    // Parallel Multi-Platform Video Fetching
    const [ytBatch, dmBatch, archiveBatch] = await Promise.allSettled([
      fetchYouTubeVideos(query, 15),
      fetchDailyMotionVideos(query, 10),
      fetchArchiveVideos(query, 8),
    ]);

    const yt = ytBatch.status === 'fulfilled' ? ytBatch.value : [];
    const dm = dmBatch.status === 'fulfilled' ? dmBatch.value : [];
    const arc = archiveBatch.status === 'fulfilled' ? archiveBatch.value : [];

    // Interleave results from diverse platforms
    const combined: VideoResult[] = [];
    const maxLen = Math.max(yt.length, dm.length, arc.length);

    for (let i = 0; i < maxLen; i++) {
      if (yt[i]) combined.push(yt[i]);
      if (dm[i]) combined.push(dm[i]);
      if (arc[i]) combined.push(arc[i]);
    }

    return NextResponse.json({
      results: combined.slice(0, limit),
      total: combined.length,
      query,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e), results: [], total: 0 }, { status: 500 });
  }
}