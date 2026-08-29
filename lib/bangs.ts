// ─────────────────────────────────────────────────────────────────────────────
// KHOJ !BANG DIRECT NAVIGATION & GLOBAL SHORTCUTS ENGINE
// ─────────────────────────────────────────────────────────────────────────────

export interface BangEntry {
  prefix: string;
  name: string;
  category: string;
  icon: string;
  urlTemplate: string;
}

export const BANGS: BangEntry[] = [
  { prefix: '!yt', name: 'YouTube', category: 'Video', icon: '▶️', urlTemplate: 'https://www.youtube.com/results?search_query={q}' },
  { prefix: '!w', name: 'Wikipedia', category: 'Knowledge', icon: '📖', urlTemplate: 'https://en.wikipedia.org/wiki/Special:Search?search={q}' },
  { prefix: '!wiki', name: 'Wikipedia', category: 'Knowledge', icon: '📖', urlTemplate: 'https://en.wikipedia.org/wiki/Special:Search?search={q}' },
  { prefix: '!gh', name: 'GitHub', category: 'Code', icon: '🐙', urlTemplate: 'https://github.com/search?q={q}' },
  { prefix: '!a', name: 'Amazon India', category: 'Shopping', icon: '📦', urlTemplate: 'https://www.amazon.in/s?k={q}' },
  { prefix: '!amz', name: 'Amazon Global', category: 'Shopping', icon: '📦', urlTemplate: 'https://www.amazon.com/s?k={q}' },
  { prefix: '!fk', name: 'Flipkart', category: 'Shopping', icon: '🛍️', urlTemplate: 'https://www.flipkart.com/search?q={q}' },
  { prefix: '!r', name: 'Reddit', category: 'Community', icon: '👽', urlTemplate: 'https://www.reddit.com/search/?q={q}' },
  { prefix: '!so', name: 'Stack Overflow', category: 'Code', icon: '🥞', urlTemplate: 'https://stackoverflow.com/search?q={q}' },
  { prefix: '!m', name: 'Google Maps', category: 'Maps', icon: '🗺️', urlTemplate: 'https://www.google.com/maps/search/{q}' },
  { prefix: '!maps', name: 'Google Maps', category: 'Maps', icon: '🗺️', urlTemplate: 'https://www.google.com/maps/search/{q}' },
  { prefix: '!g', name: 'Google', category: 'Search', icon: '🔍', urlTemplate: 'https://www.google.com/search?q={q}' },
  { prefix: '!b', name: 'Bing', category: 'Search', icon: '🔎', urlTemplate: 'https://www.bing.com/search?q={q}' },
  { prefix: '!ddg', name: 'DuckDuckGo', category: 'Search', icon: '🦆', urlTemplate: 'https://duckduckgo.com/?q={q}' },
  { prefix: '!x', name: 'X / Twitter', category: 'Social', icon: '🐦', urlTemplate: 'https://x.com/search?q={q}' },
  { prefix: '!tw', name: 'X / Twitter', category: 'Social', icon: '🐦', urlTemplate: 'https://x.com/search?q={q}' },
  { prefix: '!npm', name: 'NPM Registry', category: 'Code', icon: '📦', urlTemplate: 'https://www.npmjs.com/search?q={q}' },
  { prefix: '!pypi', name: 'PyPI Python', category: 'Code', icon: '🐍', urlTemplate: 'https://pypi.org/search/?q={q}' },
  { prefix: '!crates', name: 'Rust Crates', category: 'Code', icon: '🦀', urlTemplate: 'https://crates.io/search?q={q}' },
  { prefix: '!chatgpt', name: 'ChatGPT', category: 'AI', icon: '🤖', urlTemplate: 'https://chatgpt.com/?q={q}' },
  { prefix: '!claude', name: 'Claude AI', category: 'AI', icon: '🧠', urlTemplate: 'https://claude.ai' },
  { prefix: '!gemini', name: 'Google Gemini', category: 'AI', icon: '✨', urlTemplate: 'https://gemini.google.com/app' },
  { prefix: '!spotify', name: 'Spotify', category: 'Music', icon: '🎧', urlTemplate: 'https://open.spotify.com/search/{q}' },
  { prefix: '!imdb', name: 'IMDb', category: 'Movies', icon: '🍿', urlTemplate: 'https://www.imdb.com/find?q={q}' },
  { prefix: '!arxiv', name: 'arXiv Papers', category: 'Research', icon: '📄', urlTemplate: 'https://arxiv.org/search/?query={q}' },
  { prefix: '!news', name: 'Google News', category: 'News', icon: '📰', urlTemplate: 'https://news.google.com/search?q={q}' },
  { prefix: '!tr', name: 'Google Translate', category: 'Tools', icon: '🌐', urlTemplate: 'https://translate.google.com/?text={q}' },
  { prefix: '!irctc', name: 'IRCTC Trains', category: 'Travel', icon: '🚆', urlTemplate: 'https://www.irctc.co.in' },
  { prefix: '!ph', name: 'Pornhub (18+)', category: 'Adult', icon: '🔞', urlTemplate: 'https://www.pornhub.com/video/search?search={q}' },
  { prefix: '!xv', name: 'XVideos (18+)', category: 'Adult', icon: '🔞', urlTemplate: 'https://www.xvideos.com/?k={q}' },
  { prefix: '!meesho', name: 'Meesho', category: 'Shopping', icon: '👗', urlTemplate: 'https://www.meesho.com/search?q={q}' },
  { prefix: '!myntra', name: 'Myntra', category: 'Fashion', icon: '👟', urlTemplate: 'https://www.myntra.com/{q}' },
  { prefix: '!weather', name: 'Weather', category: 'Weather', icon: '⛅', urlTemplate: 'https://weather.com/en-IN/weather/today/l/{q}' },
  { prefix: '!drive', name: 'Google Drive', category: 'Cloud', icon: '📁', urlTemplate: 'https://drive.google.com/drive/search?q={q}' },
  { prefix: '!pin', name: 'Pinterest', category: 'Media', icon: '📌', urlTemplate: 'https://www.pinterest.com/search/pins/?q={q}' },
  { prefix: '!tg', name: 'Telegram Web', category: 'Social', icon: '✈️', urlTemplate: 'https://web.telegram.org' },
  { prefix: '!wa', name: 'WhatsApp Web', category: 'Social', icon: '💬', urlTemplate: 'https://web.whatsapp.com' },
];

