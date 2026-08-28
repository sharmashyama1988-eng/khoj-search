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
// Unified High-Density Knowledge Database (/db) - 250+ Verified Entries
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

    // 1. Exact or Substring Keyword Match (+700 / +450 / +350 points)
    for (const kw of entry.keywords) {
      const kwClean = kw.toLowerCase().trim();
      if (rawClean === kwClean) {
        score += 700;
        break;
      } else if (rawClean.includes(kwClean) || kwClean.includes(rawClean)) {
        score += 450;
      }
    }

    // 2. Token Overlap Score
    const kwTokens = entry.keywords.flatMap(tokenize);
    const kwSet = new Set(kwTokens);
    let matchedTokens = 0;

    queryTokens.forEach((t) => {
      if (kwSet.has(t)) matchedTokens++;
    });

    const tokenRatio = matchedTokens / queryTokens.length;
    if (tokenRatio >= 0.75) {
      score += Math.round(tokenRatio * 250);
    } else if (tokenRatio >= 0.5) {
      score += Math.round(tokenRatio * 150);
    }

    // 3. Title Token Match
    const titleTokens = tokenize(entry.title);
    const titleSet = new Set(titleTokens);
    let titleMatches = 0;
    queryTokens.forEach((t) => {
      if (titleSet.has(t)) titleMatches++;
    });
    if (titleMatches > 0) {
      score += titleMatches * 40;
    }

    if (score > highestScore && score >= 200) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  return bestMatch;
}
