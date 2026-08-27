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
  type: 'wikipedia' | 'duckduckgo' | 'summary';
}

interface Props { query: string }

// Clean search prefixes to get the core topic for summary lookups
function extractTopic(rawQuery: string): string {
  return rawQuery
    .replace(/^(define|definition of|meaning of|what is|what does|search|explain|tell me about)\s+/i, '')
    .replace(/\s+(meaning|definition|ka matlab|matlab)$/i, '')
    .replace(/\bsite:[^\s]+/gi, '')
    .replace(/\bfiletype:[^\s]+/gi, '')
    .trim() || rawQuery;
}

export function SummaryCard({ query }: Props) {
  const { lang } = useLanguage();
  const [data, setData]       = useState<SummaryData | null>(null);
  const [loading, setLoading]   = useState(true);
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

    const topic = extractTopic(query);
    const wikiBase = `https://${lang}.wikipedia.org`;

    // Strategy 1: Direct Wikipedia page summary (fastest, richest)
    const summaryUrl = `${wikiBase}/api/rest_v1/page/summary/${encodeURIComponent(topic.replace(/ /g, '_'))}`;

    fetch(summaryUrl)
      .then((r) => (r.ok ? r.json() : null))
      .then(async (d: {
        title?: string; extract?: string;
        thumbnail?: { source?: string };
        content_urls?: { desktop?: { page?: string } };
        type?: string;
      } | null) => {
        if (d?.extract && d.type !== 'disambiguation' && d.extract.length > 30) {
          setData({
            title:   d.title ?? topic,
            extract: d.extract,
            image:   d.thumbnail?.source,
            url:     d.content_urls?.desktop?.page ?? `${wikiBase}/wiki/${encodeURIComponent(topic)}`,
            type:    'wikipedia',
          });
          setLoading(false);
          return;
        }

        // Strategy 2: Fallback to Wikipedia Opensearch / Search list snippet
        const searchUrl = `${wikiBase}/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&srlimit=1&format=json&origin=*`;
        const sRes = await fetch(searchUrl);
        if (sRes.ok) {
          const sData = await sRes.json() as { query?: { search?: Array<{ title: string; snippet: string; pageid: number }> } };
          const first = sData.query?.search?.[0];
          if (first?.snippet) {
            const cleanText = first.snippet.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
            if (cleanText.length > 30) {
              setData({
                title:   first.title,
                extract: cleanText,
                url:     `${wikiBase}/wiki/${encodeURIComponent(first.title.replace(/ /g, '_'))}`,
                type:    'wikipedia',
              });
              setLoading(false);
              return;
            }
          }
        }

        // Strategy 3: Fallback to DuckDuckGo Instant Answer API
        const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(topic)}&format=json&no_redirect=1&no_html=1`;
        const dRes = await fetch(ddgUrl);
        if (dRes.ok) {
          const ddg = await dRes.json() as { AbstractText?: string; Heading?: string; AbstractURL?: string; Image?: string };
          if (ddg.AbstractText && ddg.AbstractText.length > 20) {
            setData({
              title:   ddg.Heading || topic,
              extract: ddg.AbstractText,
              image:   ddg.Image ? (ddg.Image.startsWith('http') ? ddg.Image : `https://duckduckgo.com${ddg.Image}`) : undefined,
              url:     ddg.AbstractURL || '#',
              type:    'duckduckgo',
            });
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [query, lang]);

  if (loading || !data) return null;

  const SHORT = 280;
  const isLong = data.extract.length > SHORT;
  const displayText = expanded || !isLong ? data.extract : truncate(data.extract, SHORT);

  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-surface-2/80 backdrop-blur-xl
      overflow-hidden mb-6 animate-slide-up shadow-lg shadow-black/5">
      {/* Header strip */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border/60 bg-surface-3/30">
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 text-sm">✦</span>
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
            Featured Answer
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-text-muted font-medium">
            {data.type === 'wikipedia' ? '📖 Wikipedia' : '🦆 DuckDuckGo'}
          </span>
          {/* 🔊 Text-to-Speech */}
          <button
            type="button"
            onClick={() => speak(data.extract)}
            title={speaking ? 'Stop reading' : 'Read aloud'}
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all cursor-pointer
              ${speaking ? 'text-indigo-400 bg-indigo-500/20 animate-pulse' : 'text-text-muted hover:text-text-primary hover:bg-surface-3'}`}
          >
            {speaking ? '⏹' : '🔊'}
          </button>
          <CopyButton text={data.extract} />
        </div>
      </div>

      <div className="p-5 flex gap-4 items-start">
        {/* Thumbnail Image */}
        {data.image && (
          <div className="shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-surface-3 border border-border/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.image} alt={data.title} className="w-full h-full object-cover" loading="lazy" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary text-base mb-2">
            {data.title}
          </h3>

          <p className="text-text-secondary text-sm leading-relaxed">
            {displayText}
          </p>

          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-xs font-medium text-indigo-400 hover:underline inline-block cursor-pointer"
            >
              {expanded ? 'Show less ▲' : 'Read full answer ▼'}
            </button>
          )}

          {data.url && data.url !== '#' && (
            <div className="mt-3">
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-text-muted hover:text-indigo-400 hover:underline font-medium inline-flex items-center gap-1"
              >
                Learn more on {data.type === 'wikipedia' ? 'Wikipedia' : 'Source'} →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
