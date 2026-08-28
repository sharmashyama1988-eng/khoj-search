const { understandQuery, retrieveKnowledgeCandidates } = require('./lib/information_retrieval.ts');
const { resolveInstantMathOrFact } = require('./lib/knowledge.ts');

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
  "battle of hydaspes alexander porus",
  "bharatanatyam dance state"
];

console.log("==================================================");
console.log("TESTING GOOGLE-STYLE IR & QUERY UNDERSTANDING ENGINE");
console.log("==================================================");

let passed = 0;
testQueries.forEach((q) => {
  const analysis = understandQuery(q);
  const match = resolveInstantMathOrFact(q);

  if (match) {
    passed++;
    console.log(`✔ MATCH: "${q}"`);
    console.log(`   └─ Title: ${match.title}`);
    console.log(`   └─ Extract: ${match.extract.slice(0, 100)}...`);
  } else {
    console.log(`❌ NO MATCH: "${q}"`);
    console.log(`   └─ Cleaned: ${analysis.cleanedQuery} | Synonyms: ${analysis.expandedSynonyms.join(', ')}`);
  }
});

console.log("\n==================================================");
console.log(`IR TEST RESULTS: ${passed}/${testQueries.length} Passed`);
console.log("==================================================");