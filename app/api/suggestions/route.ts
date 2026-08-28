import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q    = searchParams.get('q') ?? '';
  const lang = searchParams.get('lang') ?? 'en';

  if (!q || q.length < 2) return NextResponse.json({ suggestions: [] });

  try {
    // 1. Google Official Autocomplete Engine (Primary)
    const googleUrl = `https://suggestqueries.google.com/complete/search?client=chrome&hl=${lang}&q=${encodeURIComponent(q)}`;
    const googleRes = await fetch(googleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: 60 },
    });

    if (googleRes.ok) {
      const data = await googleRes.json() as [string, string[]];
      if (Array.isArray(data[1]) && data[1].length > 0) {
        return NextResponse.json({ suggestions: data[1].slice(0, 8), source: 'google' });
      }
    }

    // 2. Fallback to Wikipedia Opensearch
    const wikiBase = `https://${lang}.wikipedia.org`;
    const url  = `${wikiBase}/w/api.php?action=opensearch&search=${encodeURIComponent(q)}&limit=8&namespace=0&format=json&origin=*`;
    const res  = await fetch(url, { next: { revalidate: 60 } });
    const data = await res.json() as [string, string[]];
    return NextResponse.json({ suggestions: data[1] ?? [], source: 'wikipedia' });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
