import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') ?? '';
  const lang  = searchParams.get('lang') ?? 'en';
  const type  = searchParams.get('type') ?? 'search'; // search | summary | panel

  if (!query) return NextResponse.json({ error: 'query required' }, { status: 400 });

  const wikiBase = `https://${lang}.wikipedia.org`;

  try {
    if (type === 'search') {
      // Full-text search with snippets
      const url = `${wikiBase}/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=10&srprop=snippet|titlesnippet|sectionsnippet&format=json&origin=*`;
      const res  = await fetch(url, { next: { revalidate: 60 } });
      const data = await res.json() as { query?: { search?: unknown[] } };
      const results = (data.query?.search ?? []) as Array<{
        pageid: number; title: string; snippet: string;
      }>;
      return NextResponse.json({
        results: results.map((r) => ({
          id:          String(r.pageid),
          title:       r.title,
          url:         `${wikiBase}/wiki/${encodeURIComponent(r.title.replace(/ /g, '_'))}`,
          description: r.snippet.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' '),
          source:      'wikipedia',
        })),
      });
    }

    if (type === 'panel') {
      // Knowledge panel: summary + image
      const summaryUrl = `${wikiBase}/api/rest_v1/page/summary/${encodeURIComponent(query.replace(/ /g, '_'))}`;
      const res  = await fetch(summaryUrl, { next: { revalidate: 300 } });
      if (!res.ok) return NextResponse.json({ panel: null });
      const data = await res.json() as {
        title?: string; extract?: string;
        thumbnail?: { source?: string };
        content_urls?: { desktop?: { page?: string } };
      };
      return NextResponse.json({
        panel: {
          title:       data.title ?? query,
          description: data.extract ?? '',
          image:       data.thumbnail?.source,
          url:         data.content_urls?.desktop?.page ?? `${wikiBase}/wiki/${encodeURIComponent(query)}`,
        },
      });
    }

    return NextResponse.json({ error: 'invalid type' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
