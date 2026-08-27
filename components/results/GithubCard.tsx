'use client';
import { formatDate, formatNumber } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import type { GithubResult } from '@/types';

interface Props { repo: GithubResult; index: number }

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f7df1e', Python: '#3572A5',
  Rust: '#dea584', Go: '#00ADD8', Java: '#b07219', 'C++': '#f34b7d',
  C: '#555555', Ruby: '#701516', Swift: '#ffac45', Kotlin: '#A97BFF',
  PHP: '#4F5D95', Shell: '#89e051', Vue: '#41b883', React: '#61dafb',
};

export function GithubCard({ repo, index }: Props) {
  const { t, lang } = useLanguage();
  const langColor = repo.language ? LANG_COLORS[repo.language] ?? '#888' : null;

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-4 rounded-xl border border-border
        hover:border-accent/50 hover:bg-surface-2/50 transition-all duration-150 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Repo name */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-mono font-semibold text-accent group-hover:underline line-clamp-1">
          {repo.fullName}
        </h3>
        <div className="flex items-center gap-1 text-xs text-yellow-400 shrink-0">
          ⭐ {formatNumber(repo.stars)}
        </div>
      </div>

      {/* Description */}
      {repo.description && (
        <p className="text-sm text-text-secondary line-clamp-2 mb-3">{repo.description}</p>
      )}

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColor ?? '#888' }} />
            {repo.language}
          </span>
        )}
        <span>Updated {formatDate(repo.updatedAt, lang)}</span>
      </div>

      {/* Topics */}
      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {repo.topics.slice(0, 5).map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {t}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}
