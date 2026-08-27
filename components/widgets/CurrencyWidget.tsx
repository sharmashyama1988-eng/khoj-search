'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import type { CurrencyData } from '@/types';

const COMMON_CURRENCIES = ['USD','EUR','INR','GBP','JPY','CNY','AED','CAD','AUD','CHF','SGD','KRW','BRL','MXN','RUB','SAR','TRY','PKR','BDT','NGN'];

interface Props { initialPayload?: string }

export function CurrencyWidget({ initialPayload }: Props) {
  const { t } = useLanguage();
  const [from, setFrom]     = useState(() => {
    if (!initialPayload) return 'USD';
    const parts = initialPayload.split(':');
    return parts[1] ?? 'USD';
  });
  const [to, setTo]         = useState(() => {
    if (!initialPayload) return 'INR';
    const parts = initialPayload.split(':');
    return parts[2] ?? 'INR';
  });
  const [amount, setAmount] = useState(() => {
    if (!initialPayload) return 1;
    return parseFloat(initialPayload.split(':')[0]) || 1;
  });
  const [data, setData]     = useState<CurrencyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const fetchRate = () => {
    if (!from || !to) return;
    setLoading(true);
    setError(null);
    fetch(`/api/currency?from=${from}&to=${to}&amount=${amount}`)
      .then((r) => r.json())
      .then((d: CurrencyData & { error?: string }) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError('Failed to fetch rate'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRate(); }, [from, to, amount]);

  const swap = () => { setFrom(to); setTo(from); };

  return (
    <div className="rounded-xl border border-border bg-surface-2/80 overflow-hidden w-full animate-fade-in">
      <div className="px-5 pt-4 pb-2">
        <h2 className="text-sm font-semibold text-text-primary mb-4">{t('chip_currency')}</h2>

        <div className="space-y-3">
          {/* Amount + From */}
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 1)}
              className="w-24 px-3 py-2.5 rounded-lg bg-surface border border-border text-text-primary
                text-sm focus:outline-none focus:border-accent"
            />
            <select value={from} onChange={(e) => setFrom(e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-lg bg-surface border border-border text-text-primary
                text-sm focus:outline-none focus:border-accent">
              {COMMON_CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Swap button */}
          <div className="flex justify-center">
            <button onClick={swap}
              className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 text-accent
                hover:bg-accent hover:text-white transition-all duration-150 text-sm">
              ⇅
            </button>
          </div>

          {/* To */}
          <select value={to} onChange={(e) => setTo(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-text-primary
              text-sm focus:outline-none focus:border-accent">
            {COMMON_CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Result */}
      <div className="px-5 py-4 bg-accent/5 border-t border-border mt-3">
        {loading && <p className="text-text-muted text-sm animate-pulse">{t('loading')}</p>}
        {error   && <p className="text-red-400 text-sm">{error}</p>}
        {data && !loading && (
          <>
            <p className="text-3xl font-bold text-text-primary">
              {data.result.toLocaleString()} <span className="text-lg font-normal text-text-secondary">{to}</span>
            </p>
            <p className="text-xs text-text-muted mt-1">
              1 {from} = {data.rate} {to} · {data.date}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
