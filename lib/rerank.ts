import type { SearchResult } from '@/types';

export interface RankedSourceItem {
  result: SearchResult;
  sourceName: string;
  sourceRank: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Reciprocal Rank Fusion (RRF)
// Formula: RRF(d) = Sum_{m in M} (1 / (k + r_m(d))) where k ≈ 60
// ─────────────────────────────────────────────────────────────────────────────
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
        if (item.description && item.description.length > (existing.result.description?.length || 0)) {
          existing.result.description = item.description;
        }
        if (item.badge && !existing.result.badge) {
          existing.result.badge = item.badge;
        }
      }
    });
  });

  const fused = Array.from(scoreMap.values())
    .sort((a, b) => b.rrfScore - a.rrfScore)
    .map((entry) => ({
      ...entry.result,
      score: Math.round(entry.rrfScore * 10000),
    }));

  return fused;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. BM25+ (Sparse Lexical Scoring with Field Weights & Delta Boost)
// Field Weights: Title (3.0x), Snippet (1.0x), Domain (2.0x)
// ─────────────────────────────────────────────────────────────────────────────
function computeBM25PlusScore(
  queryTokens: string[],
  docTokens: string[],
  docCount: number,
  docFreqMap: Map<string, number>,
  avgDocLen: number,
  k1: number = 1.2,
  b: number = 0.75,
  delta: number = 0.5
): number {
  if (queryTokens.length === 0 || docTokens.length === 0) return 0;

  const docLen = docTokens.length;
  const lenNorm = 1 - b + b * (docLen / (avgDocLen || 1));

  // Count term frequency in this document
  const tfMap = new Map<string, number>();
  docTokens.forEach((t) => tfMap.set(t, (tfMap.get(t) || 0) + 1));

  let totalBM25 = 0;

  queryTokens.forEach((q) => {
    const tf = tfMap.get(q) || 0;
    if (tf > 0) {
      const nq = docFreqMap.get(q) || 1;
      // Probabilistic Robertson-Spärck Jones IDF with smoothing
      const idf = Math.log(1 + (docCount - nq + 0.5) / (nq + 0.5));
      const termScore = (tf * (k1 + 1)) / (tf + k1 * lenNorm) + delta;
      totalBM25 += idf * termScore;
    }
  });

  return Math.max(0, totalBM25);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Dense Vector Semantic Match (Character 3-Gram & Word Token Cosine Sim)
// Simulates high-precision embedding cosine similarity in [0.0 - 1.0]
// ─────────────────────────────────────────────────────────────────────────────
function computeVectorCosineSimilarity(query: string, text: string): number {
  const qClean = query.toLowerCase().trim();
  const tClean = text.toLowerCase().trim();
  if (!qClean || !tClean) return 0;

  // Extract character 3-grams
  const getGrams = (str: string, n = 3) => {
    const map = new Map<string, number>();
    for (let i = 0; i <= str.length - n; i++) {
      const g = str.slice(i, i + n);
      map.set(g, (map.get(g) || 0) + 1);
    }
    return map;
  };

  const qGrams = getGrams(qClean, 3);
  const tGrams = getGrams(tClean, 3);

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  qGrams.forEach((countA, gram) => {
    normA += countA * countA;
    const countB = tGrams.get(gram) || 0;
    dotProduct += countA * countB;
  });

  tGrams.forEach((countB) => {
    normB += countB * countB;
  });

  if (normA === 0 || normB === 0) return 0;
  const cosine = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return Math.min(1.0, Math.max(0.0, cosine));
}

// Token Overlap Jaccard / Overlap coefficient
function computeTokenOverlap(queryTokens: string[], docTokens: string[]): number {
  if (!queryTokens.length || !docTokens.length) return 0;
  const docSet = new Set(docTokens);
  let matches = 0;
  queryTokens.forEach((t) => {
    if (docSet.has(t)) matches++;
  });
  return matches / queryTokens.length;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Intent Classification Helpers
// ─────────────────────────────────────────────────────────────────────────────
interface QueryIntent {
  isNavigational: boolean;
  isDocs: boolean;
  isErrorOrDebug: boolean;
  isFinancialOrPricing: boolean;
  isProduct: boolean;
  isCommunity: boolean;
}

function detectQueryIntent(query: string, tokens: string[]): QueryIntent {
  const q = query.toLowerCase();

  const isNavigational = tokens.length <= 2 && (
    q.includes('.com') || q.includes('.org') || q.includes('.net') ||
    ['youtube', 'github', 'netflix', 'google', 'chatgpt', 'openai', 'amazon', 'quora', 'wikipedia', 'twitter', 'facebook', 'instagram'].some((brand) => q.includes(brand))
  );

  const isDocs = [
    'doc', 'docs', 'documentation', 'guide', 'tutorial', 'reference',
    'api', 'manual', 'cheatsheet', 'cheat sheet', 'handbook', 'learn', 'syntax'
  ].some((kw) => q.includes(kw));

  const isErrorOrDebug = [
    'error', 'exception', 'failed', 'crash', 'undefined', 'nullpointer',
    'bug', 'issue', 'cannot', 'fix', 'solved', 'traceback', 'why does', 'how to fix'
  ].some((kw) => q.includes(kw));

  const isFinancialOrPricing = [
    'stock', 'price', 'rates', 'quote', 'usd', 'market cap', 'crypto',
    'btc', 'gold', 'silver', '24k', 'live', 'ticker', 'share price'
  ].some((kw) => q.includes(kw));

  const isProduct = [
    'specs', 'review', 'vs', 'camera', 'battery', 'm4', 'rtx', 'iphone',
    'macbook', 'phone', 'laptop', 'headphones', 'buy', 'deals'
  ].some((kw) => q.includes(kw));

  const isCommunity = [
    'reddit', 'forum', 'community', 'opinions', 'recommendations',
    'experience', 'discussion', 'thoughts', 'best'
  ].some((kw) => q.includes(kw));

  return { isNavigational, isDocs, isErrorOrDebug, isFinancialOrPricing, isProduct, isCommunity };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Hybrid Cross-Encoder Re-Ranker
// Merges: BM25F + Vector Cosine + Query Coverage + Exact Phrase + Authority Priors
// ─────────────────────────────────────────────────────────────────────────────
export function hybridReRank(
  query: string,
  candidates: SearchResult[],
  maxResults: number = 20
): SearchResult[] {
  if (!candidates.length) return [];

  const queryTokens = tokenize(query);
  const cleanQ = queryTokens.join(' ');
  const qLower = query.toLowerCase().trim();
  const N = candidates.length;
  const intent = detectQueryIntent(query, queryTokens);

  // Field-weighted document tokens: Title (3x weight), Snippet (1x), Domain (2x)
  const docTokensList = candidates.map((item) => {
    const titleTokens = tokenize(item.title);
    const domainTokens = tokenize(item.domain || '');
    const descTokens = tokenize(item.description || '');
    
    // Field weighted token stream
    return [
      ...titleTokens, ...titleTokens, ...titleTokens,
      ...domainTokens, ...domainTokens,
      ...descTokens,
    ];
  });

  // Calculate average doc length for BM25 normalization
  const totalLen = docTokensList.reduce((acc, tokens) => acc + tokens.length, 0);
  const avgDocLen = totalLen / N || 1;

  // Build document frequency map for query tokens
  const docFreqMap = new Map<string, number>();
  queryTokens.forEach((q) => {
    let count = 0;
    docTokensList.forEach((tokens) => {
      if (tokens.includes(q)) count++;
    });
    docFreqMap.set(q, count);
  });

  const scored = candidates.map((item, idx) => {
    const docTokens = docTokensList[idx];
    const titleLower = (item.title || '').toLowerCase();
    const descLower = (item.description || '').toLowerCase();
    const domainLower = (item.domain || '').toLowerCase();
    const urlLower = (item.url || '').toLowerCase();

    // 1. Multi-Field BM25+ Score
    const bm25Score = computeBM25PlusScore(queryTokens, docTokens, N, docFreqMap, avgDocLen, 1.2, 0.75, 0.5);

    // 2. Dense Semantic Cosine Similarity [0.0 - 1.0]
    const titleCosine = computeVectorCosineSimilarity(query, item.title || '');
    const descCosine  = computeVectorCosineSimilarity(query, item.description || '');
    const semanticSim = titleCosine * 0.75 + descCosine * 0.25;

    // 3. Query Term Coverage Bonus / Penalty
    const coverage = computeTokenOverlap(queryTokens, docTokens);
    const coverageMultiplier = coverage >= 0.9 ? 1.4 : coverage >= 0.6 ? 1.0 : 0.65;

    // 4. Base RRF Prior Score
    let score = (item.score ?? 50);

    // Combine Sparse BM25 + Dense Semantic
    const coreLexicalDense = Math.round(bm25Score * 45) + Math.round(semanticSim * 160);
    score += Math.round(coreLexicalDense * coverageMultiplier);

    // 5. Exact Phrase Matching in Title & Snippet
    if (cleanQ.length > 2) {
      if (titleLower.includes(cleanQ) || (qLower && titleLower.includes(qLower))) {
        score += 160;
        // Bonus if title begins with exact match
        if (titleLower.startsWith(cleanQ) || titleLower.startsWith(qLower)) {
          score += 60;
        }
      } else if (descLower.includes(cleanQ) || (qLower && descLower.includes(qLower))) {
        score += 70;
      }
    }

    // Exact Domain Token Match
    if (queryTokens.some((t) => domainLower.includes(t) || urlLower.includes(t))) {
      score += 140;
    }

    // 6. Authority Priors & Intent-Aware Boosts
    if (item.badge === 'Official Site' || item.badge === 'Direct URL') {
      score += 550;
    }

    // Tech Docs Intent & First-Party Technology Authority
    const isFirstPartyDomain = queryTokens.some((t) => (
      t.length >= 3 && (
        domainLower.startsWith(t + '.') ||
        domainLower.includes('.' + t + '.') ||
        domainLower.startsWith('docs.' + t) ||
        domainLower === `${t}.dev` ||
        domainLower === `${t}.org` ||
        domainLower === `${t}.io` ||
        domainLower === `${t}.com`
      )
    ));

    const isDocDomain = (
      domainLower.includes('docs.') ||
      domainLower.endsWith('.dev') ||
      domainLower.endsWith('.io') ||
      domainLower.includes('developer.mozilla.org') ||
      item.badge === 'Docs'
    );

    if (intent.isDocs) {
      if (isFirstPartyDomain && (isDocDomain || item.badge === 'Docs')) {
        score += 350; // First-party official documentation
      } else if (isDocDomain || item.badge === 'Docs') {
        score += 180;
      }
      if (titleLower.includes('documentation') || titleLower.includes('tutorial') || titleLower.includes('guide')) {
        score += 80;
      }
    } else if (isFirstPartyDomain) {
      score += 150;
    }

    // Error / Debugging Intent
    if (intent.isErrorOrDebug) {
      if (item.source === 'StackOverflow' || domainLower.includes('stackoverflow.com')) score += 220;
      if (item.source === 'GitHub' || domainLower.includes('github.com')) score += 140;
      if (isDocDomain) score += 100;
    }

    // Financial / Real-Time Pricing Intent
    if (intent.isFinancialOrPricing) {
      if (
        domainLower.includes('finance.yahoo.com') ||
        domainLower.includes('coingecko.com') ||
        domainLower.includes('coinmarketcap.com') ||
        domainLower.includes('mcxindia.com') ||
        domainLower.includes('bloomberg.com') ||
        domainLower.includes('nasdaq.com') ||
        domainLower.includes('tradingview.com') ||
        domainLower.includes('economictimes.')
      ) {
        score += 240;
      }
    }

    // Product & Gadget Intent
    if (intent.isProduct) {
      if (item.badge === 'Official Site' || domainLower.includes('apple.com') || domainLower.includes('sony.com') || domainLower.includes('nvidia.com')) score += 200;
      if (domainLower.includes('gsmarena.com') || domainLower.includes('rtings.com') || domainLower.includes('theverge.com')) score += 120;
    }

    // Community / Forum Intent (Reddit, Quora)
    if (intent.isCommunity || query.toLowerCase().includes('reddit')) {
      if (item.source === 'Reddit' || domainLower.includes('reddit.com')) {
        score += 260;
      }
    } else {
      // If NOT explicitly looking for community forum opinions, slightly temper forum threads when official docs/answers exist
      if (item.source === 'Reddit' && !intent.isCommunity) {
        score -= 40;
      }
    }

    // General Source Priors
    if (item.source === 'Wikipedia' && (queryTokens.length <= 2 || query.toLowerCase().includes('what is') || query.toLowerCase().includes('history'))) {
      score += 80;
    }

    return {
      ...item,
      score,
    };
  });

  scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

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

