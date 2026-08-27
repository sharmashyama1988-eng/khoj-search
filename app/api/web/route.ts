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

// Extract domain name cleanly
function getDomain(urlStr: string): string {
  try {
    const parsed = new URL(urlStr);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return 'web';
  }
}

// Generate source badge for popular platforms
function getSourceBadge(domain: string): string {
  if (domain.includes('reddit.com')) return 'Reddit';
  if (domain.includes('quora.com')) return 'Quora';
  if (domain.includes('stackoverflow.com') || domain.includes('stackexchange.com')) return 'StackOverflow';
  if (domain.includes('medium.com')) return 'Medium';
  if (domain.includes('dev.to')) return 'Dev.to';
  if (domain.includes('github.com')) return 'GitHub';
  if (domain.includes('wikipedia.org')) return 'Wikipedia';
  if (domain.includes('youtube.com')) return 'YouTube';
  if (domain.includes('arxiv.org')) return 'arXiv';
  return domain;
}

// Parse DuckDuckGo HTML output for real web results across all sites
async function fetchDuckDuckGoWeb(query: string): Promise<WebSearchResult[]> {
  try {
    const res = await fetch('https://html.duckduckgo.com/html/', {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `q=${encodeURIComponent(query)}&b=`,
      next: { revalidate: 120 },
    });

    if (!res.ok) return [];

    const html = await res.text();
    const results: WebSearchResult[] = [];

    // Match DDG HTML result blocks
    const resultRegex = /<a class="result__url" href="([^"]+)".*?>[\s\S]*?<a class="result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;
    const titleRegex  = /<a class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;

    const titles: Array<{ url: string; title: string }> = [];
    let tMatch;
    while ((tMatch = titleRegex.exec(html)) !== null) {
      let rawUrl = tMatch[1];
      // Decode DDG redirect URL if needed
      const uddgMatch = rawUrl.match(/uddg=([^&]+)/);
      if (uddgMatch) {
        rawUrl = decodeURIComponent(uddgMatch[1]);
      }
      const titleText = tMatch[2].replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
      if (rawUrl.startsWith('http') && titleText) {
        titles.push({ url: rawUrl, title: titleText });
      }
    }

    const snippets: string[] = [];
    let sMatch;
    while ((sMatch = resultRegex.exec(html)) !== null) {
      const snip = sMatch[2].replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
      snippets.push(snip);
    }

    titles.slice(0, 15).forEach((item, i) => {
      const domain = getDomain(item.url);
      results.push({
        id: `ddg-${i}-${Math.random().toString(36).slice(2, 6)}`,
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

// Fetch Wikipedia results for knowledge coverage
async function fetchWikipediaWeb(query: string, lang = 'en'): Promise<WebSearchResult[]> {
  try {
    const wikiBase = `https://${lang}.wikipedia.org`;
    const url = `${wikiBase}/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=8&format=json&origin=*`;
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

  let query = rawQuery.trim();

  // Check discussion/forum intent
  const isDiscussionIntent = /\b(reddit|quora|forum|review|opinion|vs|best|experiences|discussion|solution|fix)\b/i.test(query);

  try {
    const promises: Promise<WebSearchResult[]>[] = [];

    // 1. Primary global search
    promises.push(fetchDuckDuckGoWeb(query));

    // 2. Wikipedia search
    promises.push(fetchWikipediaWeb(query, lang));

    // 3. Query Expansion: If discussion topic, send parallel targeted search for Reddit / Quora / Forums!
    if (isDiscussionIntent && !query.includes('site:')) {
      const expandedQuery = `${query} (site:reddit.com OR site:quora.com OR site:stackoverflow.com OR site:medium.com)`;
      promises.push(fetchDuckDuckGoWeb(expandedQuery));
    }

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
      results: combined.slice(0, 25),
      total: combined.length,
      expanded: isDiscussionIntent,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
