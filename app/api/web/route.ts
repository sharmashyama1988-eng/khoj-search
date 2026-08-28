import { NextRequest, NextResponse } from 'next/server';
import { applyReciprocalRankFusion, hybridReRank } from '@/lib/rerank';
import { resolveInstantMathOrFact } from '@/lib/knowledge';

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
  rank?: number;
  date?: string;
}

function decodeHtml(htmlStr: string): string {
  return htmlStr
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]*>/g, '')
    .trim();
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
  const d = domain.toLowerCase();
  if (d.includes('reddit.com')) return 'Reddit';
  if (d.includes('quora.com')) return 'Quora';
  if (d.includes('stackoverflow.com') || d.includes('stackexchange.com')) return 'StackOverflow';
  if (d.includes('medium.com')) return 'Medium';
  if (d.includes('dev.to')) return 'Dev.to';
  if (d.includes('github.com')) return 'GitHub';
  if (d.includes('wikipedia.org')) return 'Wikipedia';
  if (d.includes('youtube.com')) return 'YouTube';
  if (d.includes('apple.com')) return 'Apple';
  if (d.includes('amazon.')) return 'Amazon';
  if (d.includes('flipkart.com')) return 'Flipkart';
  if (d.includes('gsmarena.com')) return 'GSMArena';
  if (d.includes('w3schools.com') || d.includes('mozilla.org') || d.includes('mdn.')) return 'Docs';
  if (d.includes('geeksforgeeks.org')) return 'GeeksforGeeks';
  if (d.includes('twitter.com') || d.includes('x.com')) return 'X / Twitter';
  if (d.includes('linkedin.com')) return 'LinkedIn';
  return domain;
}

function resolveInstantKnowledgeResult(query: string): WebSearchResult | null {
  const match = resolveInstantMathOrFact(query);
  if (!match) return null;

  const isMath = match.type === 'math_identity';
  const isScience = match.type === 'science_constant' || match.type === 'math_constant';
  const isBiography = match.type === 'direct_fact';

  const badge = isMath ? 'Verified Math' : isScience ? 'Science Constant' : isBiography ? 'Biography' : 'Knowledge';
  const domain = isMath ? 'math.wikipedia.org' : 'en.wikipedia.org';
  const entitySlug = match.title.split(' — ')[0].replace(/ /g, '_');
  const url = isMath
    ? 'https://en.wikipedia.org/wiki/Algebraic_identity'
    : `https://en.wikipedia.org/wiki/${encodeURIComponent(entitySlug)}`;

  return {
    id: `instant-knowledge-${Math.random().toString(36).slice(2, 7)}`,
    title: isMath ? `${match.title} — Exact Formula, Derivation & Geometric Proof` : match.title,
    url,
    description: match.extract,
    source: match.source || 'Knowledge Graph',
    domain,
    favicon: 'https://www.google.com/s2/favicons?domain=wikipedia.org&sz=32',
    badge,
    score: 1000,
  };
}

