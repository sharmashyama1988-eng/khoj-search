'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { truncate } from '@/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';
import { TTSButton } from '@/components/ui/TTSButton';

interface SummaryData {
  title: string;
  extract: string;
  keyPoints?: string[];
  image?: string;
  url: string;
  type: 'wikipedia' | 'duckduckgo' | 'ai_synthesis';
}

interface Props { query: string }

function extractTopic(rawQuery: string): string {
  return rawQuery
    .replace(/^(define|definition of|meaning of|what is|what does|search|explain|tell me about|who is|how to)\s+/i, '')
    .replace(/\s+(meaning|definition|ka matlab|matlab|wiki|wikipedia)$/i, '')
    .replace(/\bsite:[^\s]+/gi, '')
    .replace(/\bfiletype:[^\s]+/gi, '')
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\.(com|org|net|io|co|in|edu|gov|dev|ai|app)/gi, '')
    .trim() || rawQuery;
}

export function SummaryCard({ query }: Props) {
  const { lang } = useLanguage();
  const [data, setData]       = useState<SummaryData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setData(null);
    setExpanded(false);

    const topic = extractTopic(query);
    const wikiBase = `https://${lang}.wikipedia.org`;

    // 1. Direct Wikipedia page summary
    const summaryUrl = `${wikiBase}/api/rest_v1/page/summary/${encodeURIComponent(topic.replace(/ /g, '_'))}`;

    fetch(summaryUrl)
      .then((r) => (r.ok ? r.json() : null))
      .then(async (wikiData) => {
        if (wikiData && wikiData.type !== 'disambiguation' && wikiData.extract && wikiData.extract.length > 60) {
          const sentences = wikiData.extract.split(/(?<=[.!?])\s+/).filter(Boolean);
          const keyPoints = sentences.length > 2 ? sentences.slice(0, 3) : undefined;

          setData({
            title: wikiData.title,
            extract: wikiData.extract,
            keyPoints,
            image: wikiData.thumbnail?.source,
            url: wikiData.content_urls?.desktop?.page ?? '#',
            type: 'wikipedia',
          });
          setLoading(false);
          return;
        }

        // 2. Fallback to DuckDuckGo Instant Answer API
        try {
          const ddgRes = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
          if (ddgRes.ok) {
            const ddgData = await ddgRes.json() as {
              AbstractText?: string;
              Heading?: string;
              AbstractURL?: string;
              Image?: string;
              RelatedTopics?: Array<{ Text?: string; FirstURL?: string }>;
            };

            if (ddgData.AbstractText) {
              const sentences = ddgData.AbstractText.split(/(?<=[.!?])\s+/).filter(Boolean);
              setData({
                title: ddgData.Heading || topic,
                extract: ddgData.AbstractText,
                keyPoints: sentences.length > 2 ? sentences.slice(0, 3) : undefined,
                image: ddgData.Image ? `https://duckduckgo.com${ddgData.Image}` : undefined,
                url: ddgData.AbstractURL || '#',
                type: 'duckduckgo',
              });
              setLoading(false);
              return;
            }
          }
        } catch {}

        // 3. Fallback to Wikipedia Opensearch
        const searchUrl = `${wikiBase}/w/api.php?action=opensearch&search=${encodeURIComponent(topic)}&limit=1&namespace=0&format=json&origin=*`;
        const res = await fetch(searchUrl);
        const json = await res.json() as [string, string[], string[], string[]];
        const [,, descriptions, urls] = json;

        if (descriptions?.[0] && descriptions[0].length > 30) {
          setData({
            title: json[1][0] ?? topic,
            extract: descriptions[0],
            url: urls?.[0] ?? '#',
            type: 'wikipedia',
          });
        } else {
          setData(null);
        }
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [query, lang]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-indigo-500/20 bg-surface-2 p-5 mb-5 animate-pulse">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 bg-indigo-500/30 rounded-full" />
          <div className="h-4 w-28 bg-surface-3 rounded-full" />
        </div>
        <div className="h-4 w-44 bg-surface-3 rounded-full mb-3" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-surface-3 rounded-full" />
          <div className="h-3 w-5/6 bg-surface-3 rounded-full" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const SHORT = 260;
  const isLong = data.extract.length > SHORT;
  const displayText = expanded || !isLong ? data.extract : truncate(data.extract, SHORT);

  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-surface-2/90 backdrop-blur-xl
      overflow-hidden mb-5 animate-slide-up shadow-lg shadow-black/5">
      {/* Header strip */}
      <div className="flex items-center gap-3 px-4 sm:px-5 py-2.5 border-b border-border/60 bg-surface-3/30">
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 text-sm animate-pulse">✦</span>
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
            AI Overview & Answer
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[11px] text-text-muted font-medium bg-surface-3 px-2 py-0.5 rounded-full border border-border/50 hidden sm:inline-block">
            {data.type === 'wikipedia' ? '📖 Knowledge Graph' : '🦆 Instant Intelligence'}
          </span>
          <TTSButton text={data.extract} lang={lang} size="sm" />
          <CopyButton text={data.extract} />
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start">
        {/* Compressed preview thumbnail */}
        {data.image && (
          <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-surface-3 border border-border/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.image}
              alt={data.title}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary text-[17px] mb-1.5 flex items-center gap-2">
            {data.title}
          </h3>

          <p className="text-text-secondary text-sm leading-relaxed">
            {displayText}
          </p>

          {/* Quick Key Takeaways */}
          {data.keyPoints && data.keyPoints.length > 1 && (
            <div className="mt-3 space-y-1 bg-surface-3/40 p-2.5 rounded-lg border border-border/40">
              <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
                Key Insights:
              </span>
              {data.keyPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-text-muted">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          )}

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
            <div className="mt-2.5">
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-text-muted hover:text-indigo-400 hover:underline font-medium inline-flex items-center gap-1"
              >
                Learn more on source →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
