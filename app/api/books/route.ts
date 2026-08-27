import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') ?? '';
  const page  = parseInt(searchParams.get('page') ?? '1');
  const limit = 10;

  if (!query) return NextResponse.json({ results: [] });

  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}&page=${page}&fields=key,title,author_name,first_publish_year,cover_i,subject,number_of_pages_median`;
    const res  = await fetch(url, { next: { revalidate: 300 } });
    const data = await res.json() as {
      docs?: Array<{
        key: string; title?: string; author_name?: string[];
        first_publish_year?: number; cover_i?: number; subject?: string[];
      }>;
    };

    const results = (data.docs ?? []).map((d) => ({
      key:     d.key,
      title:   d.title ?? 'Untitled',
      authors: d.author_name ?? [],
      year:    d.first_publish_year,
      coverId: d.cover_i,
      url:     `https://openlibrary.org${d.key}`,
      subjects:(d.subject ?? []).slice(0, 5),
    }));

    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
