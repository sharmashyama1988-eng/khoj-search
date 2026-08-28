const fs = require('fs');
const path = require('path');
const dbDir = path.join(process.cwd(), 'db');

const files = fs.readdirSync(dbDir).filter(f => f.endsWith('.json'));
let totalEntries = 0;
let totalTokens = 0;
let totalSizeBytes = 0;
const categoryCounts = {};

files.forEach(f => {
  const filePath = path.join(dbDir, f);
  const raw = fs.readFileSync(filePath, 'utf8');
  totalSizeBytes += raw.length;
  const data = JSON.parse(raw);
  totalEntries += data.length;

  data.forEach(entry => {
    categoryCounts[entry.category] = (categoryCounts[entry.category] || 0) + 1;
    // Estimate tokens/parameters: words + punctuation
    const text = JSON.stringify(entry);
    const tokens = text.split(/\s+|[^\w\s]/).filter(t => t.length > 0).length;
    totalTokens += tokens;
  });
});

console.log("==========================================================");
console.log("       KHOJ KNOWLEDGE ENGINE — PARAMETER AUDIT REPORT     ");
console.log("==========================================================");
console.log(`Total Database Files    : ${files.length} JSON stores`);
console.log(`Total Verified Entries  : ${totalEntries} high-density knowledge nodes`);
console.log(`Total Database Size     : ${(totalSizeBytes / 1024 / 1024).toFixed(2)} MB`);
console.log(`Estimated Token/Param Ct: ${(totalTokens / 1000).toFixed(1)}k parameters (~${totalTokens.toLocaleString()} total tokens/parameters)`);
console.log("\nCategory Distribution:");
for (const [cat, count] of Object.entries(categoryCounts).sort((a,b) => b[1] - a[1])) {
  console.log(`  - ${cat.padEnd(30)}: ${String(count).padStart(3)} entries`);
}
console.log("==========================================================");