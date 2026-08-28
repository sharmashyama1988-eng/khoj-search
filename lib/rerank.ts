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
        if (item.description && item.description.length > existing.result.description.length) {
          existing.result.description = item.description;
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
// 2. BM25+ (Sparse Lexical Scoring with Lower-Bound Delta Boost)
// Formula: Score(D, Q) = Sum_i [ IDF(q_i) * ( (k1 + 1) * TF / (TF + k1*(1 - b + b*(|D|/avgDL))) + δ ) ]
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
      // Probabilistic IDF with smoothing
      const idf = Math.log(1 + (docCount - nq + 0.5) / (nq + 0.5));
      const termScore = (tf * (k1 + 1)) / (tf + k1 * lenNorm) + delta;
      totalBM25 += idf * termScore;
    }
  });

  return Math.max(0, totalBM25);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Dense Vector Semantic Match (Character & Token N-gram Cosine Distance)
// Simulates embedding cosine similarity (A · B) / (||A|| * ||B||) in [0.0 - 1.0]
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

  const qGrams = getGrams(qClean);
  const tGrams = getGrams(tClean);

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

// ─────────────────────────────────────────────────────────────────────────────
// 4. Hybrid Cross-Encoder Re-Ranker
// Merges: BM25+ (Sparse) + Cosine Vector Sim (Dense) + RRF Rank + Authority Prior
// ─────────────────────────────────────────────────────────────────────────────
export function hybridReRank(
  query: string,
  candidates: SearchResult[],
  maxResults: number = 20
): SearchResult[] {
  if (!candidates.length) return [];

  const queryTokens = tokenize(query);
  const N = candidates.length;

  // Pre-tokenize all candidate documents (Title + Snippet + Domain)
  const docTokensList = candidates.map((item) => {
    const fullText = `${item.title} ${item.title} ${item.description} ${item.domain || ''}`;
    return tokenize(fullText);
  });

  // Calculate average document length
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
    const fullDocText = `${item.title} ${item.description}`;

    // 1. BM25+ Score
    const bm25Score = computeBM25PlusScore(queryTokens, docTokens, N, docFreqMap, avgDocLen);

    // 2. Dense Semantic Cosine Similarity [0.0 - 1.0]
    const titleCosine = computeVectorCosineSimilarity(query, item.title);
    const descCosine  = computeVectorCosineSimilarity(query, item.description);
    const semanticSim = titleCosine * 0.7 + descCosine * 0.3;

    // 3. Base RRF Prior Score
    let score = (item.score ?? 50);

    // Combine Sparse + Dense
    score += Math.round(bm25Score * 40);
    score += Math.round(semanticSim * 150);

    // Exact Title / Domain Matching
    const cleanQ = queryTokens.join(' ');
    const titleLower = item.title.toLowerCase();
    const domainLower = (item.domain || '').toLowerCase();

    if (cleanQ && titleLower.includes(cleanQ)) score += 100;
    if (queryTokens.some((t) => domainLower.includes(t))) score += 120;

    // Authority Priors
    if (item.badge === 'Official Site' || item.badge === 'Direct URL') score += 500;
    if (item.source === 'StackOverflow' && (query.includes('how') || query.includes('error') || query.includes('code'))) score += 75;
    if (item.source === 'GitHub' && (query.includes('repo') || query.includes('tool') || query.includes('framework'))) score += 80;
    if (item.source === 'Reddit' && (query.includes('best') || query.includes('vs') || query.includes('review'))) score += 60;

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
