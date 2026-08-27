'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { CopyButton } from '@/components/ui/CopyButton';
import type { DictionaryData } from '@/types';

interface Props { word: string }

export function DictionaryWidget({ word }: Props) {
  const { t, lang } = useLanguage();
  const [data, setData]     = useState<DictionaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);
  const [input, setInput]   = useState(word);
  const [search, setSearch] = useState(word);
  const [openMeaning, setOpenMeaning] = useState<number | null>(0);

  useEffect(() => {
    if (!search) return;
    setLoading(true);
    setError(null);
    fetch(`/api/dictionary?word=${encodeURIComponent(search)}&lang=${lang}`)
      .then((r) => r.json())
      .then((d: DictionaryData & { error?: string }) => {
        if (d.error) setError('Word not found in ' + lang + ' dictionary');
        else setData(d);
      })
      .catch(() => setError('Failed to fetch'))
      .finally(() => setLoading(false));
  }, [search, lang]);

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch(() => {});
  };

  return (
    <div className="rounded-xl border border-border bg-surface-2/80 overflow-hidden w-full animate-fade-in">
      {/* Search bar */}
      <div className="px-5 pt-4 pb-3 border-b border-border flex gap-2">
        <span className="text-xl">📖</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && setSearch(input)}
          placeholder="Enter a word…"
          className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted outline-none"
        />
        <button onClick={() => setSearch(input)}
          className="px-3 py-1 text-xs rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors">
          {t('search_button')}
        </button>
      </div>

      {loading && (
        <div className="p-6 text-text-muted text-sm animate-pulse">{t('loading')}</div>
      )}

      {error && !loading && (
        <div className="p-6 text-red-400 text-sm">{error}</div>
      )}

      {data && !loading && (
        <div className="px-5 py-4">
          {/* Word + phonetic + audio */}
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-text-primary">{data.word}</h2>
            {data.phonetic && (
              <span className="text-sm text-text-muted font-mono">{data.phonetic}</span>
            )}
            {data.audioUrl && (
              <button
                onClick={() => playAudio(data.audioUrl!)}
                className="w-7 h-7 rounded-full bg-accent/10 text-accent border border-accent/30
                  hover:bg-accent hover:text-white transition-all flex items-center justify-center text-xs"
                title={t('play')}
              >
                ▶
              </button>
            )}
            <div className="ml-auto">
              <CopyButton text={data.word} />
            </div>
          </div>

          {/* Language badge */}
          <span className="text-xs px-2 py-0.5 rounded-full bg-surface-3 text-text-muted border border-border">
            {data.language}
          </span>

          {/* Meanings */}
          <div className="mt-4 space-y-2">
            {data.meanings.map((m, mi) => (
              <div key={mi} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenMeaning(openMeaning === mi ? null : mi)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left
                    bg-surface-3 hover:bg-surface-2 transition-colors"
                >
                  <span className="text-sm font-semibold text-accent italic">{m.partOfSpeech}</span>
                  <svg className={`w-4 h-4 text-text-muted transition-transform ${openMeaning === mi ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openMeaning === mi && (
                  <div className="px-4 py-3 space-y-3">
                    {m.definitions.map((def, di) => (
                      <div key={di}>
                        <p className="text-sm text-text-primary leading-relaxed">
                          <span className="text-text-muted mr-2">{di + 1}.</span>
                          {def.definition}
                        </p>
                        {def.example && (
                          <p className="text-sm text-text-muted italic mt-1 pl-4 border-l-2 border-border">
                            &ldquo;{def.example}&rdquo;
                          </p>
                        )}
                        {def.synonyms.length > 0 && (
                          <p className="text-xs text-text-muted mt-1 pl-4">
                            <span className="font-medium text-green-400">{t('synonyms')}:</span>{' '}
                            {def.synonyms.slice(0, 5).join(', ')}
                          </p>
                        )}
                        {def.antonyms.length > 0 && (
                          <p className="text-xs text-text-muted mt-0.5 pl-4">
                            <span className="font-medium text-red-400">{t('antonyms')}:</span>{' '}
                            {def.antonyms.slice(0, 5).join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
