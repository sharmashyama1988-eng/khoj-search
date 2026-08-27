'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { truncate } from '@/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';

interface SummaryData {
  title: string;
  extract: string;
  image?: string;
  url: string;
  type: 'wikipedia' | 'duckduckgo' | 'definition';
}

interface Props { query: string }

export function SummaryCard({ query }: Props) {
  const { lang, t } = useLanguage();
  const [data, setData]   = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang  = lang === 'hi' ? 'hi-IN' : lang === 'ar' ? 'ar-SA' : lang === 'zh' ? 'zh-CN' : lang === 'ja' ? 'ja-JP' : lang === 'ko' ? 'ko-KR' : lang === 'de' ? 'de-DE' : lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US';
    utt.rate  = 0.95;
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utt);
  };

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setData(null);
    setExpanded(false);

    // Fetch Wikipedia summary (instant answer)
    const wikiBase = `https://${lang}.wikipedia.org`;
    const endpoint = `${wikiBase}/api/rest_v1/page/summary/${encodeURIComponent(query.replace(/ /g, '_'))}`;

    fetch(endpoint)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: {
        title?: string; extract?: string;
        thumbnail?: { source?: string };
        content_urls?: { desktop?: { page?: string } };
        type?: string;
      } | null) => {
        if (d?.extract && d.type !== 'disambiguation') {
          setData({
            title:   d.title ?? query,
            extract: d.extract,
            image:   d.thumbnail?.source,
            url:     d.content_urls?.desktop?.page ?? '',
            type:    'wikipedia',
          });
        } else {
          // Fallback: DuckDuckGo instant answer
          return fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`)
            .then((r) => r.json())
            .then((dd: {
              AbstractText?: string; AbstractTitle?: string;
              AbstractURL?: string; Image?: string;
            }) => {
              if (dd.AbstractText) {
                setData({
                  title:   dd.AbstractTitle ?? query,
                  extract: dd.AbstractText,
                  image:   dd.Image || undefined,
                  url:     dd.AbstractURL ?? '',
                  type:    'duckduckgo',
                });
              }
            });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [query, lang]);

  if (loading) {
    return (
      <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 mb-4 animate-pulse">
        <div className="flex gap-3">
          <div className="w-1 rounded-full bg-accent/30 self-stretch" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-surface-3 rounded w-1/3" />
            <div className="h-3 bg-surface-3 rounded w-full" />
            <div className="h-3 bg-surface-3 rounded w-5/6" />
            <div className="h-3 bg-surface-3 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const SHORT = 300;
  const isLong = data.extract.length > SHORT;
  const displayText = expanded || !isLong ? data.extract : truncate(data.extract, SHORT);

  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-surface-2/70 backdrop-blur-md
      overflow-hidden mb-6 animate-slide-up shadow-md shadow-indigo-500/5">
      {/* Header strip */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border/60 bg-surface-3/30">
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 text-sm">✦</span>
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
            Featured Answer
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-text-muted">
            {data.type === 'wikipedia' ? '📖 Wikipedia' : '🦆 DuckDuckGo'}
          </span>
          {/* 🔊 Text-to-Speech */}
          <button
            onClick={() => speak(data.extract)}
            title={speaking ? 'Stop reading' : 'Read aloud'}
            className={`w-6 h-6 rounded-md flex items-center justify-center text-xs transition-all
              ${speaking ? 'text-accent animate-pulse' : 'text-text-muted hover:text-accent'}`}
          >
            {speaking ? '⏹' : '🔊'}
          </button>
          <CopyButton text={data.extract} />
        </div>
      </div>

      <div className="px-4 py-4 flex gap-4">
        {/* Colored left border */}
        <div className="w-1 rounded-full bg-gradient-to-b from-accent to-accent/20 self-stretch shrink-0" />

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h2 className="text-base font-bold text-text-primary mb-2">{data.title}</h2>

          {/* Extract text */}
          <p className="text-sm text-text-secondary leading-relaxed">
            {displayText}
          </p>

          {/* Read more toggle */}
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-xs text-accent hover:underline"
            >
              {expanded ? '▲ Show less' : '▼ Read more'}
            </button>
          )}

          {/* Source link */}
          {data.url && (
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-xs text-text-muted
                hover:text-accent transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {t('read_more')}
            </a>
          )}
        </div>

        {/* Thumbnail */}
        {data.image && (
          <div className="shrink-0 hidden sm:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.image}
              alt={data.title}
              className="w-24 h-24 object-cover rounded-lg border border-border"
            />
          </div>
        )}
      </div>
    </div>
  );
}
