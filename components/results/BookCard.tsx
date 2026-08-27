'use client';
import { useLanguage } from '@/hooks/useLanguage';
import { formatDate } from '@/lib/utils';
import type { BookResult } from '@/types';

interface Props { book: BookResult; index: number }

export function BookCard({ book, index }: Props) {
  const { t, lang } = useLanguage();
  const coverUrl = book.coverId
    ? `https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`
    : null;

  return (
    <a
      href={book.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-4 p-4 rounded-xl border border-border
        hover:border-accent/50 hover:bg-surface-2/50 transition-all duration-150 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Cover */}
      <div className="shrink-0 w-16 h-24 rounded-lg overflow-hidden bg-surface-2 border border-border">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt={book.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">📖</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-text-primary group-hover:text-accent line-clamp-2 mb-1 transition-colors">
          {book.title}
        </h3>
        {Boolean(book.authors?.length) && (
          <p className="text-sm text-text-secondary mb-1">
            {t('authors')}: {book.authors.slice(0, 3).join(', ')}
          </p>
        )}
        {book.year && (
          <p className="text-xs text-text-muted mb-2">
            {t('published')}: {book.year}
          </p>
        )}
        {Boolean(book.subjects?.length) && (
          <div className="flex flex-wrap gap-1.5">
            {book.subjects!.slice(0, 4).map((s) => (
              <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-surface-3 text-text-muted border border-border">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
