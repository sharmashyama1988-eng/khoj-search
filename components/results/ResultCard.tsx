'use client';
import { truncate } from '@/lib/utils';
import type { SearchResult } from '@/types';

interface Props { result: SearchResult; index: number }

const SOURCE_COLORS: Record<string, string> = {
  wikipedia:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
  duckduckgo:  'bg-orange-500/10 text-orange-400 border-orange-500/20',
  openlibrary: 'bg-green-500/10 text-green-400 border-green-500/20',
  arxiv:       'bg-purple-500/10 text-purple-400 border-purple-500/20',
  github:      'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const SOURCE_LABELS: Record<string, string> = {
  wikipedia:   'Wikipedia',
  duckduckgo:  'DuckDuckGo',
  openlibrary: 'Open Library',
  arxiv:       'arXiv',
  github:      'GitHub',
};

function getFavicon(url: string): string {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  } catch { return ''; }
}

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return url; }
}

export function ResultCard({ result, index }: Props) {
  return (
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-4 rounded-xl border border-border
        hover:border-accent/50 hover:bg-surface-2/50
        transition-all duration-150 animate-fade-in"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Domain + source badge */}
      <div className="flex items-center gap-2 mb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={getFavicon(result.url)} alt="" className="w-4 h-4 rounded-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        <span className="text-xs text-text-muted">{getDomain(result.url)}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${SOURCE_COLORS[result.source] ?? ''}`}>
          {SOURCE_LABELS[result.source] ?? result.source}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-accent font-medium text-base group-hover:underline line-clamp-2 mb-1">
        {result.title}
      </h3>

      {/* Description */}
      <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
        {truncate(result.description, 250)}
      </p>
    </a>
  );
}