function resolveDirectPortal(query: string): WebSearchResult | null {
  const clean = query.trim().toLowerCase();
  const urlPattern = /^(https?:\/\/)?(www\.)?([a-z0-9-]+(\.[a-z]{2,})+)(\/.*)?$/i;
  const match = clean.match(urlPattern);

  const FAMOUS_SITES: Record<string, { name: string; desc: string; domain: string; url?: string }> = {
    'youtube': { name: 'YouTube', desc: 'Enjoy videos, music, tutorials and live streams on YouTube.', domain: 'youtube.com' },
    'youtube.com': { name: 'YouTube', desc: 'Enjoy videos, music, tutorials and live streams on YouTube.', domain: 'youtube.com' },
    'google': { name: 'Google', desc: 'Search the world\'s information, webpages, and tools.', domain: 'google.com' },
    'google.com': { name: 'Google', desc: 'Search the world\'s information, webpages, and tools.', domain: 'google.com' },
    'github': { name: 'GitHub', desc: 'Where over 100 million developers build software and open-source packages.', domain: 'github.com' },
    'github.com': { name: 'GitHub', desc: 'Where over 100 million developers build software and open-source packages.', domain: 'github.com' },
    'reddit': { name: 'Reddit', desc: 'Dive into communities, questions, opinions, and trending discussions.', domain: 'reddit.com' },
    'reddit.com': { name: 'Reddit', desc: 'Dive into communities, questions, opinions, and trending discussions.', domain: 'reddit.com' },
    'chatgpt': { name: 'ChatGPT - OpenAI', desc: 'Free AI system for reasoning, programming, creative work and search.', domain: 'chatgpt.com' },
    'chatgpt.com': { name: 'ChatGPT - OpenAI', desc: 'Free AI system for reasoning, programming, creative work and search.', domain: 'chatgpt.com' },
    'openai': { name: 'OpenAI', desc: 'Pioneering artificial general intelligence and AI models.', domain: 'openai.com' },
    'twitter': { name: 'X / Twitter', desc: 'Real-time breaking news, live sports, politics, and discussions.', domain: 'x.com' },
    'twitter.com': { name: 'X / Twitter', desc: 'Real-time breaking news, live sports, politics, and discussions.', domain: 'x.com' },
    'x': { name: 'X / Twitter', desc: 'Real-time breaking news, live sports, politics, and discussions.', domain: 'x.com' },
    'x.com': { name: 'X / Twitter', desc: 'Real-time breaking news, live sports, politics, and discussions.', domain: 'x.com' },
    'wikipedia': { name: 'Wikipedia', desc: 'The free encyclopedia written collaboratively by volunteers.', domain: 'wikipedia.org' },
    'wikipedia.org': { name: 'Wikipedia', desc: 'The free encyclopedia written collaboratively by volunteers.', domain: 'wikipedia.org' },
    'stackoverflow': { name: 'Stack Overflow', desc: 'The largest community for developers to learn, share code, and solve bugs.', domain: 'stackoverflow.com' },
    'stackoverflow.com': { name: 'Stack Overflow', desc: 'The largest community for developers to learn, share code, and solve bugs.', domain: 'stackoverflow.com' },
    'netflix': { name: 'Netflix', desc: 'Watch movies, TV shows, and original series streaming online.', domain: 'netflix.com' },
    'netflix.com': { name: 'Netflix', desc: 'Watch movies, TV shows, and original series streaming online.', domain: 'netflix.com' },
  };

  const key = clean.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/.*$/, '');
  if (FAMOUS_SITES[key]) {
    const site = FAMOUS_SITES[key];
    const fullUrl = site.url || `https://www.${site.domain}`;
    return {
      id: `direct-${site.domain}`,
      title: `${site.name} — Official Website`,
      url: fullUrl,
      description: site.desc,
      source: getSourceBadge(site.domain),
      domain: site.domain,
      favicon: `https://www.google.com/s2/favicons?domain=${site.domain}&sz=32`,
      badge: 'Official Site',
      score: 999,
    };
  }

  if (match) {
    const domain = match[3];
    const cleanUrl = clean.startsWith('http') ? clean : `https://${clean}`;
    return {
      id: `direct-url-${domain}`,
      title: `${domain.toUpperCase()} — Official Portal`,
      url: cleanUrl,
      description: `Direct web portal for ${domain}. Access services, media, news, user accounts, and documentation.`,
      source: getSourceBadge(domain),
      domain,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
      badge: 'Direct URL',
      score: 950,
    };
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Google Custom Search Engine API (When GOOGLE_SEARCH_API_KEY is configured)
// ─────────────────────────────────────────────────────────────────────────────
async function fetchGoogleCustomSearch(query: string, lang = 'en'): Promise<WebSearchResult[]> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY || '';
  const cx = process.env.GOOGLE_SEARCH_CX || '';
  if (!apiKey || !cx) return [];

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);

    const url = `https://customsearch.googleapis.com/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}&hl=${lang}&num=10`;
    const res = await fetch(url, { signal: controller.signal, next: { revalidate: 300 } });
    clearTimeout(timer);

    if (!res.ok) return [];
    const data = await res.json() as {
      items?: Array<{ title: string; link: string; snippet: string; displayLink?: string }>;
    };

    const items = data.items ?? [];
    return items.map((item, idx) => {
      const domain = item.displayLink ? item.displayLink.replace(/^www\./, '') : getDomain(item.link);
      return {
        id: `google-cs-${idx}`,
        title: item.title,
        url: item.link,
        description: item.snippet,
        source: 'Google Web',
        domain,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
        badge: 'Google',
        score: 980,
      };
    });
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Google News Live Real-Time RSS Stream (Minute-by-minute live fresh data)
// ─────────────────────────────────────────────────────────────────────────────
async function fetchGoogleNewsLive(query: string, lang = 'en'): Promise<WebSearchResult[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);

    const hl = lang === 'hi' ? 'hi' : 'en-IN';
    const gl = lang === 'hi' ? 'IN' : 'IN';
    const ceid = lang === 'hi' ? 'IN:hi' : 'IN:en';

    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      signal: controller.signal,
      next: { revalidate: 60 },
    });
    clearTimeout(timer);

    if (!res.ok) return [];
    const xml = await res.text();
    const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

    const results: WebSearchResult[] = [];
    items.slice(0, 8).forEach((item, idx) => {
      const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
      const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
      const dateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
      const sourceMatch = item.match(/<source[^>]*>([\s\S]*?)<\/source>/);

      if (titleMatch && linkMatch) {
        const fullTitle = decodeHtml(titleMatch[1]);
        const sourceName = sourceMatch ? decodeHtml(sourceMatch[1]) : 'Live News';
        const dateStr = dateMatch
          ? new Date(dateMatch[1]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : 'Today';

        results.push({
          id: `news-${idx}-${Math.random().toString(36).slice(2, 6)}`,
          title: fullTitle,
          url: linkMatch[1].trim(),
          description: `Latest coverage from ${sourceName} (${dateStr}).`,
          source: sourceName,
          domain: 'news.google.com',
          favicon: `https://www.google.com/s2/favicons?domain=google.com&sz=32`,
          badge: '🔴 Live News',
          date: dateStr,
          score: 850,
        });
      }
    });

    return results;
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. DuckDuckGo Fresh Real-Time Search (df=y Past Year parameter)
// ─────────────────────────────────────────────────────────────────────────────
async function fetchDuckDuckGoWeb(query: string): Promise<WebSearchResult[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}&df=y`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
      next: { revalidate: 60 },
    });
    clearTimeout(timer);

    if (!res.ok) return [];

    const html = await res.text();
    const results: WebSearchResult[] = [];

    const titleRegex = /<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    const snippetRegex = /<a[^>]+class="[^"]*result__snippet[^"]*"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;

    const titles: Array<{ url: string; title: string }> = [];
    let tMatch;
    while ((tMatch = titleRegex.exec(html)) !== null) {
      let rawUrl = tMatch[1];
      const uddgMatch = rawUrl.match(/uddg=([^&]+)/);
      if (uddgMatch) {
        try { rawUrl = decodeURIComponent(uddgMatch[1]); } catch {}
      }
      const titleText = decodeHtml(tMatch[2]);
      if (rawUrl.startsWith('http') && titleText) {
        titles.push({ url: rawUrl, title: titleText });
      }
    }

    const snippets: string[] = [];
    let sMatch;
    while ((sMatch = snippetRegex.exec(html)) !== null) {
      snippets.push(decodeHtml(sMatch[2]));
    }

    titles.forEach((item, i) => {
      const domain = getDomain(item.url);
      const snippet = snippets[i] || `Latest resources, guides, and discussions about ${query} on ${domain}.`;
      results.push({
        id: `ddg-${i}-${Math.random().toString(36).slice(2, 7)}`,
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

async function fetchDuckDuckGoAPI(query: string): Promise<WebSearchResult[]> {
  try {
    const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return [];
    const data = await res.json() as {
      Heading?: string;
      AbstractText?: string;
      AbstractURL?: string;
      RelatedTopics?: Array<{ FirstURL?: string; Text?: string }>;
    };

    const results: WebSearchResult[] = [];

    if (data.AbstractURL && data.AbstractText) {
      const domain = getDomain(data.AbstractURL);
      results.push({
        id: `ddg-api-main`,
        title: data.Heading || query,
        url: data.AbstractURL,
        description: data.AbstractText,
        source: getSourceBadge(domain),
        domain,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
        badge: 'Instant Answer',
      });
    }

    if (Array.isArray(data.RelatedTopics)) {
      data.RelatedTopics.slice(0, 5).forEach((item, idx) => {
        if (item.FirstURL && item.Text) {
          const domain = getDomain(item.FirstURL);
          results.push({
            id: `ddg-api-rel-${idx}`,
            title: item.Text.split(' - ')[0] || item.Text.slice(0, 60),
            url: item.FirstURL,
            description: item.Text,
            source: getSourceBadge(domain),
            domain,
            favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
            badge: getSourceBadge(domain),
          });
        }
      });
    }

    return results;
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Reddit Recent Community Discussions (t=year sort)
// ─────────────────────────────────────────────────────────────────────────────
async function fetchRedditWeb(query: string): Promise<WebSearchResult[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&t=year&limit=6`,
      {
        headers: { 'User-Agent': 'KhojSearch/2.0 (by /u/khoj_app)' },
        signal: controller.signal,
        next: { revalidate: 180 },
      }
    );
    clearTimeout(timer);

    if (!res.ok) return [];

    const data = await res.json() as {
      data?: {
        children?: Array<{
          data: {
            id: string;
            title: string;
            permalink: string;
            selftext: string;
            subreddit_name_prefixed: string;
            score: number;
            num_comments: number;
            created_utc: number;
          };
        }>;
      };
    };

    const posts = data.data?.children ?? [];
    return posts.map((p) => {
      const d = p.data;
      const dateStr = new Date(d.created_utc * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      return {
        id: `reddit-${d.id}`,
        title: `${d.title} : ${d.subreddit_name_prefixed}`,
        url: `https://reddit.com${d.permalink}`,
        description: d.selftext ? d.selftext.slice(0, 220) : `Reddit community discussion with ${d.score} upvotes and ${d.num_comments} comments (${dateStr}).`,
        source: 'Reddit',
        domain: 'reddit.com',
        favicon: 'https://www.google.com/s2/favicons?domain=reddit.com&sz=32',
        badge: 'Reddit',
        date: dateStr,
      };
    });
  } catch {
    return [];
  }
}

