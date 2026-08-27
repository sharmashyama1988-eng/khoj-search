import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

function parseArxivXML(xml: string) {
  const entries: Array<{
    id: string; title: string; summary: string;
    authors: string[]; published: string; url: string; categories: string[];
  }> = [];

  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let m: RegExpExecArray | null;

  while ((m = entryRegex.exec(xml)) !== null) {
    const entry = m[1];
    const get   = (tag: string) => new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`).exec(entry)?.[1]?.trim() ?? '';
    const getAll = (tag: string) => {
      const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'g');
      const results: string[] = [];
      let em: RegExpExecArray | null;
      while ((em = re.exec(entry)) !== null) results.push(em[1].trim());
      return results;
    };

    const rawId  = get('id');
    const id     = rawId.split('/abs/').pop() ?? rawId;
    const names  = getAll('name');
    const cats   = (entry.match(/term="([^"]+)"/g) ?? []).map((t) => t.replace(/term="|"/g, ''));

    entries.push({
      id,
      title:      get('title').replace(/\s+/g, ' '),
      summary:    get('summary').replace(/\s+/g, ' ').slice(0, 400) + '…',
      authors:    names.slice(0, 5),
      published:  get('published').split('T')[0],
      url:        `https://arxiv.org/abs/${id}`,
      categories: cats.slice(0, 3),
    });
  }
  return entries;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query  = searchParams.get('q') ?? '';
  const start  = searchParams.get('start') ?? '0';

  if (!query) return NextResponse.json({ results: [] });

  try {
    const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=${start}&max_results=10&sortBy=relevance`;
    const res  = await fetch(url, { next: { revalidate: 300 } });
    const xml  = await res.text();
    return NextResponse.json({ results: parseArxivXML(xml) });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
