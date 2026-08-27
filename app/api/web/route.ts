import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export interface WebSearchResult {
  id: string;
  title: string;
  url: string;
  description: string;
  source: string;
  domain: string;
  favicon?: string;
  badge?: string;
}

function getDomain(urlStr: string): string {
  try {
    const parsed = new URL(urlStr);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return 'web';
  }
}

function getSourceBadge(domain: string): string {
  if (domain.includes('reddit.com')) return 'Reddit';
  if (domain.includes('quora.com')) return 'Quora';
  if (domain.includes('stackoverflow.com') || domain.includes('stackexchange.com')) return 'StackOverflow';
  if (domain.includes('medium.com')) return 'Medium';
  if (domain.includes('dev.to')) return 'Dev.to';
  if (domain.includes('github.com')) return 'GitHub';
  if (domain.includes('wikipedia.org')) return 'Wikipedia';
  if (domain.includes('youtube.com')) return 'YouTube';
  if (domain.includes('openlibrary.org')) return 'Open Library';
  if (domain.includes('arxiv.org')) return 'arXiv';
  return domain;
}

// 1. DuckDuckGo Lite fetcher (serverless-friendly plain HTML)
async function fetchDuckDuckGoLite(query: string): Promise<WebSearchResult[]> {
  try {
    const res = await fetch(`https://lite.duckduckgo.com/lite/`, {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `q=${encodeURIComponent(query)}`,
      next: { revalidate: 120 },
    });

    if (!res.ok) return [];

    const html = await res.text();
    const results: WebSearchResult[] = [];

    const linkRegex = /<a class="result-snippet"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    const titleRegex = /<a rel="nofollow" class='result-link' href="([^"]+)">([\s\S]*?)<\/a>/gi;

    const titles: Array<{ url: string; title: string }> = [];
    let tMatch;
    while ((tMatch = titleRegex.exec(html)) !== null) {
      let rawUrl = tMatch[1];
      const uddgMatch = rawUrl.match(/uddg=([^&]+)/);
      if (uddgMatch) rawUrl = decodeURIComponent(uddgMatch[1]);
      const titleText = tMatch[2].replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
      if (rawUrl.startsWith('http') && titleText) {
        titles.push({ url: rawUrl, title: titleText });
      }
    }

    const snippets: string[] = [];
    let sMatch;
    while ((sMatch = linkRegex.exec(html)) !== null) {
      snippets.push(sMatch[2].replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim());
    }

    titles.slice(0, 10).forEach((item, i) => {
      const domain = getDomain(item.url);
      results.push({
        id: `ddg-lite-${i}-${Math.random().toString(36).slice(2, 6)}`,
        title: item.title,
        url: item.url,
        description: snippets[i] || item.title,
        source: getSourceBadge(domain),
        domain,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
        badge: getSourceBadge(domain),
      });
    });

    return results;
  } catch {
    return [];
  }
}

// 2. Reddit Open Search API
async function fetchRedditWeb(query: string): Promise<WebSearchResult[]> {
  try {
    const res = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=4&sort=relevance`, {
      headers: { 'User-Agent': 'KhojSearch/1.0' },
      next: { revalidate: 180 },
    });
    if (!res.ok) return [];

    const data = await res.json() as {
      data?: { children?: Array<{ data: { id: string; title: string; permalink: string; selftext: string; subreddit: string } }> };
    };

    const posts = data.data?.children ?? [];
    return posts.map((p) => ({
      id: `reddit-${p.data.id}`,
      title: `${p.data.title} (r/${p.data.subreddit})`,
      url: `https://www.reddit.com${p.data.permalink}`,
      description: p.data.selftext ? p.data.selftext.slice(0, 240) : `Discussion on r/${p.data.subreddit} about ${p.data.title}`,
      source: 'Reddit',
      domain: 'reddit.com',
      favicon: 'https://www.google.com/s2/favicons?domain=reddit.com&sz=32',
      badge: 'Reddit',
    }));
  } catch {
    return [];
  }
}

// 3. StackOverflow Open API
async function fetchStackOverflowWeb(query: string): Promise<WebSearchResult[]> {
  try {
    const res = await fetch(`https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${encodeURIComponent(query)}&site=stackoverflow&pagesize=3`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];

    const data = await res.json() as { items?: Array<{ question_id: number; title: string; link: string; body_markdown?: string }> };
    const items = data.items ?? [];

    return items.map((q) => ({
      id: `so-${q.question_id}`,
      title: q.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&'),
      url: q.link,
      description: q.body_markdown ? q.body_markdown.slice(0, 240) : `StackOverflow question and answers regarding ${q.title}`,
      source: 'StackOverflow',
      domain: 'stackoverflow.com',
      favicon: 'https://www.google.com/s2/favicons?domain=stackoverflow.com&sz=32',
      badge: 'StackOverflow',
    }));
  } catch {
    return [];
  }
}

// 4. Dev.to Tech Articles API
async function fetchDevToWeb(query: string): Promise<WebSearchResult[]> {
  try {
    const res = await fetch(`https://dev.to/api/articles?search=${encodeURIComponent(query)}&per_page=3`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];

    const articles = await res.json() as Array<{ id: number; title: string; url: string; description: string }>;
    return (articles || []).map((a) => ({
      id: `devto-${a.id}`,
      title: a.title,
      url: a.url,
      description: a.description || a.title,
      source: 'Dev.to',
      domain: 'dev.to',
      favicon: 'https://www.google.com/s2/favicons?domain=dev.to&sz=32',
      badge: 'Dev.to',
    }));
  } catch {
    return [];
  }
}

// 5. Wikipedia (Strictly Capped at 2 items max)
async function fetchWikipediaWeb(query: string, lang = 'en'): Promise<WebSearchResult[]> {
  try {
    const wikiBase = `https://${lang}.wikipedia.org`;
    const url = `${wikiBase}/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=2&format=json&origin=*`;
    const res = await fetch(url, { next: { revalidate: 120 } });
    if (!res.ok) return [];

    const data = await res.json() as { query?: { search?: Array<{ pageid: number; title: string; snippet: string }> } };
    const items = data.query?.search ?? [];

    return items.map((r) => {
      const cleanDesc = r.snippet.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
      return {
        id: `wiki-${r.pageid}`,
        title: r.title,
        url: `${wikiBase}/wiki/${encodeURIComponent(r.title.replace(/ /g, '_'))}`,
        description: cleanDesc,
        source: 'Wikipedia',
        domain: `${lang}.wikipedia.org`,
        favicon: 'https://www.google.com/s2/favicons?domain=wikipedia.org&sz=32',
        badge: 'Wikipedia',
      };
    });
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawQuery = searchParams.get('q') ?? '';
  const lang     = searchParams.get('lang') ?? 'en';

  if (!rawQuery.trim()) return NextResponse.json({ results: [] });

  const query = rawQuery.trim();

  try {
    const promises = [
      fetchDuckDuckGoLite(query),
      fetchRedditWeb(query),
      fetchStackOverflowWeb(query),
      fetchDevToWeb(query),
      fetchWikipediaWeb(query, lang),
    ];

    const fetchedBatches = await Promise.allSettled(promises);
    const combined: WebSearchResult[] = [];
    const seenUrls = new Set<string>();

    fetchedBatches.forEach((batch) => {
      if (batch.status === 'fulfilled') {
        batch.value.forEach((item) => {
          if (!seenUrls.has(item.url)) {
            seenUrls.add(item.url);
            combined.push(item);
          }
        });
      }
    });

    return NextResponse.json({
      results: combined.slice(0, 20),
      total: combined.length,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