async function fetchStackOverflowWeb(query: string): Promise<WebSearchResult[]> {
  try {
    const res = await fetch(
      `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${encodeURIComponent(query)}&site=stackoverflow&pagesize=4&filter=default`,
      { headers: { 'User-Agent': 'KhojSearch/2.0' }, next: { revalidate: 300 } }
    );
    if (!res.ok) return [];

    const data = await res.json() as {
      items?: Array<{ question_id: number; title: string; link: string; score: number; answer_count: number; is_answered: boolean }>;
    };

    const items = data.items ?? [];
    return items.map((item) => ({
      id: `so-${item.question_id}`,
      title: `${decodeHtml(item.title)} - Stack Overflow`,
      url: item.link,
      description: `StackOverflow Developer Solution (${item.score} votes, ${item.answer_count} answers${item.is_answered ? ' • Accepted Answer ✓' : ''}).`,
      source: 'StackOverflow',
      domain: 'stackoverflow.com',
      favicon: 'https://www.google.com/s2/favicons?domain=stackoverflow.com&sz=32',
      badge: 'StackOverflow',
    }));
  } catch {
    return [];
  }
}

async function fetchGitHubWeb(query: string): Promise<WebSearchResult[]> {
  try {
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=3`,
      { headers: { 'User-Agent': 'KhojSearch/2.0' }, next: { revalidate: 180 } }
    );
    if (!res.ok) return [];

    const data = await res.json() as {
      items?: Array<{ id: number; full_name: string; html_url: string; description: string; stargazers_count: number; language: string }>;
    };

    const items = data.items ?? [];
    return items.map((item) => ({
      id: `gh-${item.id}`,
      title: `${item.full_name} — GitHub`,
      url: item.html_url,
      description: item.description ? `${item.description} (⭐ ${item.stargazers_count} stars${item.language ? ` • ${item.language}` : ''})` : `GitHub repository with ${item.stargazers_count} stars.`,
      source: 'GitHub',
      domain: 'github.com',
      favicon: 'https://www.google.com/s2/favicons?domain=github.com&sz=32',
      badge: 'GitHub',
    }));
  } catch {
    return [];
  }
}

async function fetchWikipediaWeb(query: string, lang = 'en'): Promise<WebSearchResult[]> {
  try {
    const wikiBase = `https://${lang}.wikipedia.org`;
    const url = `${wikiBase}/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=3&format=json&origin=*`;
    const res = await fetch(url, { next: { revalidate: 120 } });
    if (!res.ok) return [];

    const data = await res.json() as { query?: { search?: Array<{ pageid: number; title: string; snippet: string }> } };
    const items = data.query?.search ?? [];

    return items.map((r) => {
      const cleanDesc = decodeHtml(r.snippet);
      return {
        id: `wiki-${r.pageid}`,
        title: `${r.title} — Wikipedia`,
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
  const limit    = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 30);

  if (!rawQuery.trim()) {
    return NextResponse.json({ results: [], total: 0 });
  }

  const query = rawQuery.trim();

  try {
    const directPortal = resolveDirectPortal(query);
    const instantKnowledge = resolveInstantKnowledgeResult(query);

    const promises = [
      fetchGoogleCustomSearch(query, lang),
      fetchGoogleNewsLive(query, lang),
      fetchDuckDuckGoWeb(query),
      fetchDuckDuckGoAPI(query),
      fetchRedditWeb(query),
      fetchStackOverflowWeb(query),
      fetchGitHubWeb(query),
      fetchWikipediaWeb(query, lang),
    ];

    const fetchedBatches = await Promise.allSettled(promises);
    const rankedEngineLists: WebSearchResult[][] = [];

    if (instantKnowledge) {
      rankedEngineLists.push([instantKnowledge]);
    }
    if (directPortal) {
      rankedEngineLists.push([directPortal]);
    }

    fetchedBatches.forEach((batch) => {
      if (batch.status === 'fulfilled' && batch.value.length > 0) {
        rankedEngineLists.push(batch.value);
      }
    });

    // 1. Reciprocal Rank Fusion (RRF) across multi-engine lists
    const fusedCandidates = applyReciprocalRankFusion(rankedEngineLists, 60);

    // 2. Hybrid BM25F + Temporal Freshness + Google Priority Re-Ranker
    const rankedResults = hybridReRank(query, fusedCandidates, limit);

    return NextResponse.json({
      results: rankedResults,
      total: rankedResults.length,
      query,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e), results: [], total: 0 }, { status: 500 });
  }
}
