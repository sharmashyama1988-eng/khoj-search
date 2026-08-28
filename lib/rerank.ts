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
        if (item.date && !existing.result.date) {
          existing.result.date = item.date;
        }
        if (item.badge && (item.badge === '🔴 Live News' || item.badge === 'Google' || item.badge === 'Verified Math')) {
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
// 2. BM25+ (Multi-Field BM25F with Lower-Bound Delta Boost)
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

  const tfMap = new Map<string, number>();
  docTokens.forEach((t) => tfMap.set(t, (tfMap.get(t) || 0) + 1));

  let totalBM25 = 0;

  queryTokens.forEach((q) => {
    const tf = tfMap.get(q) || 0;
    if (tf > 0) {
      const nq = docFreqMap.get(q) || 1;
      const idf = Math.log(1 + (docCount - nq + 0.5) / (nq + 0.5));
      const termScore = (tf * (k1 + 1)) / (tf + k1 * lenNorm) + delta;
      totalBM25 += idf * termScore;
    }
  });

  return Math.max(0, totalBM25);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Dense Vector Semantic Match (Character & Token N-gram Cosine Distance)
// ─────────────────────────────────────────────────────────────────────────────
function computeVectorCosineSimilarity(query: string, text: string): number {
  const qClean = query.toLowerCase().trim();
  const tClean = text.toLowerCase().trim();
  if (!qClean || !tClean) return 0;

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

function computeTokenOverlap(queryTokens: string[], docTokens: string[]): number {
  if (queryTokens.length === 0) return 0;
  const docSet = new Set(docTokens);
  let matched = 0;
  queryTokens.forEach((t) => {
    if (docSet.has(t)) matched++;
  });
  return matched / queryTokens.length;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Intent Classification Helper
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// 4. Multi-Domain Intent Classification Engine (Topic & Need Understanding)
// ─────────────────────────────────────────────────────────────────────────────
function detectQueryIntent(query: string, tokens: string[]) {
  const q = query.toLowerCase();

  const isHealthMedical = [
    'surgery', 'aiims', 'hospital', 'doctor', 'treatment', 'medicine', 'disease',
    'symptoms', 'causes', 'cure', 'cancer', 'diabetes', 'fever', 'cardiac', 'heart',
    'liver', 'kidney', 'bone', 'breast', 'implant', 'body', 'pain', 'vaccine',
    'ilaj', 'dawa', 'rog', 'bimar', 'upchar', 'health', 'clinic', 'anatomy'
  ].some((kw) => q.includes(kw));

  const isAcademicEdu = [
    'ncert', 'cbse', 'class 6', 'class 7', 'class 8', 'class 9', 'class 10', 'class 11', 'class 12',
    'chapter', 'notes', 'syllabus', 'physics', 'chemistry', 'biology', 'math',
    'formula', 'derivation', 'theorem', 'algebra', 'calculus', 'history', 'geography',
    'economics', 'civics', 'exam', 'question paper', 'solution', 'pyq'
  ].some((kw) => q.includes(kw));

  const isGovNavigational = [
    'portal', 'login', 'sign in', 'official site', 'admit card', 'result',
    'sbi online', 'irctc', 'uidai', 'aadhar', 'pan card', 'passport',
    'epfo', 'upsc', 'ssc', 'yojana', 'form apply', 'registration', 'recruitment'
  ].some((kw) => q.includes(kw));

  const isNewsOrFresh = [
    'news', 'latest', 'today', 'update', 'current', '2026', '2025', 'breaking',
    'live', 'khabar', 'samachar', 'halchal', 'headlines', 'election', 'budget', 'match'
  ].some((kw) => q.includes(kw));

  const isDocs = [
    'doc', 'docs', 'documentation', 'api', 'reference', 'guide', 'tutorial',
    'example', 'syntax', 'hook', 'class', 'function', 'how to use', 'cheatsheet',
    'react', 'nextjs', 'typescript', 'python', 'javascript', 'tailwindcss'
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
    'macbook', 'phone', 'laptop', 'headphones', 'buy', 'deals', 'under 50000', 'under 20000'
  ].some((kw) => q.includes(kw));

  const isCommunity = [
    'reddit', 'forum', 'community', 'opinions', 'recommendations',
    'experience', 'discussion', 'thoughts', 'best'
  ].some((kw) => q.includes(kw));

  const isMathQuery = [
    'square', 'cube', 'formula', 'identity', 'theorem', 'algebra', 'pythagoras',
    'quadratic', 'equation', 'expansion', 'factorization', 'calculus', 'matrix', 'sin', 'cos', 'tan'
  ].some((kw) => q.includes(kw));

  const isNavigational = isGovNavigational || [
    'website', 'homepage', 'app'
  ].some((kw) => q.includes(kw)) || tokens.length <= 2;

  return {
    isHealthMedical,
    isAcademicEdu,
    isGovNavigational,
    isNewsOrFresh,
    isDocs,
    isErrorOrDebug,
    isFinancialOrPricing,
    isProduct,
    isCommunity,
    isMathQuery,
    isNavigational,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Hybrid Cross-Encoder Re-Ranker (Contextual Intent-Driven)
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

  const docTokensList = candidates.map((item) => {
    const titleTokens = tokenize(item.title);
    const domainTokens = tokenize(item.domain || '');
    const descTokens = tokenize(item.description || '');

    return [
      ...titleTokens, ...titleTokens, ...titleTokens,
      ...domainTokens, ...domainTokens,
      ...descTokens,
    ];
  });

  const totalLen = docTokensList.reduce((acc, tokens) => acc + tokens.length, 0);
  const avgDocLen = totalLen / N || 1;

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
    const fullItemText = `${titleLower} ${descLower} ${urlLower} ${(item.date || '').toLowerCase()}`;

    // 1. Multi-Field BM25+ Score
    const bm25Score = computeBM25PlusScore(queryTokens, docTokens, N, docFreqMap, avgDocLen, 1.2, 0.75, 0.5);

    // 2. Dense Semantic Cosine Similarity [0.0 - 1.0]
    const titleCosine = computeVectorCosineSimilarity(query, item.title || '');
    const descCosine  = computeVectorCosineSimilarity(query, item.description || '');
    const semanticSim = titleCosine * 0.75 + descCosine * 0.25;

    // 3. Query Term Coverage Bonus
    const coverage = computeTokenOverlap(queryTokens, docTokens);
    const coverageMultiplier = coverage >= 0.9 ? 1.4 : coverage >= 0.6 ? 1.0 : 0.65;

    // 4. Base RRF Prior Score
    let score = (item.score ?? 50);

    const coreLexicalDense = Math.round(bm25Score * 45) + Math.round(semanticSim * 160);
    score += Math.round(coreLexicalDense * coverageMultiplier);

    // 5. Exact Phrase Matching
    if (cleanQ.length > 2) {
      if (titleLower.includes(cleanQ) || (qLower && titleLower.includes(qLower))) {
        score += 160;
        if (titleLower.startsWith(cleanQ) || titleLower.startsWith(qLower)) {
          score += 60;
        }
      } else if (descLower.includes(cleanQ) || (qLower && descLower.includes(qLower))) {
        score += 70;
      }
    }

    if (queryTokens.some((t) => domainLower.includes(t) || urlLower.includes(t))) {
      score += 140;
    }

    // 6. Authority Priors & Verified Badges
    if (item.badge === 'Official Site' || item.badge === 'Direct URL') {
      score += 550;
    }

    if (item.badge === 'Verified Math' || item.badge === 'Math Identity' || item.badge === 'Biography' || item.badge === 'Science Constant' || item.badge === 'Knowledge') {
      score += 700;
    }

    // Google Web & Direct Matches
    if (item.source === 'Google Web' || item.badge === 'Google') {
      score += 300;
    }

    // ── TOPIC-MATCHED ADAPTIVE ROUTING (JARURAT KE HISAAB SE RANKING) ─────────

    // A. HEALTH & MEDICAL INTENT
    if (intent.isHealthMedical) {
      const isMedicalAuthority = [
        'nih.gov', 'who.int', 'aiims.edu', 'webmd.com', 'mayoclinic.org',
        'healthline.com', 'ncbi.nlm.nih.gov', 'pubmed', 'nhs.uk', 'icmr.gov.in',
        'medlineplus.gov', 'hopkinsmedicine.org', 'clevelandclinic.org', '1mg.com',
        'practo.com', 'netmeds.com', 'apollohospitals.com', 'fortishealthcare.com'
      ].some((d) => domainLower.includes(d));

      if (isMedicalAuthority) {
        score += 500; // Strong authority boost for medical portals
      }
      if (item.badge === 'Health & Medicine' || item.source?.includes('Health')) {
        score += 600;
      }
      // If user is searching health, suppress generic news clickbaits
      if (item.badge === '🔴 Live News' && !intent.isNewsOrFresh) {
        score -= 400;
      }
    }

    // B. ACADEMIC & NCERT INTENT
    if (intent.isAcademicEdu) {
      const isEduAuthority = [
        'ncert.nic.in', 'cbse.gov.in', 'byjus.com', 'topperlearning.com',
        'vedantu.com', 'geeksforgeeks.org', 'khanacademy.org', 'wikipedia.org',
        'learncbse.in', 'physicswallah.live', 'unacademy.com'
      ].some((d) => domainLower.includes(d));

      if (isEduAuthority) {
        score += 480;
      }
      if (item.badge?.includes('NCERT') || item.source?.includes('NCERT')) {
        score += 650;
      }
    }

    // C. GOVERNMENT & OFFICIAL SCHEMES / PORTALS
    if (intent.isGovNavigational) {
      if (domainLower.endsWith('.gov.in') || domainLower.endsWith('.nic.in') || domainLower.endsWith('.gov') || domainLower.endsWith('.ac.in')) {
        score += 650; // Guaranteed #1 on official government searches
      }
    }

    // D. NEWS & CURRENT AFFAIRS INTENT
    if (intent.isNewsOrFresh) {
      if (item.badge === '🔴 Live News' || item.domain === 'news.google.com' || (item.source && item.source.toLowerCase().includes('news'))) {
        score += 450; // Promote live news only when user wants news!
      }
      const isCurrentYear = fullItemText.includes('2026') || fullItemText.includes('2025');
      const isLiveTimeIndicator = ['today', 'hours ago', 'mins ago', 'just now', 'breaking', 'live news'].some((kw) => fullItemText.includes(kw));

      if (isCurrentYear || isLiveTimeIndicator) {
        score += 200;
      }
    } else {
      // Non-news query: reduce news ranking
      if (item.badge === '🔴 Live News' || item.domain === 'news.google.com') {
        score -= 300;
      }
    }

    // E. TECH, CODING & DEVELOPER DOCS INTENT
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
        score += 400;
      } else if (isDocDomain || item.badge === 'Docs') {
        score += 220;
      }
      if (titleLower.includes('documentation') || titleLower.includes('tutorial') || titleLower.includes('guide')) {
        score += 90;
      }
    }

    // Error / Debugging Intent
    if (intent.isErrorOrDebug) {
      if (item.source === 'StackOverflow' || domainLower.includes('stackoverflow.com')) score += 300;
      if (item.source === 'GitHub' || domainLower.includes('github.com')) score += 180;
      if (isDocDomain) score += 120;
    }

    // F. FINANCIAL & PRICING INTENT
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
        score += 280;
      }
    }

    // G. PRODUCT & GADGET INTENT
    if (intent.isProduct) {
      if (item.badge === 'Official Site' || domainLower.includes('apple.com') || domainLower.includes('sony.com') || domainLower.includes('nvidia.com')) score += 250;
      if (domainLower.includes('gsmarena.com') || domainLower.includes('rtings.com') || domainLower.includes('theverge.com') || domainLower.includes('91mobiles.com')) score += 180;
    }

    // H. COMMUNITY & REDDIT INTENT
    if (intent.isCommunity || query.toLowerCase().includes('reddit')) {
      if (item.source === 'Reddit' || domainLower.includes('reddit.com')) {
        score += 280;
      }
    } else {
      if (item.source === 'Reddit' && !intent.isCommunity) {
        score -= 40;
      }
    }

    // I. GENERAL FACTUAL & ENCYCLOPEDIC INTENT
    if (item.source === 'Wikipedia' && (queryTokens.length <= 2 || query.toLowerCase().includes('what is') || query.toLowerCase().includes('history') || query.toLowerCase().includes('kaun') || query.toLowerCase().includes('kya'))) {
      score += 180;
    }

    return {
      ...item,
      score,
    };
  });

  scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  // 8. Domain Diversity Filter (Max 2 results per domain to ensure wide web variety)
  const domainCounts = new Map<string, number>();
  const diversified: SearchResult[] = [];

  for (const item of scored) {
    const d = item.domain || 'web';
    const count = domainCounts.get(d) || 0;
    if (count < 2) {
      domainCounts.set(d, count + 1);
      diversified.push(item);
    }
    if (diversified.length >= maxResults) break;
  }

  // If diversity filter left fewer than maxResults, fill up with remaining items
  if (diversified.length < maxResults) {
    for (const item of scored) {
      if (!diversified.some((existing) => existing.url === item.url)) {
        diversified.push(item);
      }
      if (diversified.length >= maxResults) break;
    }
  }

  return diversified.map((item, idx) => ({
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
