'use client';
import { useEffect, useState } from 'react';

interface PriceData {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  mainPrice: string;
  secondaryPrice?: string;
  change: string;
  isPositive: boolean;
  variants?: Array<{ label: string; price: string; note?: string }>;
  specs?: Array<{ label: string; value: string }>;
  source: string;
  officialUrl?: string;
}

interface Props {
  query: string;
}

export function PriceWidget({ query }: Props) {
  const [data, setData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    fetch(`/api/price?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setData(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [query]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-indigo-500/20 bg-surface-2 p-5 animate-pulse flex flex-col gap-3">
        <div className="h-4 w-32 bg-surface-3 rounded-full" />
        <div className="h-8 w-48 bg-surface-3 rounded-lg" />
        <div className="h-20 w-full bg-surface-3 rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="rounded-2xl border border-amber-500/25 bg-surface-2/95 backdrop-blur-xl shadow-xl overflow-hidden animate-slide-up mb-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/60 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Real-Time Live Price (RTDT)
          </span>
        </div>
        <span className="text-[11px] text-text-muted font-mono">
          Updated Today
        </span>
      </div>

      {/* Main Info */}
      <div className="p-5 sm:p-6 space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-1">
            {data.title}
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            {data.subtitle}
          </p>
        </div>

        {/* Big Price Card */}
        <div className="flex flex-wrap items-baseline gap-3 p-4 rounded-xl bg-surface-3/60 border border-border/60">
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
            {data.mainPrice}
          </span>
          {data.secondaryPrice && (
            <span className="text-xs sm:text-sm text-text-muted font-medium">
              ({data.secondaryPrice})
            </span>
          )}
          <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-semibold border ${
            data.isPositive
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            {data.change}
          </span>
        </div>

        {/* Variants Breakdown */}
        {data.variants && data.variants.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Price Breakdown by Variant / Purity:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.variants.map((v, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface-3/40 border border-border/40 text-xs"
                >
                  <div>
                    <span className="font-medium text-text-primary block">{v.label}</span>
                    {v.note && <span className="text-[10px] text-text-muted">{v.note}</span>}
                  </div>
                  <span className="font-mono font-bold text-indigo-400 shrink-0 ml-2">
                    {v.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Specs / Highlights */}
        {data.specs && data.specs.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/40">
            {data.specs.map((s, i) => (
              <div key={i} className="p-2 rounded-lg bg-surface-3/30 border border-border/30">
                <span className="text-[10px] text-text-muted block">{s.label}</span>
                <span className="text-xs font-semibold text-text-primary truncate block">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Source & External Link Footer */}
        <div className="flex items-center justify-between pt-2 text-[11px] text-text-muted">
          <span>Source: <strong className="text-text-secondary">{data.source}</strong></span>
          {data.officialUrl && (
            <a
              href={data.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline font-medium inline-flex items-center gap-1"
            >
              Official Website →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
