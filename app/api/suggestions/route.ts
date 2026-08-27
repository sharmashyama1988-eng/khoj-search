import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q    = searchParams.get('q') ?? '';
  const lang = searchParams.get('lang') ?? 'en';

  if (!q || q.length < 2) return NextResponse.json({ suggestions: [] });

  try {
    const wikiBase = `https://${lang}.wikipedia.org`;
    const url  = `${wikiBase}/w/api.php?action=opensearch&search=${encodeURIComponent(q)}&limit=8&namespace=0&format=json&origin=*`;
    const res  = await fetch(url, { next: { revalidate: 30 } });
    const data = await res.json() as [string, string[]];
    return NextResponse.json({ suggestions: data[1] ?? [] });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
