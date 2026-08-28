import { NextRequest, NextResponse } from 'next/server';
import { applyReciprocalRankFusion, hybridReRank } from '@/lib/rerank';

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

function resolveDirectPortal(query: string): WebSearchResult | null {
  const clean = query.trim().toLowerCase();
  const urlPattern = /^(https?:\/\/)?(www\.)?([a-z0-9-]+(\.[a-z]{2,})+)(\/.*)?$/i;
  const match = clean.match(urlPattern);

  const FAMOUS_SITES: Record<string, { name: string; desc: string; domain: string }> = {
    'youtube': { name: 'YouTube', desc: 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.', domain: 'youtube.com' },
    'youtube.com': { name: 'YouTube', desc: 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.', domain: 'youtube.com' },
    'google': { name: 'Google', desc: 'Search the world\'s information, including webpages, images, videos and more.', domain: 'google.com' },
    'google.com': { name: 'Google', desc: 'Search the world\'s information, including webpages, images, videos and more.', domain: 'google.com' },
    'github': { name: 'GitHub: Let\'s build from here', desc: 'GitHub is where over 100 million developers shape the future of software, together. Contribute to open source, build web applications.', domain: 'github.com' },
    'github.com': { name: 'GitHub: Let\'s build from here', desc: 'GitHub is where over 100 million developers shape the future of software, together. Contribute to open source, build web applications.', domain: 'github.com' },
    'reddit': { name: 'Reddit - Dive into anything', desc: 'Reddit is a network of communities where people can dive into their interests, hobbies and passions.', domain: 'reddit.com' },
    'reddit.com': { name: 'Reddit - Dive into anything', desc: 'Reddit is a network of communities where people can dive into their interests, hobbies and passions.', domain: 'reddit.com' },
    'chatgpt': { name: 'ChatGPT - OpenAI', desc: 'ChatGPT is a free-to-use AI system. Use it for engaging conversations, gain insights, automate tasks, and witness the future of AI.', domain: 'chatgpt.com' },
    'chatgpt.com': { name: 'ChatGPT - OpenAI', desc: 'ChatGPT is a free-to-use AI system. Use it for engaging conversations, gain insights, automate tasks, and witness the future of AI.', domain: 'chatgpt.com' },
    'openai': { name: 'OpenAI', desc: 'OpenAI creates safe and powerful artificial general intelligence (AGI) that benefits all of humanity.', domain: 'openai.com' },
    'twitter': { name: 'X / Twitter', desc: 'From breaking news and entertainment to sports and politics, get the full story with all the live commentary.', domain: 'x.com' },
    'twitter.com': { name: 'X / Twitter', desc: 'From breaking news and entertainment to sports and politics, get the full story with all the live commentary.', domain: 'x.com' },
    'x': { name: 'X / Twitter', desc: 'From breaking news and entertainment to sports and politics, get the full story with all the live commentary.', domain: 'x.com' },
    'x.com': { name: 'X / Twitter', desc: 'From breaking news and entertainment to sports and politics, get the full story with all the live commentary.', domain: 'x.com' },
    'instagram': { name: 'Instagram', desc: 'Create an account or log in to Instagram. Share photos and videos with friends and discover creators around the globe.', domain: 'instagram.com' },
    'instagram.com': { name: 'Instagram', desc: 'Create an account or log in to Instagram. Share photos and videos with friends and discover creators around the globe.', domain: 'instagram.com' },
    'facebook': { name: 'Facebook - Log In or Sign Up', desc: 'Connect with friends, family and other people you know. Share photos and videos, send messages and get updates.', domain: 'facebook.com' },
    'facebook.com': { name: 'Facebook - Log In or Sign Up', desc: 'Connect with friends, family and other people you know. Share photos and videos, send messages and get updates.', domain: 'facebook.com' },
    'wikipedia': { name: 'Wikipedia, the free encyclopedia', desc: 'Wikipedia is a free online encyclopedia, created and edited by volunteers around the world.', domain: 'wikipedia.org' },
    'wikipedia.org': { name: 'Wikipedia, the free encyclopedia', desc: 'Wikipedia is a free online encyclopedia, created and edited by volunteers around the world.', domain: 'wikipedia.org' },
    'stackoverflow': { name: 'Stack Overflow', desc: 'Stack Overflow is the largest, most trusted online community for developers to learn, share their programming knowledge, and build their careers.', domain: 'stackoverflow.com' },
    'stackoverflow.com': { name: 'Stack Overflow', desc: 'Stack Overflow is the largest, most trusted online community for developers to learn, share their programming knowledge, and build their careers.', domain: 'stackoverflow.com' },
    'amazon': { name: 'Amazon.com: Online Shopping', desc: 'Online shopping from a great selection of electronics, clothing, computers, books, DVDs, and more.', domain: 'amazon.com' },
    'amazon.com': { name: 'Amazon.com: Online Shopping', desc: 'Online shopping from a great selection of electronics, clothing, computers, books, DVDs, and more.', domain: 'amazon.com' },
    'netflix': { name: 'Netflix - Watch TV Shows Online', desc: 'Watch Netflix movies & TV shows online or stream right to your smart TV, game console, PC, Mac, mobile, tablet and more.', domain: 'netflix.com' },
    'netflix.com': { name: 'Netflix - Watch TV Shows Online', desc: 'Watch Netflix movies & TV shows online or stream right to your smart TV, game console, PC, Mac, mobile, tablet and more.', domain: 'netflix.com' },
    'quora': { name: 'Quora', desc: 'Quora is a place to gain and share knowledge. It\'s a platform to ask questions and connect with people who contribute unique insights.', domain: 'quora.com' },
    'quora.com': { name: 'Quora', desc: 'Quora is a place to gain and share knowledge. It\'s a platform to ask questions and connect with people who contribute unique insights.', domain: 'quora.com' },
    'linkedin': { name: 'LinkedIn', desc: 'Manage your professional identity. Build and engage with your professional network. Access knowledge, insights and opportunities.', domain: 'linkedin.com' },
    'linkedin.com': { name: 'LinkedIn', desc: 'Manage your professional identity. Build and engage with your professional network. Access knowledge, insights and opportunities.', domain: 'linkedin.com' }
  };

  const key = clean.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/.*$/, '');
  if (FAMOUS_SITES[key]) {
    const site = FAMOUS_SITES[key];
    const fullUrl = `https://www.${site.domain}`;
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

async function fetchDuckDuckGoWeb(query: string): Promise<WebSearchResult[]> {
  try {
    const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      next: { revalidate: 60 },
    });

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
      const snippet = snippets[i] || `Information, resources, and discussion about ${query} on ${domain}.`;
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
      data.RelatedTopics.slice(0, 6).forEach((item, idx) => {
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

async function fetchRedditWeb(query: string): Promise<WebSearchResult[]> {
  try {
    const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(`site:reddit.com ${query}`)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      next: { revalidate: 120 },
    });
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
      if (rawUrl.includes('reddit.com') && titleText) {
        titles.push({ url: rawUrl, title: titleText });
      }
    }

    const snippets: string[] = [];
    let sMatch;
    while ((sMatch = snippetRegex.exec(html)) !== null) {
      snippets.push(decodeHtml(sMatch[2]));
    }

    titles.slice(0, 4).forEach((item, i) => {
      results.push({
        id: `reddit-${i}-${Math.random().toString(36).slice(2, 6)}`,
        title: item.title.replace(/ : r\/.*$/i, '').replace(/ - Reddit$/i, ''),
        url: item.url,
        description: snippets[i] || `Reddit community discussions, feedback, and user experiences for: ${item.title}`,
        source: 'Reddit',
        domain: 'reddit.com',
        favicon: 'https://www.google.com/s2/favicons?domain=reddit.com&sz=32',
        badge: 'Reddit',
      });
    });

    return results;
  } catch {
    return [];
  }
}

async function fetchStackOverflowWeb(query: string): Promise<WebSearchResult[]> {
  try {
    const res = await fetch(
      `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${encodeURIComponent(query)}&site=stackoverflow&pagesize=4`,
      { next: { revalidate: 180 } }
    );
    if (!res.ok) return [];

    const data = await res.json() as {
      items?: Array<{ question_id: number; title: string; link: string; score: number; answer_count: number; tags: string[] }>;
    };

    const items = data.items ?? [];
    return items.map((item) => ({
      id: `so-${item.question_id}`,
      title: decodeHtml(item.title),
      url: item.link,
      description: `Stack Overflow [Score: ${item.score}, ${item.answer_count} Answers]. Tags: ${item.tags?.slice(0, 4).join(', ') || 'programming'}.`,
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

async function fetchQuoraWeb(query: string): Promise<WebSearchResult[]> {
  try {
    const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(`site:quora.com ${query}`)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      next: { revalidate: 120 },
    });
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
      if (rawUrl.includes('quora.com') && titleText) {
        titles.push({ url: rawUrl, title: titleText });
      }
    }

    const snippets: string[] = [];
    let sMatch;
    while ((sMatch = snippetRegex.exec(html)) !== null) {
      snippets.push(decodeHtml(sMatch[2]));
    }

    titles.slice(0, 3).forEach((item, i) => {
      results.push({
        id: `quora-${i}-${Math.random().toString(36).slice(2, 6)}`,
        title: item.title.replace(/ - Quora$/i, ''),
        url: item.url,
        description: snippets[i] || `Read questions, insights, and discussions on Quora: ${item.title}`,
        source: 'Quora',
        domain: 'quora.com',
        favicon: 'https://www.google.com/s2/favicons?domain=quora.com&sz=32',
        badge: 'Quora',
      });
    });

    return results;
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

    const promises = [
      fetchDuckDuckGoWeb(query),
      fetchDuckDuckGoAPI(query),
      fetchRedditWeb(query),
      fetchQuoraWeb(query),
      fetchStackOverflowWeb(query),
      fetchGitHubWeb(query),
      fetchWikipediaWeb(query, lang),
    ];

    const fetchedBatches = await Promise.allSettled(promises);
    const rankedEngineLists: WebSearchResult[][] = [];

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

    // 2. Hybrid Lexical (BM25+) + Contextual Re-Ranker
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
