import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface ImageResult {
  id: string;
  title: string;
  url: string;
  thumbUrl: string;
  width?: number;
  height?: number;
  source: string;
  domain?: string;
}

/**
 * 1. Global Web Image Index (Unrestricted & Multi-Source)
 */
async function fetchGlobalWebImages(query: string, limit: number = 30): Promise<ImageResult[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    // Step 1: Get vqd session token
    const tokenRes = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      signal: controller.signal,
      next: { revalidate: 120 },
    });
    const html = await tokenRes.text();
    const vqdMatch = html.match(/vqd=["']?([^"'\s&]+)/i) || html.match(/vqd=([^&]+)/i);
    const vqd = vqdMatch ? vqdMatch[1] : '';

    if (!vqd) {
      clearTimeout(timer);
      return [];
    }

    // Step 2: Fetch unrestricted images across the web (p=1, kp=-2: SafeSearch disabled)
    const imgRes = await fetch(
      `https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}&o=json&p=1&s=0&u=bing&f=,,,&l=us-en&vqd=${vqd}&p=1`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': 'https://duckduckgo.com/',
        },
        signal: controller.signal,
        next: { revalidate: 120 },
      }
    );
    clearTimeout(timer);

    if (!imgRes.ok) return [];
    const data = (await imgRes.json()) as {
      results?: Array<{
        title?: string;
        image?: string;
        thumbnail?: string;
        width?: number;
        height?: number;
        source?: string;
        url?: string;
      }>;
    };

    const results: ImageResult[] = [];
    (data.results || []).slice(0, limit).forEach((item, idx) => {
      if (item.image && item.image.startsWith('http')) {
        let domain = 'Web';
        try {
          if (item.url) domain = new URL(item.url).hostname.replace(/^www\./, '');
        } catch {}

        results.push({
          id: `web-img-${idx}-${Math.random().toString(36).slice(2, 6)}`,
          title: item.title || `${query} image`,
          url: item.image,
          thumbUrl: item.thumbnail || item.image,
          width: item.width || 800,
          height: item.height || 600,
          source: item.source || domain,
          domain,
        });
      }
    });

    return results;
  } catch {
    return [];
  }
}

/**
 * 2. Wikimedia Commons Open Media Repository
 */
async function fetchWikimediaImages(query: string, limit: number = 15): Promise<ImageResult[]> {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=${limit}&prop=imageinfo&iiprop=url|size&iiurlwidth=400&format=json&origin=*`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      query?: {
        pages?: Record<string, {
          pageid: number;
          title: string;
          imageinfo?: Array<{ url: string; thumburl?: string; width?: number; height?: number }>;
        }>;
      };
    };

    const pages = Object.values(data.query?.pages ?? {});
    return pages
      .filter((p) => p.imageinfo?.[0]?.url)
      .map((p) => ({
        id: `wiki-comm-${p.pageid}`,
        title: p.title.replace(/^File:/i, ''),
        url: p.imageinfo![0].url,
        thumbUrl: p.imageinfo![0].thumburl ?? p.imageinfo![0].url,
        width: p.imageinfo![0].width,
        height: p.imageinfo![0].height,
        source: 'Wikimedia Commons',
        domain: 'commons.wikimedia.org',
      }));
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get('q') || searchParams.get('query') || '').trim();
  const limit = Math.min(parseInt(searchParams.get('limit') || '30', 10), 60);

  if (!query) {
    return NextResponse.json({ results: [], total: 0 });
  }

  try {
    // Fetch global unrestricted web images + Wikimedia in parallel
    const [globalImages, wikiImages] = await Promise.all([
      fetchGlobalWebImages(query, limit),
      fetchWikimediaImages(query, 15),
    ]);

    // Merge with global web images first
    const combined: ImageResult[] = [];
    const seenUrls = new Set<string>();

    const addImg = (img: ImageResult) => {
      if (!seenUrls.has(img.url)) {
        seenUrls.add(img.url);
        combined.push(img);
      }
    };

    globalImages.forEach(addImg);
    wikiImages.forEach(addImg);

    return NextResponse.json({
      results: combined.slice(0, limit),
      total: combined.length,
      query,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e), results: [] }, { status: 500 });
  }
}