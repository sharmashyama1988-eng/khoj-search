const fs = require('fs');
const path = require('path');
const dbDir = path.join(process.cwd(), 'db');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

function saveDb(filename, data) {
  const filePath = path.join(dbDir, filename);
  // Merge with existing entries if any, preserving uniqueness by id
  let existing = [];
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      existing = JSON.parse(raw);
    } catch (e) {}
  }
  const map = new Map();
  for (const item of existing) {
    if (item && item.id) map.set(item.id, item);
  }
  for (const item of data) {
    if (item && item.id) map.set(item.id, item);
  }
  const merged = Array.from(map.values());
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf8');
  console.log(`✔ ${filename}: ${merged.length} entries total (${data.length} newly processed)`);
}

module.exports = { saveDb };