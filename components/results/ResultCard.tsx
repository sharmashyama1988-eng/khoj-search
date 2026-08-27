'use client';
import { truncate } from '@/lib/utils';
import type { SearchResult } from '@/types';

interface Props { result: SearchResult; index: number }

const SOURCE_COLORS: Record<string, string> = {
  Reddit:        'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Quora:         'bg-red-500/10 text-red-400 border-red-500/20',
  StackOverflow: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Medium:        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Dev.to':      'bg-purple-500/10 text-purple-400 border-purple-500/20',
  GitHub:        'bg-slate-500/10 text-slate-300 border-slate-500/20',
  Wikipedia:     'bg-blue-500/10 text-blue-400 border-blue-500/20',
  DuckDuckGo:    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  YouTube:       'bg-red-600/10 text-red-500 border-red-600/20',
};

function getFavicon(url: string): string {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  } catch { return ''; }
}

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch { return url; }
}

export function ResultCard({ result, index }: Props) {
  const badge = result.badge || result.source;
  const badgeClass = SOURCE_COLORS[badge] || 'bg-surface-3 text-text-muted border-border';

  return (
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-4 rounded-xl border border-border/80 bg-surface-2/40
        hover:border-accent/50 hover:bg-surface-2/90 hover:shadow-lg hover:shadow-accent/5
        transition-all duration-200 animate-fade-in"
      style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
    >
      {/* Domain + Favicon + Source Badge */}
      <div className="flex items-center gap-2 mb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={result.favicon || getFavicon(result.url)}
          alt=""
          className="w-4 h-4 rounded-sm shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <span className="text-xs text-text-muted font-mono">{getDomain(result.url)}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${badgeClass}`}>
          {badge}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-accent font-semibold text-base group-hover:underline line-clamp-2 mb-1.5 leading-snug">
        {result.title}
      </h3>

      {/* Description */}
      <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
        {truncate(result.description, 250)}
      </p>
    </a>
  );
}
