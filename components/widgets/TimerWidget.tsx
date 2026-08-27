'use client';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface Props { initialSeconds?: number; mode?: 'timer' | 'stopwatch' }

function fmt(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h > 0 ? String(h).padStart(2, '0') : null, String(m).padStart(2, '0'), String(sec).padStart(2, '0')]
    .filter(Boolean).join(':');
}

export function TimerWidget({ initialSeconds = 60, mode = 'timer' }: Props) {
  const { t } = useLanguage();
  const [seconds, setSeconds]   = useState(mode === 'timer' ? initialSeconds : 0);
  const [target, setTarget]     = useState(initialSeconds);
  const [running, setRunning]   = useState(false);
  const [finished, setFinished] = useState(false);
  const [input, setInput]       = useState(String(Math.floor(initialSeconds / 60)));
  const intervalRef             = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) { clearInterval(intervalRef.current!); return; }
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (mode === 'timer') {
          if (s <= 1) { clearInterval(intervalRef.current!); setRunning(false); setFinished(true); return 0; }
          return s - 1;
        }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [running, mode]);

  const reset = () => {
    clearInterval(intervalRef.current!);
    setRunning(false);
    setFinished(false);
    setSeconds(mode === 'timer' ? target : 0);
  };

  const applyInput = () => {
    const mins = parseInt(input) || 0;
    const secs = mins * 60;
    setTarget(secs);
    setSeconds(secs);
    setFinished(false);
    setRunning(false);
  };

  const progress = mode === 'timer' ? (seconds / (target || 1)) * 100 : 0;
  const circumference = 2 * Math.PI * 54;

  return (
    <div className="rounded-xl border border-border bg-surface-2/80 p-5 w-full animate-fade-in">
      <h2 className="text-sm font-semibold text-text-primary mb-4">
        {mode === 'timer' ? t('timer_label') : t('stopwatch_label')}
      </h2>

      {/* Circle */}
      <div className="flex justify-center mb-5">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--surface-3)" strokeWidth="8" />
            {mode === 'timer' && (
              <circle
                cx="60" cy="60" r="54" fill="none" stroke="var(--accent)" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (progress / 100) * circumference}
                className="transition-all duration-1000"
              />
            )}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`font-mono font-bold text-2xl ${finished ? 'text-red-400 animate-pulse' : 'text-text-primary'}`}>
              {fmt(seconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Timer input */}
      {mode === 'timer' && !running && (
        <div className="flex gap-2 mb-4 justify-center">
          <input
            type="number" min="1" max="999"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-20 px-3 py-1.5 text-center rounded-lg bg-surface border border-border text-sm text-text-primary focus:outline-none focus:border-accent"
          />
          <span className="flex items-center text-sm text-text-muted">min</span>
          <button onClick={applyInput}
            className="px-3 py-1.5 text-xs rounded-lg bg-surface-3 border border-border text-text-secondary hover:text-text-primary transition-colors">
            Set
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => { setRunning(!running); if (finished) reset(); }}
          className="px-6 py-2.5 rounded-lg bg-accent text-white text-sm font-medium
            hover:bg-accent-hover transition-all active:scale-95"
        >
          {running ? t('pause') : t('start')}
        </button>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-lg bg-surface-3 border border-border text-text-secondary
            text-sm font-medium hover:text-text-primary transition-all active:scale-95"
        >
          {t('reset')}
        </button>
      </div>

      {finished && (
        <p className="text-center text-red-400 font-medium mt-3 text-sm animate-bounce">⏰ Time&apos;s up!</p>
      )}
    </div>
  );
}
