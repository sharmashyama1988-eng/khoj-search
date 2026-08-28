const fs = require('fs');
const path = require('path');
const dbDir = path.join(process.cwd(), 'db');

const files = fs.readdirSync(dbDir).filter(f => f.endsWith('.json'));

let allEntries = [];
const categoryCounts = {};

files.forEach(f => {
  const filePath = path.join(dbDir, f);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  allEntries = allEntries.concat(data);
});

allEntries.forEach(entry => {
  categoryCounts[entry.category] = (categoryCounts[entry.category] || 0) + 1;
});

console.log("==================================================");
console.log("         KHOJ UNIVERSAL KNOWLEDGE DB AUDIT        ");
console.log("==================================================");
console.log(`\n✔ Total Indexed Knowledge Entries: ${allEntries.length}`);

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

const testQueries = [
  // 1. NCERT Science 6-10
  { q: "powerhouse of the cell", expectedSub: "Mitochondria" },
  { q: "photosynthesis equation class 7", expectedSub: "Photosynthesis" },
  { q: "suicide bags of the cell", expectedSub: "Lysosomes" },
  { q: "father of genetics", expectedSub: "Mendel" },
  { q: "snells law class 10", expectedSub: "Light" },
  { q: "ohms law class 10", expectedSub: "Electricity" },
  { q: "types of chemical reactions", expectedSub: "Chemical" },
  { q: "indus valley civilization", expectedSub: "Indus" },
  { q: "revolt of 1857", expectedSub: "1857" },
  { q: "french revolution 1789", expectedSub: "French" },
  { q: "fundamental rights india", expectedSub: "Fundamental" },

  // 2. NCERT 11-12
  { q: "coulombs law formula", expectedSub: "Coulomb" },
  { q: "gauss law electrostatics", expectedSub: "Gauss" },
  { q: "faradays laws of electromagnetic induction", expectedSub: "Faraday" },
  { q: "einsteins photoelectric equation", expectedSub: "Photoelectric" },
  { q: "bohr model of hydrogen atom", expectedSub: "Bohr" },
  { q: "le chateliers principle", expectedSub: "Le Chatelier" },
  { q: "nernst equation formula", expectedSub: "Nernst" },
  { q: "watson and crick dna double helix", expectedSub: "DNA" },
  { q: "pcr polymerase chain reaction steps", expectedSub: "Biotechnology" },

  // 3. Computer Science
  { q: "b tree vs b+ tree", expectedSub: "B-Tree" },
  { q: "cap theorem explained", expectedSub: "CAP" },
  { q: "tcp vs udp differences", expectedSub: "TCP" },
  { q: "http 1.1 vs http 2 vs http 3", expectedSub: "HTTP" },
  { q: "mutex vs semaphore difference", expectedSub: "Concurrency" },
  { q: "virtual memory paging", expectedSub: "Virtual Memory" },

  // 4. General Knowledge & History
  { q: "new seven wonders of the world", expectedSub: "Wonders" },
  { q: "unesco world heritage sites in india", expectedSub: "UNESCO" },
  { q: "nobel peace prize oslo", expectedSub: "Nobel" },
  { q: "solar system planets order facts", expectedSub: "Solar" },
  { q: "mariana trench challenger deep", expectedSub: "Mariana" },
  { q: "blood pressure normal range", expectedSub: "Blood Pressure" },
  { q: "six schools of indian philosophy", expectedSub: "Philosophy" },

  // 5. Inventions & Personalities
  { q: "who invented telephone", expectedSub: "Telephone" },
  { q: "who invented airplane", expectedSub: "Airplane" },
  { q: "who invented computer", expectedSub: "Computer" },
  { q: "who invented world wide web", expectedSub: "World Wide Web" },
  { q: "who discovered penicillin", expectedSub: "Penicillin" },
  { q: "modi age", expectedSub: "Modi" },
  { q: "elon musk", expectedSub: "Musk" },
  { q: "sachin tendulkar", expectedSub: "Tendulkar" },
  { q: "albert einstein", expectedSub: "Einstein" },
  { q: "apj abdul kalam", expectedSub: "Kalam" }
];

console.log(`\nRunning ${testQueries.length} Cross-Domain Accuracy Tests...\n`);

let passed = 0;
let failed = 0;

testQueries.forEach(({ q, expectedSub }) => {
  const start = performance.now();
  const res = searchKnowledgeDB(q);
  const duration = (performance.now() - start).toFixed(3);

  if (res && (res.title.includes(expectedSub) || res.answer.includes(expectedSub) || res.category.includes(expectedSub))) {
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
console.log(`RESULTS: ${passed} Passed, ${failed} Failed (${((passed / testQueries.length) * 100).toFixed(1)}% Accuracy)`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("✨ ALL CROSS-DOMAIN SEARCH TESTS PASSED WITH 100% ACCURACY! ✨\n");
}