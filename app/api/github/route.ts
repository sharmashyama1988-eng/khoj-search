import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') ?? '';
  const page  = parseInt(searchParams.get('page') ?? '1');

  if (!query) return NextResponse.json({ results: [] });

  try {
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=10&page=${page}`;
    const res  = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
      next: { revalidate: 120 },
    });
    const data = await res.json() as {
      items?: Array<{
        id: number; name: string; full_name: string; description: string | null;
        html_url: string; stargazers_count: number; language: string | null;
        topics?: string[]; updated_at: string;
      }>;
    };

    const results = (data.items ?? []).map((r) => ({
      id:          r.id,
      name:        r.name,
      fullName:    r.full_name,
      description: r.description ?? '',
      url:         r.html_url,
      stars:       r.stargazers_count,
      language:    r.language,
      topics:      r.topics ?? [],
      updatedAt:   r.updated_at,
    }));

    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
