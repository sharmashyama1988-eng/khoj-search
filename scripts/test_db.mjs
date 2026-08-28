import { searchKnowledgeDB, getAllEntriesCount, getEntriesByCategory } from "../lib/knowledge_db.ts";

console.log("==================================================");
console.log("         KHOJ KNOWLEDGE ENGINE DB AUDIT           ");
console.log("==================================================");

const totalEntries = getAllEntriesCount();
const categoryCounts = getEntriesByCategory();

console.log(`\n✔ Total Indexed Knowledge Entries: ${totalEntries}`);
console.log("Breakdown by Category:");
for (const [cat, count] of Object.entries(categoryCounts)) {
  console.log(`  - ${cat.padEnd(20)}: ${count} entries`);
}

const testQueries = [
  // 1. Biographies
  { q: "modi age", expectedCat: "Biography" },
  { q: "rahul gandhi", expectedCat: "Biography" },
  { q: "apj abdul kalam", expectedCat: "Biography" },
  { q: "who is mahatma gandhi", expectedCat: "Biography" },
  { q: "bhagat singh", expectedCat: "Biography" },
  { q: "netaji subhas chandra bose", expectedCat: "Biography" },
  { q: "albert einstein", expectedCat: "Biography" },
  { q: "isaac newton", expectedCat: "Biography" },
  { q: "nikola tesla", expectedCat: "Biography" },
  { q: "marie curie", expectedCat: "Biography" },
  { q: "stephen hawking", expectedCat: "Biography" },
  { q: "steve jobs", expectedCat: "Biography" },
  { q: "bill gates", expectedCat: "Biography" },
  { q: "jeff bezos", expectedCat: "Biography" },
  { q: "mark zuckerberg", expectedCat: "Biography" },
  { q: "sundar pichai", expectedCat: "Biography" },
  { q: "satya nadella", expectedCat: "Biography" },
  { q: "sam altman", expectedCat: "Biography" },
  { q: "elon musk", expectedCat: "Biography" },
  { q: "virat kohli age", expectedCat: "Biography" },
  { q: "ms dhoni", expectedCat: "Biography" },
  { q: "sachin tendulkar", expectedCat: "Biography" },
  { q: "rohit sharma", expectedCat: "Biography" },
  { q: "lionel messi", expectedCat: "Biography" },
  { q: "cristiano ronaldo", expectedCat: "Biography" },
  { q: "shah rukh khan", expectedCat: "Biography" },
  { q: "amitabh bachchan", expectedCat: "Biography" },

  // 2. Geography
  { q: "capital of france", expectedCat: "Geography" },
  { q: "capital of japan", expectedCat: "Geography" },
  { q: "capital of usa", expectedCat: "Geography" },
  { q: "capital of india", expectedCat: "Geography" },
  { q: "capital of bihar", expectedCat: "Geography" },
  { q: "capital of maharashtra", expectedCat: "Geography" },
  { q: "capital of karnataka", expectedCat: "Geography" },
  { q: "capital of tamil nadu", expectedCat: "Geography" },
  { q: "capital of uttar pradesh", expectedCat: "Geography" },
  { q: "capital of rajasthan", expectedCat: "Geography" },
  { q: "capital of kerala", expectedCat: "Geography" },
  { q: "capital of andhra pradesh", expectedCat: "Geography" },
  { q: "capital of ladakh", expectedCat: "Geography" },
  { q: "how many continents", expectedCat: "Geography" },
  { q: "how many oceans", expectedCat: "Geography" },
  { q: "mount everest height", expectedCat: "Geography" },
  { q: "longest river in the world", expectedCat: "Geography" },
  { q: "largest river by volume", expectedCat: "Geography" },
  { q: "largest desert", expectedCat: "Geography" },
  { q: "mariana trench depth", expectedCat: "Geography" },

  // 3. Mathematics
  { q: "a+b whole square", expectedCat: "Mathematics" },
  { q: "a-b whole square", expectedCat: "Mathematics" },
  { q: "a square minus b square", expectedCat: "Mathematics" },
  { q: "a+b whole cube", expectedCat: "Mathematics" },
  { q: "a3+b3", expectedCat: "Mathematics" },
  { q: "pythagoras theorem", expectedCat: "Mathematics" },
  { q: "quadratic formula", expectedCat: "Mathematics" },
  { q: "area of circle", expectedCat: "Mathematics" },
  { q: "volume of sphere", expectedCat: "Mathematics" },
  { q: "volume of cylinder", expectedCat: "Mathematics" },
  { q: "volume of cone", expectedCat: "Mathematics" },
  { q: "euler formula", expectedCat: "Mathematics" },
  { q: "sin cos tan identities", expectedCat: "Mathematics" },

  // 4. Science
  { q: "speed of light", expectedCat: "Science" },
  { q: "value of pi", expectedCat: "Science" },
  { q: "planck constant", expectedCat: "Science" },
  { q: "gravitational constant", expectedCat: "Science" },
  { q: "avogadro number", expectedCat: "Science" },
  { q: "acceleration due to gravity", expectedCat: "Science" },
  { q: "newton laws of motion", expectedCat: "Science" },
  { q: "ohm law", expectedCat: "Science" },
  { q: "laws of thermodynamics", expectedCat: "Science" },
  { q: "e=mc2", expectedCat: "Science" },
  { q: "photosynthesis formula", expectedCat: "Science" },
  { q: "chemical formula of water", expectedCat: "Science" },
  { q: "chemical formula of salt", expectedCat: "Science" },
  { q: "chemical formula of glucose", expectedCat: "Science" },
  { q: "chemical formula of baking soda", expectedCat: "Science" },
  { q: "chemical formula of sulfuric acid", expectedCat: "Science" },
  { q: "dna structure", expectedCat: "Science" },

  // 5. Technology & Programming
  { q: "git undo last commit", expectedCat: "Technology" },
  { q: "git rebase vs merge", expectedCat: "Technology" },
  { q: "git stash", expectedCat: "Technology" },
  { q: "git cherry-pick", expectedCat: "Technology" },
  { q: "http status codes", expectedCat: "Technology" },
  { q: "difference between let and var", expectedCat: "Technology" },
  { q: "javascript closure", expectedCat: "Technology" },
  { q: "javascript event loop", expectedCat: "Technology" },
  { q: "javascript promises", expectedCat: "Technology" },
  { q: "python list comprehension", expectedCat: "Technology" },
  { q: "python gil", expectedCat: "Technology" },
  { q: "python decorators", expectedCat: "Technology" },
  { q: "docker commands", expectedCat: "Technology" },
  { q: "sql joins", expectedCat: "Technology" },
  { q: "acid properties", expectedCat: "Technology" },
  { q: "solid principles", expectedCat: "Technology" },

  // 6. History
  { q: "indian independence", expectedCat: "History" },
  { q: "indian republic day", expectedCat: "History" },
  { q: "revolt of 1857", expectedCat: "History" },
  { q: "battle of plassey", expectedCat: "History" },
  { q: "dandi march", expectedCat: "History" },
  { q: "quit india movement", expectedCat: "History" },
  { q: "jallianwala bagh massacre", expectedCat: "History" },
  { q: "world war 1", expectedCat: "History" },
  { q: "world war 2", expectedCat: "History" },
  { q: "fall of berlin wall", expectedCat: "History" },
  { q: "moon landing", expectedCat: "History" },
  { q: "french revolution", expectedCat: "History" },

  // 7. Sports
  { q: "cricket pitch length", expectedCat: "Sports" },
  { q: "cricket formats", expectedCat: "Sports" },
  { q: "icc world cup winners list", expectedCat: "Sports" },
  { q: "t20 world cup winners", expectedCat: "Sports" },
  { q: "fifa world cup winners list", expectedCat: "Sports" },
  { q: "olympic motto", expectedCat: "Sports" },
  { q: "tennis grand slams order", expectedCat: "Sports" },
  { q: "badminton scoring rules", expectedCat: "Sports" },
  { q: "football match duration", expectedCat: "Sports" },
  { q: "marathon distance", expectedCat: "Sports" },
  { q: "basketball hoop height", expectedCat: "Sports" },
  { q: "rohit sharma 264", expectedCat: "Sports" },

  // 8. Inventions
  { q: "who invented telephone", expectedCat: "Inventions" },
  { q: "who invented light bulb", expectedCat: "Inventions" },
  { q: "who invented airplane", expectedCat: "Inventions" },
  { q: "who invented computer", expectedCat: "Inventions" },
  { q: "who invented world wide web", expectedCat: "Inventions" },
  { q: "who discovered penicillin", expectedCat: "Inventions" },
  { q: "who invented radio", expectedCat: "Inventions" },
  { q: "who invented steam engine", expectedCat: "Inventions" },
  { q: "who invented printing press", expectedCat: "Inventions" },
  { q: "who invented television", expectedCat: "Inventions" },
  { q: "who created python", expectedCat: "Inventions" },
  { q: "who created javascript", expectedCat: "Inventions" },
  { q: "who created c language", expectedCat: "Inventions" },
  { q: "who created linux", expectedCat: "Inventions" },
  { q: "who invented zero", expectedCat: "Inventions" },
];

console.log(`\nRunning ${testQueries.length} Search Accuracy Tests...\n`);

let passed = 0;
let failed = 0;

testQueries.forEach(({ q, expectedCat }) => {
  const start = performance.now();
  const res = searchKnowledgeDB(q);
  const duration = (performance.now() - start).toFixed(3);

  if (res && res.category === expectedCat) {
    passed++;
    console.log(`  ✔ PASS [${duration}ms]: "${q}" -> [${res.category}] ${res.title}`);
  } else if (res) {
    failed++;
    console.log(`  ❌ MISMATCH [${duration}ms]: "${q}" -> Got [${res.category}], Expected [${expectedCat}] (${res.title})`);
  } else {
    failed++;
    console.log(`  ❌ NO MATCH [${duration}ms]: "${q}" -> Expected [${expectedCat}]`);
  }
});

console.log("\n==================================================");
console.log(`RESULTS: ${passed} Passed, ${failed} Failed (${((passed / testQueries.length) * 100).toFixed(1)}% Accuracy)`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("✨ ALL KNOWLEDGE ENGINE SEARCH TESTS PASSED WITH 100% ACCURACY! ✨\n");
}
