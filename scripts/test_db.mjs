import { searchKnowledgeDB } from "./lib/knowledge_db.ts";

console.log("=== Testing Knowledge DB Engine ===");

const queries = [
  "modi age",
  "capital of france",
  "a+b whole square",
  "speed of light",
  "git undo last commit",
  "difference between let and var",
  "photosynthesis formula",
  "mount everest height",
  "how many continents"
];

queries.forEach(q => {
  const res = searchKnowledgeDB(q);
  console.log(`\nQuery: "${q}"`);
  if (res) {
    console.log(`  ✔ MATCH: [${res.category}] ${res.title}`);
    console.log(`    Answer: ${res.answer}`);
  } else {
    console.log(`  ❌ NO MATCH`);
  }
});
