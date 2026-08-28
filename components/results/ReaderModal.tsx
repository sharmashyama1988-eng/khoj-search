'use client';
import { useEffect, useState } from 'react';
import { CopyButton } from '@/components/ui/CopyButton';
import { TTSButton } from '@/components/ui/TTSButton';

interface ReaderData {
  title: string;
  url: string;
  domain: string;
  description: string;
  content: string;
  wordCount: number;
  readingTimeMinutes: number;
  source: string;
}

interface Props {
  url: string;
  initialTitle?: string;
  onClose: () => void;
}

export function ReaderModal({ url, initialTitle, onClose }: Props) {
  const [data, setData] = useState<ReaderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    setError(null);

    fetch(`/api/reader?url=${encodeURIComponent(url)}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.error) throw new Error(res.error);
        setData(res);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load reader content.');
      })
      .finally(() => setLoading(false));
  }, [url]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-surface-2 border border-border/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 border-b border-border/60 bg-surface-3/40">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base shrink-0">📖</span>
            <span className="text-xs sm:text-sm font-semibold text-text-primary truncate">
              {data?.title || initialTitle || 'Reading Mode'}
            </span>
            {data && (
              <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 font-mono hidden sm:inline-block">
                {data.readingTimeMinutes} min read
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {data && (
              <>
                <TTSButton text={data.content} lang="en" size="sm" label="Listen" />
                <CopyButton text={data.content} />
              </>
            )}

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-3 hover:bg-surface-4 text-indigo-400 border border-border/60 transition-colors flex items-center gap-1"
            >
              <span>Visit Site</span>
              <span>↗</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-4 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <p className="text-text-secondary text-sm">Extracting clean distraction-free article...</p>
            </div>
          )}

          {error && (
            <div className="py-12 text-center space-y-3">
              <span className="text-4xl">⚠️</span>
              <p className="text-text-secondary text-sm">{error}</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700"
              >
                Open directly in new tab →
              </a>
            </div>
          )}

          {!loading && !error && data && (
            <div className="max-w-2xl mx-auto space-y-4">
              {/* Header Info */}
              <div className="border-b border-border/40 pb-4">
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary leading-tight mb-2">
                  {data.title}
                </h1>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span>Source: <strong className="text-text-secondary">{data.domain}</strong></span>
                  <span>•</span>
                  <span>{data.wordCount} words</span>
                </div>
              </div>

              {/* Clean Article Text */}
              <div className="text-text-secondary text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans">
                {data.content}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
