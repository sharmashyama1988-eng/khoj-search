'use client';
import { useEffect, useState } from 'react';
import { CopyButton } from '@/components/ui/CopyButton';

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
  const [speaking, setSpeaking] = useState(false);

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

  const toggleSpeak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const cleanText = text.slice(0, 3000).replace(/[*#_`]/g, '');
    const utt = new SpeechSynthesisUtterance(cleanText);
    utt.rate = 1.0;
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Window */}
      <div className="relative w-full max-w-3xl max-h-[88vh] bg-surface-2 border border-border/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 animate-scale-up">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/60 bg-surface-3/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-base text-indigo-400">📖</span>
            <span className="font-semibold text-sm text-text-primary truncate">
              {data?.title || initialTitle || 'Instant Reader Mode'}
            </span>
            {data?.readingTimeMinutes && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium shrink-0">
                ⏱ {data.readingTimeMinutes} min read
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {data?.content && (
              <>
                <button
                  type="button"
                  onClick={() => toggleSpeak(data.content)}
                  title={speaking ? 'Stop Reading' : 'Listen with TTS'}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer
                    ${speaking ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-surface-3 hover:bg-surface-4 text-text-muted border-border/60'}`}
                >
                  <span>{speaking ? '⏹ Stop' : '🔊 Listen'}</span>
                </button>
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
