'use client';
import { useLanguage } from '@/hooks/useLanguage';
import { CopyButton } from '@/components/ui/CopyButton';
import type { ArxivResult } from '@/types';

interface Props { paper: ArxivResult; index: number }

const CAT_COLORS: Record<string, string> = {
  'cs.': 'bg-blue-500/10 text-blue-400',
  'math.': 'bg-purple-500/10 text-purple-400',
  'physics.': 'bg-green-500/10 text-green-400',
  'stat.': 'bg-orange-500/10 text-orange-400',
  'q-bio.': 'bg-pink-500/10 text-pink-400',
};

function getCatColor(cat: string): string {
  for (const [prefix, color] of Object.entries(CAT_COLORS)) {
    if (cat.startsWith(prefix)) return color;
  }
  return 'bg-surface-3 text-text-muted';
}

export function ArxivCard({ paper, index }: Props) {
  const { t } = useLanguage();

  return (
    <div
      className="p-4 rounded-xl border border-border hover:border-accent/50
        hover:bg-surface-2/50 transition-all duration-150 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Categories */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {(paper.categories || []).map((c) => (
          <span key={c} className={`text-xs px-2 py-0.5 rounded-full font-mono ${getCatColor(c)}`}>{c}</span>
        ))}
        <span className="text-xs text-text-muted ml-auto">{paper.published}</span>
      </div>

      {/* Title */}
      <a href={paper.url} target="_blank" rel="noopener noreferrer"
        className="block font-semibold text-accent hover:underline line-clamp-2 mb-2">
        {paper.title}
      </a>

      {/* Authors */}
      <p className="text-xs text-text-muted mb-2">
        {(paper.authors || []).join(', ')}{(paper.authors?.length ?? 0) >= 5 ? ' et al.' : ''}
      </p>

      {/* Summary */}
      <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 mb-3">
        {paper.summary}
      </p>

      <div className="flex items-center gap-2">
        <a href={`https://arxiv.org/pdf/${paper.id}`} target="_blank" rel="noopener noreferrer"
          className="text-xs px-3 py-1.5 rounded-lg bg-accent/10 text-accent border border-accent/20
            hover:bg-accent hover:text-white transition-all duration-150">
          PDF
        </a>
        <CopyButton text={paper.url} />
      </div>
    </div>
  );
}
