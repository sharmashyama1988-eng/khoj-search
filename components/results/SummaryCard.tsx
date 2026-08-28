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
  model?: string;
}

interface Props { query: string }

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

    // 1. Primary AI Intelligence Endpoint (Powered by OpenRouter AI)
    fetch(`/api/summary?q=${encodeURIComponent(query)}&lang=${lang}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(async (summaryRes) => {
        if (summaryRes && summaryRes.extract && summaryRes.extract.length > 30) {
          setData({
            title: summaryRes.title || query,
            extract: summaryRes.extract,
            keyPoints: summaryRes.keyPoints,
            image: summaryRes.image,
            url: summaryRes.url || '#',
            type: summaryRes.type || 'ai_synthesis',
            model: summaryRes.model || 'OpenRouter AI',
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
            };

            if (ddgData.AbstractText) {
              const sentences = ddgData.AbstractText.split(/(?<=[.!?])\s+/).filter(Boolean);
              setData({
                title: ddgData.Heading || query,
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

        setData(null);
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

  const SHORT = 280;
  const isLong = data.extract.length > SHORT;
  const displayText = expanded || !isLong ? data.extract : truncate(data.extract, SHORT);

  return (
    <div className="rounded-2xl border border-indigo-500/25 bg-surface-2/95 backdrop-blur-xl
      overflow-hidden mb-5 animate-slide-up shadow-xl shadow-black/5">
      {/* Header strip */}
      <div className="flex items-center gap-3 px-4 sm:px-5 py-2.5 border-b border-border/60 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent">
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 text-sm animate-pulse">✦</span>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            AI Overview & Answer
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[11px] text-indigo-300 font-medium bg-indigo-500/15 px-2.5 py-0.5 rounded-full border border-indigo-500/20 hidden sm:inline-block">
            {data.type === 'ai_synthesis' ? '⚡ OpenRouter Neural AI' : '📖 Knowledge Graph'}
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
          <h3 className="font-bold text-text-primary text-[17px] mb-1.5 flex items-center gap-2">
            {data.title}
          </h3>

          <div className="text-text-primary text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
            {displayText}
          </div>

          {/* Quick Key Takeaways */}
          {data.keyPoints && data.keyPoints.length > 0 && (
            <div className="mt-3 space-y-1.5 bg-surface-3/50 p-3 rounded-xl border border-border/50">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                Key Highlights:
              </span>
              {data.keyPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-text-secondary">
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
              className="mt-2 text-xs font-semibold text-indigo-400 hover:underline inline-block cursor-pointer"
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
