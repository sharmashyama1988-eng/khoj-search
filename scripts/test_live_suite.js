const fs = require('fs');
const path = require('path');
const dbDir = path.join(process.cwd(), 'db');

const files = fs.readdirSync(dbDir).filter(f => f.endsWith('.json'));

let allEntries = [];
files.forEach(f => {
  const filePath = path.join(dbDir, f);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  allEntries = allEntries.concat(data);
});

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s\^\+\-\*\/\=]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2);
}

function searchKnowledgeDB(query) {
  if (!query || query.trim().length < 2) return null;

  const rawClean = query.toLowerCase().trim();
  const queryTokens = tokenize(rawClean);

  if (queryTokens.length === 0) return null;

  let bestMatch = null;
  let highestScore = 0;

  for (const entry of allEntries) {
    let score = 0;

    // 1. Exact or Phrase Keyword Match
    for (const kw of entry.keywords) {
      const kwClean = kw.toLowerCase().trim();
      if (rawClean === kwClean) {
        score += 1000;
        break;
      } else if (kwClean.length >= 4 && rawClean.includes(kwClean)) {
        score += Math.max(score, 400 + kwClean.length * 15);
      } else if (rawClean.length >= 4 && kwClean.includes(rawClean)) {
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

const testQueries = [
  { q: "speed of light in vacuum", expectedSub: "Speed of Light" },
  { q: "value of planck constant", expectedSub: "Planck" },
  { q: "avogadro constant value", expectedSub: "Avogadro" },
  { q: "gold atomic number", expectedSub: "Gold" },
  { q: "silver element", expectedSub: "Silver" },
  { q: "titanium element", expectedSub: "Titanium" },
  { q: "capital of afghanistan", expectedSub: "Afghanistan" },
  { q: "capital of australia", expectedSub: "Australia" },
  { q: "capital of brazil", expectedSub: "Brazil" },
  { q: "capital of canada", expectedSub: "Canada" },
  { q: "capital of egypt", expectedSub: "Egypt" },
  { q: "capital of france", expectedSub: "France" },
  { q: "capital of japan", expectedSub: "Japan" },
  { q: "sin 45 cos 45 tan 45", expectedSub: "45°" },
  { q: "sin 90 cos 90 tan 90", expectedSub: "90°" },
  { q: "five writs in indian constitution", expectedSub: "Writs" },
  { q: "difference between gdp and gnp", expectedSub: "GDP" },
  { q: "trie data structure prefix tree", expectedSub: "Trie" },
  { q: "segment tree vs fenwick tree", expectedSub: "Segment Tree" },
  { q: "disjoint set union dsu", expectedSub: "Disjoint Set Union" },
  { q: "battles of panipat dates winners", expectedSub: "Panipat" },
  { q: "chhatrapati shivaji maharaj", expectedSub: "Shivaji" },
  { q: "shaheed bhagat singh biography", expectedSub: "Bhagat Singh" },
  { q: "netaji subhas chandra bose biography", expectedSub: "Subhas Chandra Bose" },
  { q: "who invented transistor", expectedSub: "Transistor" },
  { q: "father of fiber optics", expectedSub: "Fiber Optics" },
  { q: "fifa world cup all winners list", expectedSub: "FIFA" },
  { q: "olympic games modern vs ancient", expectedSub: "Olympic" }
];

console.log("==================================================");
console.log(`Running ${testQueries.length} Real-World Knowledge Verification Queries...`);
console.log("==================================================");

let passed = 0;
let failed = 0;

testQueries.forEach(({ q, expectedSub }) => {
  const start = performance.now();
  const res = searchKnowledgeDB(q);
  const duration = (performance.now() - start).toFixed(3);

  if (res && (res.title.toLowerCase().includes(expectedSub.toLowerCase()) || res.answer.toLowerCase().includes(expectedSub.toLowerCase()) || res.category.toLowerCase().includes(expectedSub.toLowerCase()))) {
    passed++;
    console.log(`  ✔ PASS [${duration}ms]: "${q}" -> [${res.category}] ${res.title}`);
  } else if (res) {
    failed++;
    console.log(`  ❌ MISMATCH [${duration}ms]: "${q}" -> Title: ${res.title}`);
  } else {
    failed++;
    console.log(`  ❌ NO MATCH [${duration}ms]: "${q}"`);
  }
});

console.log("\n==================================================");
console.log(`RESULTS: ${passed}/${testQueries.length} Passed (${((passed/testQueries.length)*100).toFixed(1)}% Accuracy)`);
console.log("==================================================");