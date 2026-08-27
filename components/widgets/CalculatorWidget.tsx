'use client';
import { useState, useCallback } from 'react';
import { safeMath } from '@/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';
import { useLanguage } from '@/hooks/useLanguage';

const BUTTONS = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '⌫', '='],
];

export function CalculatorWidget({ initialExpr = '' }: { initialExpr?: string }) {
  const { t } = useLanguage();
  const [display, setDisplay]   = useState(initialExpr || '0');
  const [memory, setMemory]     = useState('');
  const [justEvaled, setJustEvaled] = useState(false);

  const press = useCallback((val: string) => {
    setDisplay((prev) => {
      if (val === 'C') { setJustEvaled(false); return '0'; }
      if (val === '⌫') return prev.length > 1 ? prev.slice(0, -1) : '0';
      if (val === '=') {
        const expr = prev.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
        const res  = safeMath(expr);
        if (res === null) return 'Error';
        const result = String(parseFloat(res.toPrecision(10)));
        setMemory(prev + ' = ' + result);
        setJustEvaled(true);
        return result;
      }
      if (val === '±') {
        return prev.startsWith('-') ? prev.slice(1) : '-' + prev;
      }
      if (val === '%') {
        const num = parseFloat(prev);
        return isNaN(num) ? prev : String(num / 100);
      }
      if (justEvaled && /[\d.]/.test(val)) {
        setJustEvaled(false);
        return val === '.' ? '0.' : val;
      }
      setJustEvaled(false);
      if (prev === '0' && /^\d$/.test(val)) return val;
      return prev + val;
    });
  }, [justEvaled]);

  return (
    <div className="rounded-xl border border-border bg-surface-2/80 overflow-hidden w-full max-w-sm animate-fade-in">
      {/* Header */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <h2 className="font-semibold text-text-primary text-sm">{t('chip_calculator')}</h2>
        <CopyButton text={display} />
      </div>

      {/* Memory */}
      {memory && (
        <div className="px-5 pb-1 text-xs text-text-muted font-mono text-right truncate">{memory}</div>
      )}

      {/* Display */}
      <div className="px-5 pb-4 pt-1">
        <div className="text-right font-mono text-3xl font-light text-text-primary
          bg-surface-3 rounded-xl px-4 py-3 border border-border min-h-[3.5rem]
          overflow-x-auto whitespace-nowrap">
          {display}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-0.5 bg-border p-0.5">
        {BUTTONS.flat().map((btn) => {
          const isOp  = ['÷', '×', '−', '+'].includes(btn);
          const isEq  = btn === '=';
          const isCls = btn === 'C';
          return (
            <button
              key={btn}
              onClick={() => press(btn)}
              className={`py-4 text-sm font-medium transition-all duration-100 active:scale-95
                ${isEq  ? 'bg-accent text-white hover:bg-accent-hover' :
                  isOp  ? 'bg-surface-3 text-accent hover:bg-surface-2' :
                  isCls ? 'bg-surface-3 text-red-400 hover:bg-surface-2' :
                  'bg-surface text-text-primary hover:bg-surface-2'}`}
            >
              {btn}
            </button>
          );
        })}
      </div>
    </div>
  );
}
