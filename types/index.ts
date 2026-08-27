// ─── Search & Results ────────────────────────────────────────────────────────

export type SearchTab = 'all' | 'images' | 'code' | 'research' | 'books';

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  description: string;
  source: string;
  thumbnail?: string;
  date?: string;
  favicon?: string;
  badge?: string;
  extra?: Record<string, unknown>;
}

export interface WikiPanel {
  title: string;
  description: string;
  image?: string;
  imageCaption?: string;
  url: string;
  facts?: { label: string; value: string }[];
}

export interface ImageResult {
  id: string;
  title: string;
  url: string;
  thumbUrl: string;
  width?: number;
  height?: number;
  source: string;
}

export interface BookResult {
  key: string;
  title: string;
  authors: string[];
  year?: number;
  coverId?: number;
  url: string;
  subjects?: string[];
}

export interface ArxivResult {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  published: string;
  url: string;
  categories: string[];
}

export interface GithubResult {
  id: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  stars: number;
  language?: string;
  topics?: string[];
  updatedAt: string;
}

// ─── Widgets ─────────────────────────────────────────────────────────────────

export type IntentType =
  | 'calculator'
  | 'weather'
  | 'crypto'
  | 'currency'
  | 'dictionary'
  | 'timer'
  | 'stopwatch'
  | 'color'
  | 'coin_flip'
  | 'dice'
  | 'qr'
  | 'password'
  | 'unit'
  | 'map'
  | 'stock'
  | 'code'
  | 'regex'
  | 'none';

export interface DetectedIntent {
  type: IntentType;
  payload?: string;
  value?: string | number;
}

// ─── Weather ─────────────────────────────────────────────────────────────────

export interface WeatherData {
  city: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windspeed: number;
  weatherCode: number;
  description: string;
  daily: {
    dates: string[];
    maxTemps: number[];
    minTemps: number[];
    codes: number[];
  };
}

// ─── Crypto ──────────────────────────────────────────────────────────────────

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  image: string;
}

// ─── Currency ────────────────────────────────────────────────────────────────

export interface CurrencyData {
  base: string;
  target: string;
  rate: number;
  amount: number;
  result: number;
  date: string;
}

// ─── Dictionary ──────────────────────────────────────────────────────────────

export interface DictionaryMeaning {
  partOfSpeech: string;
  definitions: {
    definition: string;
    example?: string;
    synonyms: string[];
    antonyms: string[];
  }[];
}

export interface DictionaryData {
  word: string;
  phonetic?: string;
  audioUrl?: string;
  meanings: DictionaryMeaning[];
  language: string;
}

// ─── i18n ─────────────────────────────────────────────────────────────────────

export interface LangMeta {
  code: string;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  wikiCode: string;
  dictCode?: string;
  flag: string;
}

export type Locale = Record<string, string>;
