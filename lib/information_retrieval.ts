import type { SearchResult } from '@/types';
import { ALL_ENTRIES, KnowledgeDBEntry } from './knowledge_db';

// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE-STYLE 4-STAGE INFORMATION RETRIEVAL & MULTI-SIGNAL RANKING PIPELINE
// ─────────────────────────────────────────────────────────────────────────────

// ── STOP WORDS (Multilingual English + Hindi + Hinglish) ──────────────────────
const STOP_WORDS = new Set([
  // English
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about', 'against',
  'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am',
  'how', 'why', 'when', 'where', 'tell', 'me', 'please', 'know', 'give',
  // Hindi (Devanagari)
  'है', 'हैं', 'था', 'थी', 'थे', 'का', 'के', 'की', 'को', 'और', 'में', 'से',
  'पर', 'लिए', 'यह', 'वह', 'क्या', 'कौन', 'कहाँ', 'कब', 'कैसे', 'बताओ',
  'दीजिए', 'होता', 'होती', 'होते', 'ने', 'तक', 'भी', 'तो',
  // Hinglish
  'hai', 'hain', 'tha', 'thi', 'the', 'ka', 'ke', 'ki', 'ko', 'aur', 'mein',
  'se', 'par', 'liye', 'yeh', 'woh', 'kya', 'kaun', 'kahan', 'kab', 'kaise',
  'batao', 'bataiye', 'hota', 'hoti', 'hote', 'ne', 'tak', 'bhi', 'to', 'kis',
  'kiske', 'kiski', 'konsa', 'kismein'
]);

// ── SYNONYM & INTENT DICTIONARY ─────────────────────────────────────────────
const SYNONYM_MAP: Record<string, string[]> = {
  // Political & National
  'pradhanmantri': ['prime minister', 'pm', 'pm of india', 'narendra modi'],
  'pradhan mantri': ['prime minister', 'pm', 'pm of india', 'narendra modi'],
  'prime minister': ['pradhanmantri', 'pm', 'narendra modi'],
  'pm': ['prime minister', 'pradhanmantri', 'narendra modi'],
  'rashtrapati': ['president', 'president of india', 'droupadi murmu'],
  'president': ['rashtrapati', 'droupadi murmu'],
  'mukhyamantri': ['chief minister', 'cm'],
  'chief minister': ['mukhyamantri', 'cm'],
  'rajdhani': ['capital', 'capital city'],
  'capital': ['rajdhani'],
  'desh': ['country', 'nation'],
  'country': ['desh', 'nation'],
  'mudra': ['currency', 'money'],
  'currency': ['mudra'],

  // Science & Geography
  'nadi': ['river'],
  'river': ['nadi'],
  'bandh': ['dam', 'reservoir'],
  'dam': ['bandh'],
  'pahar': ['mountain', 'peak'],
  'mountain': ['pahar', 'peak'],
  'vanya jeev': ['wildlife', 'national park', 'sanctuary'],
  'national park': ['rashtriya udyan', 'wildlife sanctuary', 'tiger reserve'],
  'prakash': ['light', 'optics'],
  'light': ['prakash', 'speed of light', 'reflection', 'refraction'],
  'vidyut': ['electricity', 'electric current', 'current'],
  'electricity': ['vidyut', 'current', 'ohm law'],
  'gadi': ['car', 'automobile', 'vehicle'],
  'car': ['gadi', 'automobile', 'vehicle'],
  'khel': ['sports', 'game'],
  'sports': ['khel', 'olympics', 'cricket', 'football'],
  'yudh': ['battle', 'war'],
  'battle': ['yudh', 'war'],
  'khoj': ['invention', 'discovery', 'invented', 'discovered'],
  'invention': ['khoj', 'inventor', 'discovered'],
  'aavishkar': ['invention', 'discovery', 'inventor']
};

