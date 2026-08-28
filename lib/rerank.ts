import type { SearchResult } from '@/types';

export interface RankedSourceItem {
  result: SearchResult;
  sourceName: string;
  sourceRank: number; // 1-indexed rank from individual search engine
}

// 1. Reciprocal Rank Fusion (RRF) Algorithm
// Formula: RRF(d) = Sum_{m in M} (1 / (k + r_m(d)))
export function applyReciprocalRankFusion(
  rankedLists: SearchResult[][],
  k: number = 60
): SearchResult[] {
  const scoreMap = new Map<string, { result: SearchResult; rrfScore: number; appearances: number }>();

  rankedLists.forEach((list) => {
    list.forEach((item, index) => {
      const canonicalKey = normalizeUrlKey(item.url);
      const rank = index + 1;
      const rrfIncrement = 1 / (k + rank);

      if (!scoreMap.has(canonicalKey)) {
        scoreMap.set(canonicalKey, {
          result: { ...item },
          rrfScore: rrfIncrement,
          appearances: 1,
        });
      } else {
        const existing = scoreMap.get(canonicalKey)!;
        existing.rrfScore += rrfIncrement;
        existing.appearances += 1;
        // Merge richer description/title if available
        if (item.description && item.description.length > existing.result.description.length) {
          existing.result.description = item.description;
        }
      }
    });
  });

  // Convert to array and sort by RRF score descending
  const fused = Array.from(scoreMap.values())
    .sort((a, b) => b.rrfScore - a.rrfScore)
    .map((entry) => ({
      ...entry.result,
      score: Math.round(entry.rrfScore * 10000),
    }));

  return fused;
}

// 2. BM25+ / Lexical & Semantic Hybrid Cross-ReRanker
export function hybridReRank(
  query: string,
  candidates: SearchResult[],
  maxResults: number = 20
): SearchResult[] {
  const queryTokens = tokenize(query);
  const cleanQ = queryTokens.join(' ');

  const scored = candidates.map((item) => {
    let score = (item.score ?? 50);

    const title = item.title.toLowerCase();
    const snippet = item.description.toLowerCase();
    const domain = (item.domain || '').toLowerCase();

    // Exact query matching boost
    if (cleanQ && title.includes(cleanQ)) score += 120;
    if (cleanQ && snippet.includes(cleanQ)) score += 60;
    if (queryTokens.some((t) => domain.includes(t))) score += 150;

    // Token frequency & BM25+ simulation
    let tokenMatches = 0;
    queryTokens.forEach((token) => {
      let matched = false;
      if (title.includes(token)) {
        score += 35;
        matched = true;
      }
      if (snippet.includes(token)) {
        score += 15;
        matched = true;
      }
      if (matched) tokenMatches++;
    });

    // Semantic coverage ratio
    if (queryTokens.length > 0) {
      const coverage = tokenMatches / queryTokens.length;
      score += Math.round(coverage * 80);
    }

    // Source authority bias
    if (item.badge === 'Official Site' || item.badge === 'Direct URL') score += 500;
    if (item.source === 'StackOverflow' && (query.includes('how') || query.includes('code') || query.includes('error'))) score += 60;
    if (item.source === 'GitHub' && (query.includes('tool') || query.includes('library') || query.includes('framework') || query.includes('repo'))) score += 70;
    if (item.source === 'Reddit' && (query.includes('best') || query.includes('vs') || query.includes('review') || query.includes('recommend'))) score += 50;

    return {
      ...item,
      score,
    };
  });

  // Sort descending by combined hybrid score
  scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  // Assign clean sequential rank
  return scored.slice(0, maxResults).map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));
}

function normalizeUrlKey(urlStr: string): string {
  try {
    const u = new URL(urlStr);
    return (u.hostname.replace(/^www\./, '') + u.pathname).toLowerCase().replace(/\/$/, '');
  } catch {
    return urlStr.toLowerCase();
  }
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\.(com|org|net|io|co|in|edu|gov|dev|ai|app)/gi, ' ')
    .replace(/[^\w\s]/gi, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2);
}
