'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { formatNumber } from '@/lib/utils';

interface StockData {
  symbol: string; name: string; price: number; prevClose: number;
  changePercent: number; currency: string; exchange: string;
  marketState: string;
  history: { date: string; close: number }[];
}

interface Props { symbol: string }

// Mini sparkline SVG
function Sparkline({ data, isUp }: { data: number[]; isUp: boolean }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 120, h = 40;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={isUp ? '#22c55e' : '#ef4444'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StockWidget({ symbol }: Props) {
  const { t } = useLanguage();
  const [data, setData]   = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState(symbol);
  const [search, setSearch] = useState(symbol);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/stock?symbol=${encodeURIComponent(search)}`)
      .then((r) => r.json())
      .then((d: StockData & { error?: string }) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError('Failed to fetch stock data'))
      .finally(() => setLoading(false));
  }, [search]);

  const isUp = (data?.changePercent ?? 0) >= 0;

  return (
    <div className="rounded-xl border border-border bg-surface-2/80 overflow-hidden w-full animate-fade-in">
      {/* Search bar */}
      <div className="px-4 py-3 border-b border-border flex gap-2 items-center">
        <span className="text-lg">📈</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && setSearch(input)}
          placeholder="Ticker symbol (AAPL, RELIANCE.NS…)"
          className="flex-1 bg-transparent text-sm font-mono text-text-primary placeholder-text-muted outline-none"
        />
        <button onClick={() => setSearch(input)}
          className="px-3 py-1 text-xs rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors">
          Search
        </button>
      </div>

      {loading && <div className="p-6 text-text-muted text-sm animate-pulse">Fetching stock data…</div>}
      {error && !loading && (
        <div className="p-5 text-sm space-y-1">
          <p className="text-red-400">{error}</p>
          <p className="text-text-muted text-xs">Try: AAPL, GOOGL, MSFT, RELIANCE.NS, TCS.NS, INFY.NS</p>
        </div>
      )}

      {data && !loading && (
        <>
          {/* Main price */}
          <div className="px-5 py-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold text-text-primary text-base">{data.symbol}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                  ${data.marketState === 'REGULAR' ? 'bg-green-500/15 text-green-400' : 'bg-surface-3 text-text-muted'}`}>
                  {data.marketState === 'REGULAR' ? '● Live' : data.marketState}
                </span>
              </div>
              <p className="text-xs text-text-muted mb-2 line-clamp-1">{data.name}</p>
              <p className="text-3xl font-bold text-text-primary">
                {data.price.toFixed(2)}
                <span className="text-base font-normal text-text-muted ml-1">{data.currency}</span>
              </p>
              <p className={`text-sm font-semibold mt-1 ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                {isUp ? '▲' : '▼'} {Math.abs(data.changePercent).toFixed(2)}%
              </p>
            </div>

            {/* Sparkline */}
            <div className="shrink-0 mt-2">
              <Sparkline data={data.history.map((h) => h.close)} isUp={isUp} />
              <p className="text-xs text-text-muted text-center mt-1">5 day</p>
            </div>
          </div>

          {/* Exchange info */}
          <div className="px-5 pb-4 grid grid-cols-2 gap-3 text-xs">
            <div className="bg-surface-3 rounded-lg px-3 py-2">
              <p className="text-text-muted">Prev Close</p>
              <p className="font-semibold text-text-primary">{data.prevClose.toFixed(2)} {data.currency}</p>
            </div>
            <div className="bg-surface-3 rounded-lg px-3 py-2">
              <p className="text-text-muted">Exchange</p>
              <p className="font-semibold text-text-primary">{data.exchange || '—'}</p>
            </div>
          </div>

          <div className="px-5 pb-3 text-xs text-text-muted text-center">
            Data via Yahoo Finance · 1 min delay · Not financial advice
          </div>
        </>
      )}
    </div>
  );
}
