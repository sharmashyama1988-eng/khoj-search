const fs = require('fs');
const path = require('path');
const dbDir = path.join(process.cwd(), 'db');

const files = fs.readdirSync(dbDir).filter(f => f.endsWith('.json'));
let totalSize = 0;
files.forEach(f => {
  const stats = fs.statSync(path.join(dbDir, f));
  totalSize += stats.size;
});
console.log('Total files:', files.length);
console.log('Total size on disk:', (totalSize / 1024 / 1024).toFixed(2), 'MB');