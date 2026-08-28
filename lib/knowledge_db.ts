import biographies from '../db/biographies.json';
import geography from '../db/geography.json';
import mathematics from '../db/mathematics.json';
import science from '../db/science.json';
import physics from '../db/physics.json';
import economics from '../db/economics.json';
import ai from '../db/ai.json';
import socialMedia from '../db/social_media.json';
import politics from '../db/politics.json';
import technology from '../db/technology.json';
import techProgramming from '../db/tech_programming.json';
import history from '../db/history.json';
import sports from '../db/sports.json';
import inventions from '../db/inventions.json';
import ncertClass6_10 from '../db/ncert_class6_10.json';
import ncertClass11_12 from '../db/ncert_class11_12.json';
import generalKnowledge from '../db/general_knowledge.json';
import worldGeographyAdv from '../db/world_geography_advanced.json';
import chemistryAdv from '../db/chemistry_advanced.json';
import mathematicsAdv from '../db/mathematics_advanced.json';
import currentAffairsEvergreen from '../db/current_affairs_evergreen.json';
import languagesLiterature from '../db/languages_literature.json';
import computerScienceAdv from '../db/computer_science_advanced.json';
import healthMedicine from '../db/health_medicine.json';
import philosophyEthics from '../db/philosophy_ethics.json';
import artCultureIndia from '../db/art_culture_india.json';

export interface KnowledgeDBEntry {
  id: string;
  keywords: string[];
  title: string;
  category: string;
  answer: string;
  highlights: string[];
  url?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Unified Universal Knowledge Database (/db) - 440+ Verified High-Density Entries
// ─────────────────────────────────────────────────────────────────────────────
export const ALL_ENTRIES: KnowledgeDBEntry[] = [
  ...(biographies as unknown as KnowledgeDBEntry[]),
  ...(geography as unknown as KnowledgeDBEntry[]),
  ...(mathematics as unknown as KnowledgeDBEntry[]),
  ...(science as unknown as KnowledgeDBEntry[]),
  ...(physics as unknown as KnowledgeDBEntry[]),
  ...(economics as unknown as KnowledgeDBEntry[]),
  ...(ai as unknown as KnowledgeDBEntry[]),
  ...(socialMedia as unknown as KnowledgeDBEntry[]),
  ...(politics as unknown as KnowledgeDBEntry[]),
  ...(technology as unknown as KnowledgeDBEntry[]),
  ...(techProgramming as unknown as KnowledgeDBEntry[]),
  ...(history as unknown as KnowledgeDBEntry[]),
  ...(sports as unknown as KnowledgeDBEntry[]),
  ...(inventions as unknown as KnowledgeDBEntry[]),
  ...(ncertClass6_10 as unknown as KnowledgeDBEntry[]),
  ...(ncertClass11_12 as unknown as KnowledgeDBEntry[]),
  ...(generalKnowledge as unknown as KnowledgeDBEntry[]),
  ...(worldGeographyAdv as unknown as KnowledgeDBEntry[]),
  ...(chemistryAdv as unknown as KnowledgeDBEntry[]),
  ...(mathematicsAdv as unknown as KnowledgeDBEntry[]),
  ...(currentAffairsEvergreen as unknown as KnowledgeDBEntry[]),
  ...(languagesLiterature as unknown as KnowledgeDBEntry[]),
  ...(computerScienceAdv as unknown as KnowledgeDBEntry[]),
  ...(healthMedicine as unknown as KnowledgeDBEntry[]),
  ...(philosophyEthics as unknown as KnowledgeDBEntry[]),
  ...(artCultureIndia as unknown as KnowledgeDBEntry[]),
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s\^\+\-\*\/\=]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2);
}

/**
 * Searches the local high-density /db knowledge store in sub-millisecond memory.
 * Returns the exact direct answer and highlights if matched.
 */
export function searchKnowledgeDB(query: string): KnowledgeDBEntry | null {
  if (!query || query.trim().length < 2) return null;

  const rawClean = query.toLowerCase().trim();
  const queryTokens = tokenize(rawClean);

  if (queryTokens.length === 0) return null;

  let bestMatch: KnowledgeDBEntry | null = null;
  let highestScore = 0;

  for (const entry of ALL_ENTRIES) {
    let score = 0;

    // 1. Exact or Phrase Keyword Match
    let hasExactKeyword = false;
    for (const kw of entry.keywords) {
      const kwClean = kw.toLowerCase().trim();
      if (rawClean === kwClean) {
        score += 1000;
        hasExactKeyword = true;
        break;
      } else if (kwClean.length >= 4 && rawClean.includes(kwClean)) {
        // Query fully contains this specific keyword phrase
        score += Math.max(score, 400 + kwClean.length * 15);
      } else if (rawClean.length >= 4 && kwClean.includes(rawClean)) {
        // Keyword fully contains user query
        score += Math.max(score, 300 + rawClean.length * 10);
      }
    }

    // 2. Full Token Overlap Score
    const kwTokens = entry.keywords.flatMap(tokenize);
    const titleTokens = tokenize(entry.title);
    const combinedTokens = new Set([...kwTokens, ...titleTokens]);

    let matchedTokens = 0;
    queryTokens.forEach((t) => {
      if (combinedTokens.has(t)) matchedTokens++;
    });

    const tokenRatio = matchedTokens / queryTokens.length;
    if (tokenRatio === 1.0) {
      score += 450;
    } else if (tokenRatio >= 0.75) {
      score += 250;
    } else if (tokenRatio >= 0.5) {
      score += 120;
    }

    // 3. Title Specific Token Match Bonus
    const titleSet = new Set(titleTokens);
    let titleMatches = 0;
    queryTokens.forEach((t) => {
      if (titleSet.has(t)) titleMatches++;
    });
    if (titleMatches > 0) {
      score += titleMatches * 50;
    }

    if (score > highestScore && score >= 220) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  return bestMatch;
}

export function getAllEntriesCount(): number {
  return ALL_ENTRIES.length;
}

export function getEntriesByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const entry of ALL_ENTRIES) {
    counts[entry.category] = (counts[entry.category] || 0) + 1;
  }
  return counts;
}

