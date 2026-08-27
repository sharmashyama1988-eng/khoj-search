import type { DetectedIntent, IntentType } from '@/types';

interface IntentPattern {
  type: IntentType;
  patterns: RegExp[];
  extract?: (query: string, match: RegExpMatchArray) => string | undefined;
}

// ── Site: operator extraction ────────────────────────────────────────────────
export function extractSiteOperator(query: string): { site: string | null; cleanQuery: string } {
  const m = query.match(/\bsite:([^\s]+)/i);
  if (!m) return { site: null, cleanQuery: query };
  return { site: m[1], cleanQuery: query.replace(m[0], '').trim() };
}

export function extractFileType(query: string): { filetype: string | null; cleanQuery: string } {
  const m = query.match(/\bfiletype:([^\s]+)/i);
  if (!m) return { filetype: null, cleanQuery: query };
  return { filetype: m[1], cleanQuery: query.replace(m[0], '').trim() };
}

const INTENT_PATTERNS: IntentPattern[] = [
  {
    type: 'weather',
    patterns: [
      /^weather\s*(in|at|for)?\s*(.+)/i,
      /^(.+)\s+weather$/i,
      /^(\w+)\s+ka\s+mausam$/i,
      /^مناخ\s+(.+)/i,
      /^météo\s+(.+)/i,
      /^Wetter\s+(.+)/i,
    ],
    extract: (q) => {
      const m =
        q.match(/weather\s+(?:in|at|for)?\s*(.+)/i) ||
        q.match(/^(.+)\s+weather$/i) ||
        q.match(/^(\w+)\s+ka\s+mausam$/i);
      return m?.[1]?.trim() || q.replace(/weather/gi, '').trim() || 'Delhi';
    },
  },
  {
    type: 'crypto',
    patterns: [
      /\b(bitcoin|btc|ethereum|eth|solana|sol|dogecoin|doge|binance|bnb|cardano|ada|ripple|xrp|litecoin|ltc|crypto)\b/i,
      /\bprice of\s+\w+\s+coin\b/i,
    ],
    extract: (q) => {
      const m = q.match(/\b(bitcoin|btc|ethereum|eth|solana|sol|dogecoin|doge|binance|bnb|cardano|ada|ripple|xrp|litecoin|ltc)\b/i);
      const map: Record<string, string> = {
        btc: 'bitcoin', eth: 'ethereum', sol: 'solana', doge: 'dogecoin',
        bnb: 'binancecoin', ada: 'cardano', xrp: 'ripple', ltc: 'litecoin',
      };
      const key = m?.[1]?.toLowerCase() ?? '';
      return map[key] ?? key;
    },
  },
  {
    type: 'currency',
    patterns: [
      /(\d+(?:\.\d+)?)\s*([a-z]{3})\s+(?:to|in|=)\s*([a-z]{3})/i,
      /convert\s+(\d+(?:\.\d+)?)\s+([a-z]{3})\s+to\s+([a-z]{3})/i,
    ],
    extract: (q) => {
      const m = q.match(/(\d+(?:\.\d+)?)\s*([a-z]{3})\s+(?:to|in|=)\s*([a-z]{3})/i) ||
                q.match(/convert\s+(\d+(?:\.\d+)?)\s*([a-z]{3})\s+to\s*([a-z]{3})/i);
      if (m) return `${m[1]}:${m[2].toUpperCase()}:${m[3].toUpperCase()}`;
      return undefined;
    },
  },
  {
    type: 'unit',
    patterns: [
      /(\d+(?:\.\d+)?)\s*(km|m|cm|mm|miles?|feet|ft|inches?|in|kg|lbs?|pounds?|g|oz|l|ml|gallons?|celsius|fahrenheit|°c|°f)\s+(?:to|in)\s+(\w+)/i,
    ],
    extract: (q) => q,
  },
  {
    type: 'calculator',
    patterns: [
      /^[\d\s+\-*/().%^]+$/,
      /\bcalculator?\b/i,
      /\bcalc\b/i,
      /\b(sin|cos|tan|log|sqrt|pow)\s*\(/i,
    ],
    extract: (q) => {
      const mathExpr = q.replace(/calculator?|calc/gi, '').trim();
      return mathExpr || undefined;
    },
  },
  {
    type: 'dictionary',
    patterns: [
      /^(?:define|definition of|meaning of|what (?:is|does)|शब्दार्थ|अर्थ)\s+(.+)/i,
      /^(.+)\s+(?:meaning|definition|ka matlab|मतलब)$/i,
      /^(.+)\s+ka\s+matlab$/i,
    ],
    extract: (q) => {
      const m =
        q.match(/^(?:define|definition of|meaning of|what (?:is|does)|शब्दार्थ|अर्थ)\s+(.+)/i) ||
        q.match(/^(.+)\s+(?:meaning|definition|ka matlab|मतलब)$/i) ||
        q.match(/^(.+)\s+ka\s+matlab$/i);
      return m?.[1]?.trim();
    },
  },
  {
    type: 'timer',
    patterns: [
      /^(?:timer|countdown|set timer)\s*(\d+)?\s*(seconds?|secs?|minutes?|mins?|hours?|hrs?)?/i,
      /^(\d+)\s*(seconds?|secs?|minutes?|mins?|hours?|hrs?)\s+timer/i,
    ],
    extract: (q) => {
      const m = q.match(/(\d+)\s*(seconds?|secs?|minutes?|mins?|hours?|hrs?)/i);
      if (!m) return '60';
      const val = parseInt(m[1]);
      const unit = m[2]?.toLowerCase() ?? 's';
      if (unit.startsWith('m')) return String(val * 60);
      if (unit.startsWith('h')) return String(val * 3600);
      return String(val);
    },
  },
  {
    type: 'stopwatch',
    patterns: [/^stopwatch$/i, /^स्टॉपवॉच$/i, /^chronomètre$/i, /^cronómetro$/i],
  },
  {
    type: 'color',
    patterns: [
      /^#([0-9a-f]{3,8})\b/i,
      /^rgb\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/i,
      /^hsl\s*\(\s*\d+\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*\)/i,
      /^color\s*picker?/i,
      /^colour\s*picker?/i,
    ],
    extract: (q) => {
      const hex = q.match(/^(#[0-9a-f]{3,8})/i);
      const rgb = q.match(/^(rgb\s*\([^)]+\))/i);
      return hex?.[1] ?? rgb?.[1] ?? '#6366f1';
    },
  },
  {
    type: 'coin_flip',
    patterns: [
      /^flip\s+(?:a\s+)?coin/i,
      /^heads\s+or\s+tails/i,
      /^sikka\s+uchalo/i,
      /^pile\s+ou\s+face/i,
    ],
  },
  {
    type: 'dice',
    patterns: [
      /^roll\s+(?:a?\s+)?dice?/i,
      /^roll\s+(?:a?\s+)?die/i,
      /^pasa\s+phenko/i,
      /^lancer\s+(?:un\s+)?dé/i,
    ],
    extract: (q) => {
      const m = q.match(/(\d+)d(\d+)/i) ?? q.match(/(\d+)\s+(?:sided?\s+)?dice/i);
      return m ? `${m[1]}:${m[2] ?? '6'}` : '1:6';
    },
  },
  {
    type: 'qr',
    patterns: [
      /^qr\s*(?:code|generator)?\s*(.*)/i,
      /^generate\s+qr/i,
      /^qr\s+बनाओ/i,
    ],
    extract: (q) => {
      const m = q.match(/^qr\s*(?:code|generator)?\s*(.*)/i);
      return m?.[1]?.trim() || '';
    },
  },
  {
    type: 'password',
    patterns: [
      /^(?:password\s+generator?|generate\s+password|random\s+password|strong\s+password)/i,
      /^पासवर्ड\s+बनाओ/i,
      /^générateur\s+de\s+mot\s+de\s+passe/i,
    ],
  },
  {
    type: 'map',
    patterns: [
      /^map\s+(?:of\s+)?(.+)/i,
      /^(.+)\s+map$/i,
      /^location\s+(?:of\s+)?(.+)/i,
      /^where\s+is\s+(.+)/i,
      /^(.+)\s+कहाँ\s+है/i,
      /^(.+)\s+location$/i,
      /^directions?\s+to\s+(.+)/i,
    ],
    extract: (q) => {
      const m = q.match(/^map\s+(?:of\s+)?(.+)/i) ||
                q.match(/^(.+)\s+map$/i) ||
                q.match(/^location\s+(?:of\s+)?(.+)/i) ||
                q.match(/^where\s+is\s+(.+)/i) ||
                q.match(/^directions?\s+to\s+(.+)/i);
      return m?.[1]?.trim() ?? q;
    },
  },
  {
    type: 'stock',
    patterns: [
      /^(?:stock|share|equity)\s+(?:price\s+of\s+)?([a-z]{1,5})\b/i,
      /\b([a-z]{1,5})\s+stock\s+price\b/i,
      /\b([a-z]{1,5})\s+share\s+price\b/i,
      /^(?:nse|bse|nasdaq|nyse):\s*([a-z]{1,10})/i,
      /^([a-z]{1,5})\s+(?:stonk|ticker)/i,
    ],
    extract: (q) => {
      const m = q.match(/^(?:stock|share|equity)\s+(?:price\s+of\s+)?([a-z]{1,5})\b/i) ||
                q.match(/\b([a-z]{1,5})\s+stock\s+price\b/i) ||
                q.match(/\b([a-z]{1,5})\s+share\s+price\b/i) ||
                q.match(/^(?:nse|bse|nasdaq|nyse):\s*([a-z]{1,10})/i);
      return m?.[1]?.toUpperCase() ?? q.toUpperCase().split(' ')[0];
    },
  },
  {
    type: 'code',
    patterns: [
      /^(?:run|execute|compile|code)\s+(.+)/i,
      /^(?:python|javascript|js|c\+\+|cpp|java|rust|go|ruby)\s+code/i,
      /^code\s+runner?$/i,
      /^live\s+(?:code|compiler)/i,
    ],
    extract: (q) => {
      const m = q.match(/^(?:run|execute|compile|code)\s+(.+)/i);
      return m?.[1]?.trim() ?? '';
    },
  },
  {
    type: 'regex',
    patterns: [
      /^regex\s*(?:test|tester|tool)?/i,
      /^(?:test\s+)?regex(?:p)?\s*[:=]/i,
      /^base64\s+(?:encode|decode)/i,
      /^url\s+(?:encode|decode)/i,
      /^(?:encode|decode)\s+(?:base64|url)/i,
      /^string\s+(?:tool|analyzer)/i,
    ],
    extract: (q) => q,
  },
];

export function detectIntent(query: string): DetectedIntent {
  const q = query.trim();
  if (!q) return { type: 'none' };

  for (const intent of INTENT_PATTERNS) {
    for (const pattern of intent.patterns) {
      const match = q.match(pattern);
      if (match) {
        const payload = intent.extract ? intent.extract(q, match) : undefined;
        return { type: intent.type, payload };
      }
    }
  }
  return { type: 'none' };
}
