import biographies from '@/db/biographies.json';
import geography from '@/db/geography.json';
import mathematics from '@/db/mathematics.json';
import science from '@/db/science.json';
import techProgramming from '@/db/tech_programming.json';

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
// Unified High-Density Knowledge Database (/db)
// ─────────────────────────────────────────────────────────────────────────────
const ALL_ENTRIES: KnowledgeDBEntry[] = [
  ...(biographies as unknown as KnowledgeDBEntry[]),
  ...(geography as unknown as KnowledgeDBEntry[]),
  ...(mathematics as unknown as KnowledgeDBEntry[]),
  ...(science as unknown as KnowledgeDBEntry[]),
  ...(techProgramming as unknown as KnowledgeDBEntry[]),
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
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

    // 1. Exact or Substring Keyword Match (+500 points)
    for (const kw of entry.keywords) {
      const kwClean = kw.toLowerCase().trim();
      if (rawClean === kwClean) {
        score += 600;
        break;
      } else if (rawClean.includes(kwClean) || kwClean.includes(rawClean)) {
        score += 350;
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
