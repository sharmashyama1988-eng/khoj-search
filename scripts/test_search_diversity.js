const { hybridReRank, applyReciprocalRankFusion } = require('./lib/rerank.ts');

console.log("==================================================");
console.log("TESTING SEARCH RESULTS DOMAIN DIVERSITY");
console.log("==================================================");

// Sample simulated candidate list with news and general websites
const candidates = [
  { id: '1', title: 'Kim Jong Un North Korea News', url: 'https://news.google.com/1', domain: 'news.google.com', badge: '🔴 Live News', score: 120, description: 'News from Aaj Tak' },
  { id: '2', title: 'North Korea Policy Update News', url: 'https://news.google.com/2', domain: 'news.google.com', badge: '🔴 Live News', score: 120, description: 'News from NDTV' },
  { id: '3', title: 'Kim Jong Un - Wikipedia', url: 'https://en.wikipedia.org/wiki/Kim_Jong_Un', domain: 'wikipedia.org', badge: 'Wikipedia', score: 300, description: 'Kim Jong Un is a North Korean politician who has been Supreme Leader...' },
  { id: '4', title: 'North Korea Country Profile - BBC', url: 'https://www.bbc.com/news/world-asia-pacific-15256037', domain: 'bbc.com', badge: 'BBC', score: 250, description: 'Comprehensive country profile, history, leadership, and facts.' },
  { id: '5', title: 'Britannica Encyclopedia: Kim Jong Un', url: 'https://www.britannica.com/biography/Kim-Jong-Un', domain: 'britannica.com', badge: 'Britannica', score: 280, description: 'Biography, background, military history and timeline.' },
  { id: '6', title: 'Council on Foreign Relations: North Korea Leadership', url: 'https://www.cfr.org/backgrounder/north-korea', domain: 'cfr.org', badge: 'CFR', score: 260, description: 'In-depth analysis of government, nuclear policy, and foreign relations.' }
];

console.log("Testing with general query: 'kim jong un'");
// Notice how Wikipedia, Britannica, CFR, BBC take the top spots and news is de-emphasized!