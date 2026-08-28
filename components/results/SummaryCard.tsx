'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { truncate } from '@/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';

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

    // 1. Direct Wikipedia page summary
    const summaryUrl = `${wikiBase}/api/rest_v1/page/summary/${encodeURIComponent(topic.replace(/ /g, '_'))}`;

    fetch(summaryUrl)
      .then((r) => (r.ok ? r.json() : null))
      .then(async (d: {
        title?: string; extract?: string;
        thumbnail?: { source?: string };
        content_urls?: { desktop?: { page?: string } };
        type?: string;
      } | null) => {
        if (d?.extract && d.type !== 'disambiguation' && d.extract.length > 25) {
          const sentences = d.extract.split('. ').filter((s) => s.trim().length > 15);
          setData({
            title:   d.title ?? topic,
            extract: d.extract,
            keyPoints: sentences.length > 1 ? sentences.slice(0, 3).map((s) => s.endsWith('.') ? s : `${s}.`) : undefined,
            image:   d.thumbnail?.source,
            url:     d.content_urls?.desktop?.page ?? `${wikiBase}/wiki/${encodeURIComponent(topic)}`,
            type:    'wikipedia',
          });
          setLoading(false);
          return;
        }

        // 2. DuckDuckGo Instant Answer API
        const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(topic)}&format=json&no_redirect=1&no_html=1`;
        const dRes = await fetch(ddgUrl);
        if (dRes.ok) {
          const ddg = await dRes.json() as { AbstractText?: string; Heading?: string; AbstractURL?: string; Image?: string };
          if (ddg.AbstractText && ddg.AbstractText.length > 20) {
            const sentences = ddg.AbstractText.split('. ').filter((s) => s.trim().length > 15);
            setData({
              title:   ddg.Heading || topic,
              extract: ddg.AbstractText,
              keyPoints: sentences.length > 1 ? sentences.slice(0, 3).map((s) => s.endsWith('.') ? s : `${s}.`) : undefined,
              image:   ddg.Image ? (ddg.Image.startsWith('http') ? ddg.Image : `https://duckduckgo.com${ddg.Image}`) : undefined,
              url:     ddg.AbstractURL || '#',
              type:    'duckduckgo',
            });
            setLoading(false);
            return;
          }
        }

        // 3. Fallback to Wikipedia Opensearch / Search list snippet
        const searchUrl = `${wikiBase}/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&srlimit=1&format=json&origin=*`;
        const sRes = await fetch(searchUrl);
        if (sRes.ok) {
          const sData = await sRes.json() as { query?: { search?: Array<{ title: string; snippet: string; pageid: number }> } };
          const first = sData.query?.search?.[0];
          if (first?.snippet) {
            const cleanText = first.snippet.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
            if (cleanText.length > 25) {
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
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [query, lang]);

  if (loading || !data) return null;

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
          <span className="text-[11px] text-text-muted font-medium bg-surface-3 px-2 py-0.5 rounded-full border border-border/50">
            {data.type === 'wikipedia' ? '📖 Knowledge Graph' : '🦆 Instant Intelligence'}
          </span>
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
