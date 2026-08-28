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

const gkQueries = [
  { q: "who is known as missile man of india", expected: "Kalam" },
  { q: "iron man of india", expected: "Patel" },
  { q: "father of the green revolution in india", expected: "Swaminathan" },
  { q: "where is jim corbett national park", expected: "Corbett" },
  { q: "kaziranga national park famous for", expected: "Kaziranga" },
  { q: "gir national park asiatic lion", expected: "Gir" },
  { q: "which river is tehri dam built on", expected: "Tehri" },
  { q: "hirakud dam river", expected: "Hirakud" },
  { q: "bhakra nangal dam river", expected: "Bhakra" },
  { q: "headquarters of unesco", expected: "UNESCO" },
  { q: "headquarters of who", expected: "World Health" },
  { q: "headquarters of interpol", expected: "INTERPOL" },
  { q: "when is national science day", expected: "Science Day" },
  { q: "when is international day of yoga", expected: "Yoga" },
  { q: "when is world environment day", expected: "Environment" },
  { q: "battle of hydaspes alexander porus", expected: "Hydaspes" },
  { q: "kalinga war ashoka", expected: "Kalinga" },
  { q: "battle of haldighati maharana pratap", expected: "Haldighati" },
  { q: "bharatanatyam dance state", expected: "Bharatanatyam" },
  { q: "kathakali dance state", expected: "Kathakali" },
  { q: "garba folk dance state", expected: "Garba" },
  { q: "bihu dance state", expected: "Bihu" },
  { q: "femur bone human body", expected: "Femur" },
  { q: "smallest bone in human body stapes", expected: "Stapes" }
];

console.log("==================================================");
console.log(`Testing ${gkQueries.length} General Knowledge (GK) Queries...`);
console.log("==================================================");

let passed = 0;
let failed = 0;

gkQueries.forEach(({ q, expected }) => {
  const start = performance.now();
  const res = searchKnowledgeDB(q);
  const duration = (performance.now() - start).toFixed(3);

  if (res && (res.title.toLowerCase().includes(expected.toLowerCase()) || res.answer.toLowerCase().includes(expected.toLowerCase()) || res.category.toLowerCase().includes(expected.toLowerCase()))) {
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
console.log(`GK AUDIT RESULTS: ${passed}/${gkQueries.length} Passed (${((passed/gkQueries.length)*100).toFixed(1)}% Accuracy)`);
console.log("==================================================");