const BANG_MAP = new Map<string, BangEntry>();
BANGS.forEach(b => {
  BANG_MAP.set(b.prefix.toLowerCase(), b);
});

export interface BangResolution {
  isBang: boolean;
  bang?: BangEntry;
  targetUrl?: string;
  cleanQuery?: string;
}

/**
 * Checks if query contains a !bang shortcut (e.g. "!yt music", "music !yt", "!w einstein")
 */
export function resolveBang(query: string): BangResolution {
  const trimmed = query.trim();
  if (!trimmed.includes('!')) {
    return { isBang: false };
  }

  const tokens = trimmed.split(/\s+/);
  let matchedBang: BangEntry | undefined;
  const remainingTokens: string[] = [];

  for (const t of tokens) {
    if (t.startsWith('!') && BANG_MAP.has(t.toLowerCase()) && !matchedBang) {
      matchedBang = BANG_MAP.get(t.toLowerCase());
    } else {
      remainingTokens.push(t);
    }
  }

  if (!matchedBang) {
    return { isBang: false };
  }

  const cleanQuery = remainingTokens.join(' ').trim();
  const encodedQ = encodeURIComponent(cleanQuery || '');
  const targetUrl = matchedBang.urlTemplate.includes('{q}')
    ? (cleanQuery ? matchedBang.urlTemplate.replace('{q}', encodedQ) : matchedBang.urlTemplate.replace(/\?.*$/, ''))
    : matchedBang.urlTemplate;

  return {
    isBang: true,
    bang: matchedBang,
    targetUrl,
    cleanQuery,
  };
}

/**
 * Returns matching bangs for autocomplete suggestions when typing "!"
 */
export function getMatchingBangs(query: string, limit = 6): BangEntry[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed.startsWith('!')) return [];

  return BANGS.filter(b => b.prefix.startsWith(trimmed) || b.name.toLowerCase().includes(trimmed.slice(1))).slice(0, limit);
}