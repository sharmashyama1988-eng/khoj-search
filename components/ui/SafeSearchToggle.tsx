'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export type SafeSearchLevel = 'off' | 'moderate' | 'strict';

function SafeSearchToggleInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [safeLevel, setSafeLevel] = useState<SafeSearchLevel>('off');

  useEffect(() => {
    const fromUrl = searchParams.get('safe') as SafeSearchLevel | null;
    const fromStorage = localStorage.getItem('khoj_safesearch') as SafeSearchLevel | null;
    const resolved = fromUrl || fromStorage || 'off';
    if (['off', 'moderate', 'strict'].includes(resolved)) setSafeLevel(resolved as SafeSearchLevel);
  }, [searchParams]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleSelect = (level: SafeSearchLevel) => {
    setSafeLevel(level);
    localStorage.setItem('khoj_safesearch', level);
    setOpen(false);
    if (pathname.includes('/search')) {
      const params = new URLSearchParams(searchParams.toString());
      level === 'off' ? params.delete('safe') : params.set('safe', level);
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const LABELS = {
    off:      { text: 'Unrestricted',  icon: '🔓', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
    moderate: { text: 'Safe: Moderate', icon: '🛡️', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
    strict:   { text: 'Safe: Strict',   icon: '🔒', color: 'text-green-400 border-green-500/30 bg-green-500/10' },
  };
  const active = LABELS[safeLevel];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button type="button" onClick={() => setOpen(!open)}
        className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm ${active.color}`}
        title="Toggle SafeSearch mode">
        <span>{active.icon}</span>
        <span className="hidden md:inline font-medium">{active.text}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-surface-2 border border-border shadow-2xl p-2 z-50 animate-fade-in text-xs space-y-1">
          <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-text-muted">SafeSearch Options</div>
          {(['off','moderate','strict'] as SafeSearchLevel[]).map((level) => {
            const l = LABELS[level];
            const isActive = safeLevel === level;
            const activeStyle = level === 'off' ? 'bg-amber-500/20 text-amber-300' : level === 'moderate' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300';
            return (
              <button key={level} type="button" onClick={() => handleSelect(level)}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${isActive ? `${activeStyle} font-semibold` : 'hover:bg-surface-3 text-text-primary'}`}>
                <div className="flex flex-col">
                  <span className="flex items-center gap-1.5 font-medium">{l.icon} {level === 'off' ? 'Off (Unrestricted)' : l.text.replace('Safe: ','')}</span>
                  <span className="text-[10px] text-text-muted">
                    {level === 'off' ? 'Search all 19,000+ domains & explicit media' : level === 'moderate' ? 'Filter explicit images and videos' : 'Full family safe search filter'}
                  </span>
                </div>
                {isActive && <span>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function SafeSearchToggle() {
  return (
    <Suspense fallback={
      <div className="px-2.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold flex items-center gap-1.5 opacity-70">
        🔓 <span className="hidden md:inline">Unrestricted</span>
      </div>
    }>
      <SafeSearchToggleInner />
    </Suspense>
  );
}