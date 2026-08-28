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

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about', 'against',
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am',
  'how', 'why', 'when', 'where', 'tell', 'me', 'please', 'know', 'give',
  'है', 'हैं', 'था', 'थी', 'थे', 'का', 'के', 'की', 'को', 'और', 'में', 'से',
  'पर', 'लिए', 'यह', 'वह', 'क्या', 'कौन', 'कहाँ', 'कब', 'कैसे', 'बताओ',
  'hai', 'hain', 'tha', 'thi', 'the', 'ka', 'ke', 'ki', 'ko', 'aur', 'mein',
  'se', 'par', 'liye', 'yeh', 'woh', 'kya', 'kaun', 'kahan', 'kab', 'kaise',
  'batao', 'bataiye', 'hota', 'hoti', 'hote', 'ne', 'tak', 'bhi', 'to', 'kis',
  'kiske', 'kiski', 'konsa', 'kismein'
]);

const SYNONYM_MAP = {
  'pradhanmantri': ['prime minister', 'pm', 'pm of india', 'narendra modi'],
  'pradhan mantri': ['prime minister', 'pm', 'pm of india', 'narendra modi'],
  'prime minister': ['pradhanmantri', 'pm', 'narendra modi'],
  'pm': ['prime minister', 'pradhanmantri', 'narendra modi'],
  'rashtrapati': ['president', 'president of india', 'droupadi murmu'],
  'president': ['rashtrapati', 'droupadi murmu'],
  'rajdhani': ['capital', 'capital city'],
  'capital': ['rajdhani'],
  'nadi': ['river'],
  'river': ['nadi'],
  'bandh': ['dam', 'reservoir'],
  'dam': ['bandh'],
  'khel': ['sports', 'game'],
  'yudh': ['battle', 'war'],
  'khoj': ['invention', 'discovery', 'invented', 'discovered'],
  'aavishkar': ['invention', 'discovery', 'inventor']
};

function understandQuery(rawQuery) {
  if (!rawQuery) return { rawQuery: '', cleanedQuery: '', coreTokens: [], allTokens: [], expandedSynonyms: [] };

  const normalized = rawQuery.toLowerCase().trim();
  const rawTokens = normalized.replace(/[^\w\s\^\+\-\*\/\=]/g, ' ').split(/\s+/).filter(w => w.length >= 1);
  const coreTokens = rawTokens.filter(t => !STOP_WORDS.has(t) && t.length >= 2);

  const expandedSynonyms = [];
  rawTokens.forEach(token => {
    if (SYNONYM_MAP[token]) expandedSynonyms.push(...SYNONYM_MAP[token]);
  });
  for (let i = 0; i < rawTokens.length - 1; i++) {
    const bigram = `${rawTokens[i]} ${rawTokens[i + 1]}`;
    if (SYNONYM_MAP[bigram]) expandedSynonyms.push(...SYNONYM_MAP[bigram]);
  }

  return {
    rawQuery,
    cleanedQuery: coreTokens.join(' ') || normalized,
    coreTokens,
    allTokens: rawTokens,
    expandedSynonyms: Array.from(new Set(expandedSynonyms))
  };
}

function retrieveKnowledgeCandidates(analysis) {
  const { rawQuery, cleanedQuery, coreTokens, expandedSynonyms } = analysis;
  if (!rawQuery || rawQuery.trim().length < 2) return null;

  const rawClean = rawQuery.toLowerCase().trim();
  const searchPool = [rawClean, cleanedQuery, ...expandedSynonyms];

  let bestMatch = null;
  let highestScore = 0;

  for (const entry of allEntries) {
    let score = 0;

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

    const kwTokens = entry.keywords.flatMap(k => k.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(w => w.length >= 2));
    const titleTokens = entry.title.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(w => w.length >= 2);
    const combinedTokens = new Set([...kwTokens, ...titleTokens]);

    let matchedCore = 0;
    coreTokens.forEach(t => {
      if (combinedTokens.has(t)) matchedCore++;
    });

    if (coreTokens.length > 0) {
      const coreRatio = matchedCore / coreTokens.length;
      if (coreRatio === 1.0) score += 500;
      else if (coreRatio >= 0.75) score += 300;
      else if (coreRatio >= 0.5) score += 150;
    }

    const titleLower = entry.title.toLowerCase();
    if (coreTokens.length > 0 && coreTokens.every(t => titleLower.includes(t))) {
      score += 300;
    }

    if (score > highestScore && score >= 220) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  return bestMatch;
}

const testQueries = [
  "bharat ka pradhanmantri kaun hai",
  "bharat ke rashtrapati kaun hai",
  "capital of france",
  "speed of light in vacuum",
  "who is missile man of india",
  "iron man of india",
  "where is jim corbett national park",
  "kaziranga national park famous for",
  "gir national park asiatic lion",
  "which river is tehri dam built on",
  "headquarters of unesco",
  "when is national science day",
  "battle of the hydaspes",
  "bharatanatyam dance state"
];

console.log("==================================================");
console.log("TESTING GOOGLE-STYLE IR & QUERY UNDERSTANDING ENGINE");
console.log("==================================================");

let passed = 0;
testQueries.forEach((q) => {
  const analysis = understandQuery(q);
  const match = retrieveKnowledgeCandidates(analysis);

  if (match) {
    passed++;
    console.log(`✔ MATCH: "${q}"`);
    console.log(`   └─ Title: ${match.title}`);
    console.log(`   └─ Answer: ${match.answer.slice(0, 100)}...`);
  } else {
    console.log(`❌ NO MATCH: "${q}"`);
  }
});

console.log("\n==================================================");
console.log(`IR TEST RESULTS: ${passed}/${testQueries.length} Passed (${((passed/testQueries.length)*100).toFixed(1)}% Accuracy)`);
console.log("==================================================");