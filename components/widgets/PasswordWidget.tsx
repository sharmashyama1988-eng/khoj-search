'use client';
import { useState, useCallback } from 'react';
import { generatePassword } from '@/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';
import { useLanguage } from '@/hooks/useLanguage';

export function PasswordWidget() {
  const { t } = useLanguage();
  const [length,  setLength]  = useState(16);
  const [upper,   setUpper]   = useState(true);
  const [lower,   setLower]   = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [pass,    setPass]    = useState(() => generatePassword(16, { upper: true, lower: true, numbers: true, symbols: true }));
  const [strength, setStrength] = useState(4);

  const calc = useCallback((opts: { upper: boolean; lower: boolean; numbers: boolean; symbols: boolean; len: number }) => {
    const s = [opts.upper, opts.lower, opts.numbers, opts.symbols].filter(Boolean).length;
    setStrength(s);
    setPass(generatePassword(opts.len, opts));
  }, []);

  const toggle = (type: 'upper' | 'lower' | 'numbers' | 'symbols') => {
    const opts = { upper, lower, numbers, symbols, len: length, [type]: !{ upper, lower, numbers, symbols }[type] };
    if (type === 'upper')   setUpper(opts.upper);
    if (type === 'lower')   setLower(opts.lower);
    if (type === 'numbers') setNumbers(opts.numbers);
    if (type === 'symbols') setSymbols(opts.symbols);
    calc(opts);
  };

  const regen = () => calc({ upper, lower, numbers, symbols, len: length });

  const strengthColor = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400'][strength];
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];

  return (
    <div className="rounded-xl border border-border bg-surface-2/80 p-5 w-full animate-fade-in">
      <h2 className="text-sm font-semibold text-text-primary mb-4">🔐 {t('chip_password')}</h2>

      {/* Password display */}
      <div className="relative mb-4">
        <div className="font-mono text-sm bg-surface border border-border rounded-lg px-4 py-3
          text-text-primary break-all min-h-[3rem] flex items-center pr-24">
          {pass}
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <CopyButton text={pass} />
          <button onClick={regen} title="Regenerate"
            className="w-7 h-7 rounded-md bg-surface-3 border border-border text-text-muted
              hover:text-text-primary hover:border-accent transition-all text-sm flex items-center justify-center">
            ↻
          </button>
        </div>
      </div>

      {/* Strength */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-1 flex-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength
                ? ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400'][strength - 1]
                : 'bg-surface-3'}`} />
          ))}
        </div>
        <span className={`text-xs font-medium ${strengthColor}`}>{strengthLabel}</span>
      </div>

      {/* Length slider */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs text-text-muted w-16">{t('length')}: {length}</span>
        <input
          type="range" min="8" max="64" value={length}
          onChange={(e) => { const l = Number(e.target.value); setLength(l); calc({ upper, lower, numbers, symbols, len: l }); }}
          className="flex-1 accent-[var(--accent)]"
        />
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { key: 'upper',   label: t('uppercase'), val: upper,   fn: () => toggle('upper')   },
          { key: 'lower',   label: t('lowercase'), val: lower,   fn: () => toggle('lower')   },
          { key: 'numbers', label: t('numbers'),   val: numbers, fn: () => toggle('numbers') },
          { key: 'symbols', label: t('symbols'),   val: symbols, fn: () => toggle('symbols') },
        ].map((item) => (
          <button
            key={item.key}
            onClick={item.fn}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm
              border transition-all duration-150
              ${item.val
                ? 'bg-accent/10 border-accent/30 text-accent'
                : 'bg-surface border-border text-text-muted hover:border-accent/30'}`}
          >
            <span>{item.label}</span>
            <span className={`w-4 h-4 rounded border-2 flex items-center justify-center text-xs
              ${item.val ? 'bg-accent border-accent text-white' : 'border-border'}`}>
              {item.val ? '✓' : ''}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={regen}
        className="w-full mt-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium
          hover:bg-accent-hover transition-all active:scale-95"
      >
        {t('generate')}
      </button>
    </div>
  );
}
