'use client';
import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

export function CoinFlipWidget() {
  const { t } = useLanguage();
  const [result, setResult]   = useState<'heads' | 'tails' | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [count, setCount]     = useState({ heads: 0, tails: 0 });

  const flip = () => {
    if (flipping) return;
    setFlipping(true);
    setResult(null);
    setTimeout(() => {
      const r = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(r);
      setCount((c) => ({ ...c, [r]: c[r] + 1 }));
      setFlipping(false);
    }, 600);
  };

  return (
    <div className="rounded-xl border border-border bg-surface-2/80 p-5 w-full max-w-xs animate-fade-in">
      <h2 className="text-sm font-semibold text-text-primary mb-4 text-center">🪙 {t('chip_currency').split(' ')[0]} Flip</h2>

      {/* Coin */}
      <div className="flex justify-center mb-5" style={{ perspective: '600px' }}>
        <div
          className={`w-28 h-28 rounded-full border-4 flex items-center justify-center
            text-5xl select-none cursor-pointer transition-all duration-600 shadow-lg
            ${flipping ? 'animate-spin3d' : 'hover:scale-105 active:scale-95'}
            ${result === 'heads' ? 'bg-yellow-400/20 border-yellow-400' :
              result === 'tails' ? 'bg-slate-400/20 border-slate-400' :
              'bg-surface-3 border-border'}`}
          onClick={flip}
        >
          {flipping ? '🌀' : result === 'heads' ? '👑' : result === 'tails' ? '🦅' : '🪙'}
        </div>
      </div>

      {/* Result */}
      {result && !flipping && (
        <p className="text-center text-xl font-bold text-text-primary mb-2 animate-bounce">
          {result === 'heads' ? `${t('heads')}!` : `${t('tails')}!`}
        </p>
      )}

      {/* Stats */}
      <div className="flex justify-center gap-6 mb-4 text-sm text-text-muted">
        <span>👑 {t('heads')}: <strong className="text-text-primary">{count.heads}</strong></span>
        <span>🦅 {t('tails')}: <strong className="text-text-primary">{count.tails}</strong></span>
      </div>

      <button
        onClick={flip}
        disabled={flipping}
        className="w-full py-2.5 rounded-lg bg-accent text-white text-sm font-medium
          hover:bg-accent-hover transition-all active:scale-95 disabled:opacity-50"
      >
        {flipping ? '🌀 Flipping…' : t('flip')}
      </button>
    </div>
  );
}

export function DiceWidget() {
  const { t } = useLanguage();
  const [value, setValue]   = useState<number | null>(null);
  const [sides, setSides]   = useState(6);
  const [rolling, setRolling] = useState(false);

  const faces = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  const roll = () => {
    if (rolling) return;
    setRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      setValue(Math.floor(Math.random() * sides) + 1);
      count++;
      if (count >= 10) {
        clearInterval(interval);
        setRolling(false);
      }
    }, 60);
  };

  return (
    <div className="rounded-xl border border-border bg-surface-2/80 p-5 w-full max-w-xs animate-fade-in">
      <h2 className="text-sm font-semibold text-text-primary mb-4 text-center">🎲 Roll Dice</h2>

      {/* Sides selector */}
      <div className="flex justify-center gap-2 mb-4">
        {[4, 6, 8, 10, 12, 20].map((s) => (
          <button
            key={s}
            onClick={() => { setSides(s); setValue(null); }}
            className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all
              ${sides === s ? 'bg-accent text-white' : 'bg-surface-3 text-text-muted hover:text-text-primary'}`}
          >
            d{s}
          </button>
        ))}
      </div>

      {/* Dice face */}
      <div className="flex justify-center mb-4">
        <div
          className={`w-24 h-24 rounded-2xl border-4 border-border bg-surface flex items-center justify-center
            text-5xl shadow-lg cursor-pointer select-none
            ${rolling ? 'animate-bounce3d' : 'hover:scale-105 active:scale-95'} transition-all duration-150`}
          onClick={roll}
        >
          {value !== null
            ? (sides === 6 && value <= 6 ? faces[value] : <span className="text-3xl font-bold text-text-primary">{value}</span>)
            : '🎲'}
        </div>
      </div>

      {value !== null && !rolling && (
        <p className="text-center text-lg font-bold text-text-primary mb-3">{value}</p>
      )}

      <button
        onClick={roll}
        disabled={rolling}
        className="w-full py-2.5 rounded-lg bg-accent text-white text-sm font-medium
          hover:bg-accent-hover transition-all active:scale-95 disabled:opacity-50"
      >
        {rolling ? 'Rolling…' : `${t('roll')} d${sides}`}
      </button>
    </div>
  );
}
