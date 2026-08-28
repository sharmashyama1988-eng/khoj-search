const fs = require('fs');
const path = require('path');
const dbDir = path.join(process.cwd(), 'db');

const files = fs.readdirSync(dbDir).filter(f => f.endsWith('.json'));
let total = 0;
console.log('=== CURRENT DB SUMMARY ===');
files.forEach(f => {
  const filePath = path.join(dbDir, f);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log('  ' + f.padEnd(32) + ' : ' + String(data.length).padStart(3) + ' entries');
  total += data.length;
});
console.log('====================================');
console.log('Total entries across all ' + files.length + ' DB files: ' + total);