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
  score?: number;
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
  if (domain.includes('apple.com')) return 'Apple';
  if (domain.includes('amazon.')) return 'Amazon';
  if (domain.includes('flipkart.com')) return 'Flipkart';
  if (domain.includes('gsmarena.com')) return 'GSMArena';
  return domain;
}

function computeEnterpriseRelevancyScore(query: string, title: string, description: string, domain: string): number {
  const cleanQ = query.toLowerCase().replace(/[^\w\s]/gi, '').trim();
  const cleanTitle = title.toLowerCase();
  const cleanDesc = description.toLowerCase();

  const queryTokens = cleanQ.split(/\s+/).filter((w) => w.length > 1);
  if (!queryTokens.length) return 100;

  let score = 0;

  if (cleanTitle.includes(cleanQ)) score += 100;
  if (cleanDesc.includes(cleanQ)) score += 50;

  let matchedTokensCount = 0;
  queryTokens.forEach((token) => {
    let matched = false;
    if (cleanTitle.includes(token)) {
      score += 30;
      matched = true;
    }
    if (cleanDesc.includes(token)) {
      score += 15;
      matched = true;
    }
    if (matched) matchedTokensCount++;
  });

  const matchRatio = matchedTokensCount / queryTokens.length;
  if (matchRatio < 0.2) {
    return -1000;
  }

  // Non-Wikipedia domains get an automatic boost so Wikipedia never dominates!
  if (!domain.includes('wikipedia.org')) {
    score += 40;
  }

  return score;
}

// 1. Google Web Scraper (Official Google text results)
async function fetchGoogleWeb(query: string): Promise<WebSearchResult[]> {
  try {
    const res = await fetch(`https://www.google.com/search?q=${encodeURIComponent(query)}&gbv=1`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      next: { revalidate: 120 },
    });

    if (!res.ok) return [];

    const html = await res.text();
    const results: WebSearchResult[] = [];

    const urlRegex = /\/url\?q=(https?:\/\/[^&]+)/gi;
    const matches = Array.from(html.matchAll(urlRegex));
    const seen = new Set<string>();

    let count = 0;
    for (const match of matches) {
      let rawUrl = match[1];
      try { rawUrl = decodeURIComponent(rawUrl); } catch {}

      if (rawUrl.includes('google.com') || rawUrl.includes('youtube.com/results') || seen.has(rawUrl)) continue;

      seen.add(rawUrl);
      const domain = getDomain(rawUrl);
      const slug = rawUrl.split('/').filter(Boolean).pop()?.replace(/[-_]/g, ' ') || domain;
      const cleanTitle = slug.charAt(0).toUpperCase() + slug.slice(1);

      results.push({
        id: `goog-${count++}-${Math.random().toString(36).slice(2, 6)}`,
        title: `${query.toUpperCase()} — ${cleanTitle}`,
        url: rawUrl,
        description: `Direct web result for "${query}" on ${domain}. Access latest news, official documentation, prices, specs, and user reviews.`,
        source: getSourceBadge(domain),
        domain,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
        badge: getSourceBadge(domain),
      });

      if (count >= 8) break;
    }

    return results;
  } catch {
    return [];
  }
}

// 2. DuckDuckGo HTML Web Search
async function fetchDuckDuckGoWeb(query: string): Promise<WebSearchResult[]> {
  try {
    const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const html = await res.text();
    const results: WebSearchResult[] = [];

    const linkRegex  = /<a class="result__snippet[^"]*"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
    const titleRegex = /<a class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;

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
      const snippet = snippets[i] || item.title;
      results.push({
        id: `ddg-${i}-${Math.random().toString(36).slice(2, 6)}`,
        title: item.title,
        url: item.url,
        description: snippet,
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

// 3. Reddit Search API
async function fetchRedditWeb(query: string): Promise<WebSearchResult[]> {
  try {
    const res = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=3&sort=relevance`, {
      headers: { 'User-Agent': 'Mozilla/5.0 KhojSearch/1.0' },
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
      description: p.data.selftext ? p.data.selftext.slice(0, 240) : `Reddit discussion on r/${p.data.subreddit}: ${p.data.title}`,
      source: 'Reddit',
      domain: 'reddit.com',
      favicon: 'https://www.google.com/s2/favicons?domain=reddit.com&sz=32',
      badge: 'Reddit',
    }));
  } catch {
    return [];
  }
}

// 4. Wikipedia Search API (STRICTLY CAPPED AT 1 ITEM MAX)
async function fetchWikipediaWeb(query: string, lang = 'en'): Promise<WebSearchResult[]> {
  try {
    const wikiBase = `https://${lang}.wikipedia.org`;
    const url = `${wikiBase}/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=1&format=json&origin=*`;
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
      fetchGoogleWeb(query),
      fetchDuckDuckGoWeb(query),
      fetchRedditWeb(query),
      fetchWikipediaWeb(query, lang),
    ];

    const fetchedBatches = await Promise.allSettled(promises);
    const combined: WebSearchResult[] = [];
    const seenUrls = new Set<string>();

    fetchedBatches.forEach((batch) => {
      if (batch.status === 'fulfilled') {
        batch.value.forEach((item) => {
          if (!seenUrls.has(item.url)) {
            const score = computeEnterpriseRelevancyScore(query, item.title, item.description, item.domain);
            if (score > -500) {
              seenUrls.add(item.url);
              combined.push({ ...item, score });
            }
          }
        });
      }
    });

    // Rank descending by Relevancy Score!
    combined.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

    return NextResponse.json({
      results: combined.slice(0, 15),
      total: combined.length,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
