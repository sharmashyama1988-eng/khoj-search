import { NextRequest, NextResponse } from 'next/server';
import { getMatchingBangs } from '@/lib/bangs';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q    = (searchParams.get('q') ?? '').trim();
  const lang = searchParams.get('lang') ?? 'en';

  if (!q) return NextResponse.json({ suggestions: [], bangs: [] });

  // 1. If user typed "!", return matching DuckDuckGo bangs
  if (q.startsWith('!')) {
    const matchedBangs = getMatchingBangs(q, 8);
    const bangSuggestions = matchedBangs.map(b => `${b.prefix} ${b.name}`);
    return NextResponse.json({
      suggestions: bangSuggestions,
      bangs: matchedBangs,
      source: 'bangs'
    });
  }

  try {
    const promises = [
      // 1. DuckDuckGo Autocomplete API
      fetch(`https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}&type=list`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        next: { revalidate: 60 },
      })
        .then(r => r.ok ? r.json() : null)
        .catch(() => null),

      // 2. Google Autocomplete API
      fetch(`https://suggestqueries.google.com/complete/search?client=chrome&hl=${lang}&q=${encodeURIComponent(q)}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        next: { revalidate: 60 },
      })
        .then(r => r.ok ? r.json() : null)
        .catch(() => null),
    ];

    const [ddgData, googleData] = await Promise.allSettled(promises);
    const suggestionsSet = new Set<string>();

    // Parse DuckDuckGo results ([query, [suggestions]])
    if (ddgData.status === 'fulfilled' && Array.isArray(ddgData.value)) {
      const ddgList = ddgData.value[1];
      if (Array.isArray(ddgList)) {
        ddgList.forEach((item: string | { phrase?: string }) => {
          const str = typeof item === 'string' ? item : item?.phrase;
          if (str && typeof str === 'string') suggestionsSet.add(str.trim());
        });
      }
    }

    // Parse Google results
    if (googleData.status === 'fulfilled' && Array.isArray(googleData.value)) {
      const gList = googleData.value[1];
      if (Array.isArray(gList)) {
        gList.forEach((item: string) => {
          if (item && typeof item === 'string') suggestionsSet.add(item.trim());
        });
      }
    }

    const suggestions = Array.from(suggestionsSet).slice(0, 8);

    return NextResponse.json({
      suggestions,
      source: 'hybrid-ddg-google',
    });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}