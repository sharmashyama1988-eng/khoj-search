export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function formatDate(iso: string, lang = 'en'): string {
  try {
    return new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(iso));
  } catch {
    return iso.split('T')[0];
  }
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
}

export function truncate(str: string, max = 200): string {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let id: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), ms);
  }) as T;
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export const WEATHER_CODES: Record<number, { label: string; icon: string }> = {
  0:  { label: 'Clear sky',          icon: '☀️' },
  1:  { label: 'Mainly clear',       icon: '🌤️' },
  2:  { label: 'Partly cloudy',      icon: '⛅' },
  3:  { label: 'Overcast',           icon: '☁️' },
  45: { label: 'Fog',                icon: '🌫️' },
  48: { label: 'Icy fog',            icon: '🌫️' },
  51: { label: 'Light drizzle',      icon: '🌦️' },
  53: { label: 'Drizzle',            icon: '🌦️' },
  55: { label: 'Heavy drizzle',      icon: '🌧️' },
  61: { label: 'Slight rain',        icon: '🌧️' },
  63: { label: 'Rain',               icon: '🌧️' },
  65: { label: 'Heavy rain',         icon: '🌧️' },
  71: { label: 'Slight snow',        icon: '🌨️' },
  73: { label: 'Snow',               icon: '❄️' },
  75: { label: 'Heavy snow',         icon: '❄️' },
  80: { label: 'Rain showers',       icon: '🌦️' },
  95: { label: 'Thunderstorm',       icon: '⛈️' },
  99: { label: 'Hailstorm',          icon: '⛈️' },
};

export function getWeatherIcon(code: number): string {
  return WEATHER_CODES[code]?.icon ?? '🌡️';
}

export function getWeatherLabel(code: number): string {
  return WEATHER_CODES[code]?.label ?? 'Unknown';
}

// Safe math evaluator — no eval()
export function safeMath(expr: string): number | null {
  try {
    const sanitized = expr
      .replace(/[^0-9+\-*/.()%\s^]/g, '')
      .replace(/\^/g, '**');
    if (!sanitized.trim()) return null;
    // eslint-disable-next-line no-new-func
    const result = new Function(`"use strict"; return (${sanitized})`)() as number;
    if (!isFinite(result)) return null;
    return result;
  } catch {
    return null;
  }
}

export function generatePassword(length: number, opts: { upper: boolean; lower: boolean; numbers: boolean; symbols: boolean }): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const nums  = '0123456789';
  const syms  = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  let pool = '';
  if (opts.upper)   pool += upper;
  if (opts.lower)   pool += lower;
  if (opts.numbers) pool += nums;
  if (opts.symbols) pool += syms;
  if (!pool) pool = lower + nums;
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (v) => pool[v % pool.length]).join('');
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  const full  = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  if (full.length !== 6) return null;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
