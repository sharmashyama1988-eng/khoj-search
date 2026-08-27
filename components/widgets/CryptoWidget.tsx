'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { formatNumber } from '@/lib/utils';
import type { CryptoData } from '@/types';

interface Props { coinId: string }

export function CryptoWidget({ coinId }: Props) {
  const { t } = useLanguage();
  const [data, setData]   = useState<CryptoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/crypto?coin=${encodeURIComponent(coinId)}`)
      .then((r) => r.json())
      .then((d: CryptoData & { error?: string }) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError('Failed to fetch'))
      .finally(() => setLoading(false));
  }, [coinId]);

  if (loading) return <div className="p-6 rounded-xl border border-border text-text-muted text-sm animate-pulse">{t('loading')}</div>;
  if (error || !data) return <div className="p-6 rounded-xl border border-border text-red-400 text-sm">{error}</div>;

  const isUp = data.change24h >= 0;

  return (
    <div className="rounded-xl border border-border bg-surface-2/80 overflow-hidden w-full animate-fade-in">
      <div className="px-5 py-4 flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={data.image} alt={data.name} className="w-12 h-12 rounded-full" />
        <div>
          <h2 className="font-bold text-text-primary">{data.name}</h2>
          <p className="text-xs text-text-muted">{data.symbol}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-2xl font-bold text-text-primary">\${data.price.toLocaleString()}</p>
          <p className={`text-sm font-semibold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
            {isUp ? '▲' : '▼'} {Math.abs(data.change24h).toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px bg-border">
        {[
          { label: t('market_cap'), value: '\$' + formatNumber(data.marketCap) },
          { label: t('volume'),     value: '\$' + formatNumber(data.volume24h) },
        ].map((item) => (
          <div key={item.label} className="px-5 py-3 bg-surface">
            <p className="text-xs text-text-muted">{item.label}</p>
            <p className="text-sm font-semibold text-text-primary mt-0.5">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 text-xs text-text-muted text-center">
        Powered by CoinGecko · Live price
      </div>
    </div>
  );
}