export interface QueryAnalysis {
  rawQuery: string;
  cleanedQuery: string;
  coreTokens: string[];
  allTokens: string[];
  expandedSynonyms: string[];
  detectedIntent: 'factual' | 'math' | 'navigation' | 'news' | 'docs' | 'general';
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 1: QUERY UNDERSTANDING (शब्दों का विश्लेषण)
// ─────────────────────────────────────────────────────────────────────────────
export function understandQuery(rawQuery: string): QueryAnalysis {
  if (!rawQuery) {
    return {
      rawQuery: '',
      cleanedQuery: '',
      coreTokens: [],
      allTokens: [],
      expandedSynonyms: [],
      detectedIntent: 'general',
    };
  }

  const normalized = rawQuery.toLowerCase().trim();
  const rawTokens = normalized
    .replace(/[^\w\s\^\+\-\*\/\=]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 1);

  // 1. Stop-words Removal
  const coreTokens = rawTokens.filter((t) => !STOP_WORDS.has(t) && t.length >= 2);

  // 2. Synonym & Multilingual Expansion
  const expandedSynonyms: string[] = [];
  rawTokens.forEach((token) => {
    if (SYNONYM_MAP[token]) {
      expandedSynonyms.push(...SYNONYM_MAP[token]);
    }
  });

  // Check 2-word phrases in synonym map
  for (let i = 0; i < rawTokens.length - 1; i++) {
    const bigram = `${rawTokens[i]} ${rawTokens[i + 1]}`;
    if (SYNONYM_MAP[bigram]) {
      expandedSynonyms.push(...SYNONYM_MAP[bigram]);
    }
  }

  // 3. Intent Detection
  let detectedIntent: QueryAnalysis['detectedIntent'] = 'general';
  if (
    normalized.includes('formula') ||
    normalized.includes('square') ||
    normalized.includes('cube') ||
    normalized.includes('sin') ||
    normalized.includes('cos') ||
    normalized.includes('tan') ||
    normalized.includes('integral') ||
    normalized.includes('derivative') ||
    /\d+[\+\-\*\/]\d+/.test(normalized)
  ) {
    detectedIntent = 'math';
  } else if (
    normalized.includes('who is') ||
    normalized.includes('what is') ||
    normalized.includes('capital of') ||
    normalized.includes('kaun hai') ||
    normalized.includes('kya hai') ||
    normalized.includes('kis nadi') ||
    normalized.includes('where is') ||
    normalized.includes('kahan hai') ||
    normalized.includes('atomic number') ||
    normalized.includes('height of') ||
    normalized.includes('age of')
  ) {
    detectedIntent = 'factual';
  } else if (
    normalized.includes('login') ||
    normalized.includes('portal') ||
    normalized.includes('.com') ||
    normalized.includes('official site')
  ) {
    detectedIntent = 'navigation';
  } else if (
    normalized.includes('news') ||
    normalized.includes('today') ||
    normalized.includes('latest') ||
    normalized.includes('2026') ||
    normalized.includes('live')
  ) {
    detectedIntent = 'news';
  } else if (
    normalized.includes('docs') ||
    normalized.includes('tutorial') ||
    normalized.includes('guide') ||
    normalized.includes('syntax')
  ) {
    detectedIntent = 'docs';
  }

  return {
    rawQuery,
    cleanedQuery: coreTokens.join(' ') || normalized,
    coreTokens,
    allTokens: rawTokens,
    expandedSynonyms: Array.from(new Set(expandedSynonyms)),
    detectedIntent,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 2: FILTERING & RETRIEVAL (रीलेवेंट पेजों को फ़िल्टर करना)
// ─────────────────────────────────────────────────────────────────────────────
export function retrieveKnowledgeCandidates(analysis: QueryAnalysis): KnowledgeDBEntry | null {
  const { rawQuery, cleanedQuery, coreTokens, expandedSynonyms } = analysis;
  if (!rawQuery || rawQuery.trim().length < 2) return null;

  const rawClean = rawQuery.toLowerCase().trim();
  const searchPool = [rawClean, cleanedQuery, ...expandedSynonyms];

  let bestMatch: KnowledgeDBEntry | null = null;
  let highestScore = 0;

  for (const entry of ALL_ENTRIES) {
    let score = 0;

    // 1. Direct Keyword Matching (Exact + Substring)
    let bestKwScore = 0;
    for (const kw of entry.keywords) {
      const kwClean = kw.toLowerCase().trim();
      for (const queryVariant of searchPool) {
        if (!queryVariant) continue;
        if (queryVariant === kwClean) {
          bestKwScore = Math.max(bestKwScore, 1200);
        } else if (kwClean.length >= 4 && queryVariant.includes(kwClean)) {
          bestKwScore = Math.max(bestKwScore, 450 + kwClean.length * 15);
        } else if (queryVariant.length >= 4 && kwClean.includes(queryVariant)) {
          bestKwScore = Math.max(bestKwScore, 350 + queryVariant.length * 10);
        }
      }
    }
    score += bestKwScore;

    // 2. Core Token Overlap (after stop-words removal)
    const kwTokens = entry.keywords.flatMap((k) =>
      k.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter((w) => w.length >= 2)
    );
    const titleTokens = entry.title.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter((w) => w.length >= 2);
    const combinedTokens = new Set([...kwTokens, ...titleTokens]);

    let matchedCore = 0;
    coreTokens.forEach((t) => {
      if (combinedTokens.has(t)) matchedCore++;
    });

    if (coreTokens.length > 0) {
      const coreRatio = matchedCore / coreTokens.length;
      if (coreRatio === 1.0) score += 500;
      else if (coreRatio >= 0.75) score += 300;
      else if (coreRatio >= 0.5) score += 150;
    }

    // 3. Title Matching Bonus
    const titleLower = entry.title.toLowerCase();
    if (coreTokens.length > 0 && coreTokens.every((t) => titleLower.includes(t))) {
      score += 300;
    }

    if (score > highestScore && score >= 220) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  return bestMatch;
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 3: MULTI-SIGNAL RANKING SYSTEM (रैंक तय करना)
// ─────────────────────────────────────────────────────────────────────────────
export function rankSearchResults(
  query: string,
  candidates: SearchResult[],
  maxResults: number = 10
): SearchResult[] {
  if (!candidates.length) return [];

  const analysis = understandQuery(query);
  const { coreTokens, cleanedQuery } = analysis;
  const qLower = query.toLowerCase().trim();

  // E-E-A-T Trusted Domain Weights
  const HIGH_TRUST_TLDS = ['.gov', '.gov.in', '.nic.in', '.edu', '.ac.in', '.org'];
  const HIGH_AUTHORITY_DOMAINS = [
    'wikipedia.org', 'britannica.com', 'isro.gov.in', 'india.gov.in',
    'pib.gov.in', 'nature.com', 'sciencedirect.com', 'ncbi.nlm.nih.gov',
    'who.int', 'un.org', 'unesco.org', 'nasa.gov', 'developer.mozilla.org',
    'github.com', 'stackoverflow.com', 'geeksforgeeks.org', 'w3schools.com'
  ];

  const scored = candidates.map((item, idx) => {
    let score = item.score ?? 50;
    const titleLower = (item.title || '').toLowerCase();
    const descLower = (item.description || '').toLowerCase();
    const domainLower = (item.domain || '').toLowerCase();
    const fullText = `${titleLower} ${descLower} ${domainLower} ${(item.date || '').toLowerCase()}`;

    // Signal 1: Keyword Density & Exact Title/Prefix Placement
    if (cleanedQuery && titleLower.includes(cleanedQuery)) {
      score += 200;
      if (titleLower.startsWith(cleanedQuery)) score += 80;
    }
    if (qLower && titleLower.includes(qLower)) {
      score += 220;
    }

    // Core Token Hits in Title & Snippet
    let coreHitsInTitle = 0;
    let coreHitsInDesc = 0;
    coreTokens.forEach((t) => {
      if (titleLower.includes(t)) coreHitsInTitle++;
      if (descLower.includes(t)) coreHitsInDesc++;
    });

    score += coreHitsInTitle * 60;
    score += coreHitsInDesc * 25;

    // Signal 2: E-E-A-T Authority Scoring (Trust Signal)
    if (HIGH_TRUST_TLDS.some((tld) => domainLower.endsWith(tld))) {
      score += 350; // Major boost for official gov/edu domains
    }
    if (HIGH_AUTHORITY_DOMAINS.some((d) => domainLower.includes(d))) {
      score += 250;
    }
    if (item.badge === 'Official Site' || item.badge === 'Direct URL' || item.badge === 'Google') {
      score += 450;
    }
    if (item.badge === 'Verified Math' || item.badge === 'Biography' || item.badge === 'Science Constant' || item.badge === 'Knowledge') {
      score += 700;
    }

    // Signal 3: Content Freshness / Recency
    const hasCurrentDate = fullText.includes('2026') || fullText.includes('2025');
    const hasLiveIndicator = ['today', 'hours ago', 'mins ago', 'breaking', 'live news'].some((kw) => fullText.includes(kw));

    if (hasCurrentDate || hasLiveIndicator) {
      score += 220;
    }

    // Signal 4: Intent Alignment
    if (analysis.detectedIntent === 'docs' && (domainLower.includes('docs') || domainLower.endsWith('.dev') || domainLower.includes('developer'))) {
      score += 260;
    }
    if (analysis.detectedIntent === 'news' && (item.badge === '🔴 Live News' || domainLower.includes('news'))) {
      score += 300;
    }

    return {
      ...item,
      score,
    };
  });

  // Sort descending by multi-signal score
  scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  // Return top N results with explicit rank
  return scored.slice(0, maxResults).map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));
}