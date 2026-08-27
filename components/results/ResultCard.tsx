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
  Wikipedia:     'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
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

function getCleanBreadcrumb(url: string): string {
  try {
    const u = new URL(url);
    const pathParts = u.pathname.split('/').filter(Boolean).slice(0, 2);
    if (!pathParts.length) return u.hostname;
    return `${u.hostname} › ${pathParts.join(' › ')}`;
  } catch {
    return url;
  }
}

export function ResultCard({ result, index }: Props) {
  const badge = result.badge || result.source;
  const badgeClass = SOURCE_COLORS[badge] || 'bg-surface-3/50 text-text-muted border-border/40';

  return (
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block py-3.5 px-2 rounded-xl border-b border-border/20 last:border-b-0
        hover:bg-surface-2/40 transition-colors duration-150 animate-fade-in"
      style={{ animationDelay: `${Math.min(index * 25, 250)}ms` }}
    >
      {/* Google-style Header: Favicon + Domain + Breadcrumb + Badge */}
      <div className="flex items-center gap-2 mb-1 text-xs text-text-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={result.favicon || getFavicon(result.url)}
          alt=""
          className="w-4 h-4 rounded-full shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <span className="font-medium text-text-primary text-[13px]">{getDomain(result.url)}</span>
        <span className="text-text-muted/60 text-[12px] truncate max-w-xs">{getCleanBreadcrumb(result.url)}</span>
        <span className={`text-[10px] px-2 py-0.2 rounded-full border font-medium ml-auto ${badgeClass}`}>
          {badge}
        </span>
      </div>

      {/* Google-style Title: Soft Blue/Indigo Link */}
      <h3 className="text-[19px] leading-[26px] font-normal text-indigo-400 dark:text-[#8ab4f8] group-hover:underline line-clamp-1 mb-1">
        {result.title}
      </h3>

      {/* Google-style Description Snippet */}
      <p className="text-[14px] leading-[22px] text-text-secondary dark:text-[#bdc1c6] line-clamp-2">
        {truncate(result.description, 240)}
      </p>
    </a>
  );
}
