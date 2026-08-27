import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query  = searchParams.get('q') ?? '';
  const lang   = searchParams.get('lang') ?? 'en';
  const limit  = parseInt(searchParams.get('limit') ?? '20');

  if (!query) return NextResponse.json({ results: [] });

  try {
    // Wikimedia Commons search
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=${limit}&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=400&format=json&origin=*`;
    const res  = await fetch(url, { next: { revalidate: 300 } });
    const data = await res.json() as {
      query?: {
        pages?: Record<string, {
          pageid: number; title: string;
          imageinfo?: Array<{ url: string; thumburl?: string; width?: number; height?: number }>;
        }>;
      };
    };

    const pages   = Object.values(data.query?.pages ?? {});
    const results = pages
      .filter((p) => p.imageinfo?.[0]?.url)
      .map((p) => ({
        id:       String(p.pageid),
        title:    p.title.replace('File:', ''),
        url:      p.imageinfo![0].url,
        thumbUrl: p.imageinfo![0].thumburl ?? p.imageinfo![0].url,
        width:    p.imageinfo![0].width,
        height:   p.imageinfo![0].height,
        source:   'Wikimedia Commons',
      }));

    // Also search Wikipedia images for the same query
    const wikiLang = lang === 'en' ? 'en' : lang;
    const wikiImgUrl = `https://${wikiLang}.wikipedia.org/w/api.php?action=query&generator=images&titles=${encodeURIComponent(query)}&prop=imageinfo&iiprop=url|size&iiurlwidth=400&format=json&origin=*`;
    const wikiImgRes = await fetch(wikiImgUrl, { next: { revalidate: 300 } });
    const wikiImgData = await wikiImgRes.json() as {
      query?: { pages?: Record<string, { pageid: number; title: string; imageinfo?: Array<{ url: string; thumburl?: string }> }> };
    };
    const wikiPages = Object.values(wikiImgData.query?.pages ?? {});
    const wikiImgs  = wikiPages
      .filter((p) => p.imageinfo?.[0]?.url && /\.(jpg|jpeg|png|gif|svg|webp)/i.test(p.imageinfo[0].url))
      .map((p) => ({
        id:       `wiki-${p.pageid}`,
        title:    p.title.replace('File:', ''),
        url:      p.imageinfo![0].url,
        thumbUrl: p.imageinfo![0].thumburl ?? p.imageinfo![0].url,
        source:   'Wikipedia',
      }));

    return NextResponse.json({ results: [...results, ...wikiImgs].slice(0, 30) });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
