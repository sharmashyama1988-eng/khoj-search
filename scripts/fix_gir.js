const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'db', 'general_knowledge.json');

const data = JSON.parse(fs.readFileSync(file, 'utf8'));
for (const item of data) {
  if (item.title && item.title.includes('Gir National Park')) {
    item.keywords.push('gir national park asiatic lion', 'gir national park', 'gir forest gujarat', 'where is gir national park');
  }
}
fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
console.log('Updated Gir National Park keywords.');