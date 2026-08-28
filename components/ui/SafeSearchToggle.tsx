'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export type SafeSearchLevel = 'off' | 'moderate' | 'strict';

export function SafeSearchToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSafe = (searchParams.get('safe') || 'off').toLowerCase() as SafeSearchLevel;
  const [safeLevel, setSafeLevel] = useState<SafeSearchLevel>(currentSafe);

  useEffect(() => {
    const saved = localStorage.getItem('khoj_safesearch') as SafeSearchLevel | null;
    if (saved && ['off', 'moderate', 'strict'].includes(saved)) {
      setSafeLevel(saved);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (level: SafeSearchLevel) => {
    setSafeLevel(level);
    localStorage.setItem('khoj_safesearch', level);
    setOpen(false);

    if (pathname.includes('/search')) {
      const params = new URLSearchParams(searchParams.toString());
      if (level === 'off') {
        params.delete('safe');
      } else {
        params.set('safe', level);
      }
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const getLabel = (level: SafeSearchLevel) => {
    switch (level) {
      case 'off':
        return { text: 'SafeSearch: Off (Unrestricted)', icon: '🔓', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' };
      case 'moderate':
        return { text: 'SafeSearch: Moderate', icon: '🛡️', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' };
      case 'strict':
        return { text: 'SafeSearch: Strict', icon: '🔒', color: 'text-green-400 border-green-500/30 bg-green-500/10' };
    }
  };

  const active = getLabel(safeLevel);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm ${active.color}`}
        title="Toggle SafeSearch mode"
      >
        <span>{active.icon}</span>
        <span className="hidden md:inline font-medium">{safeLevel === 'off' ? 'Unrestricted (18+)' : safeLevel === 'moderate' ? 'Safe: Moderate' : 'Safe: Strict'}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-surface-2 border border-border shadow-2xl p-2 z-50 animate-fade-in text-xs space-y-1">
          <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-text-muted">
            SafeSearch Options
          </div>

          <button
            type="button"
            onClick={() => handleSelect('off')}
            className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${safeLevel === 'off' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'hover:bg-surface-3 text-text-primary'}`}
          >
            <div className="flex flex-col">
              <span className="flex items-center gap-1.5 font-medium">🔓 Off (Unrestricted)</span>
              <span className="text-[10px] text-text-muted">Search all 19,000+ domains & explicit media</span>
            </div>
            {safeLevel === 'off' && <span>✓</span>}
          </button>

          <button
            type="button"
            onClick={() => handleSelect('moderate')}
            className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${safeLevel === 'moderate' ? 'bg-blue-500/20 text-blue-300 font-semibold' : 'hover:bg-surface-3 text-text-primary'}`}
          >
            <div className="flex flex-col">
              <span className="flex items-center gap-1.5 font-medium">🛡️ Moderate</span>
              <span className="text-[10px] text-text-muted">Filter explicit images and videos</span>
            </div>
            {safeLevel === 'moderate' && <span>✓</span>}
          </button>

          <button
            type="button"
            onClick={() => handleSelect('strict')}
            className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${safeLevel === 'strict' ? 'bg-green-500/20 text-green-300 font-semibold' : 'hover:bg-surface-3 text-text-primary'}`}
          >
            <div className="flex flex-col">
              <span className="flex items-center gap-1.5 font-medium">🔒 Strict</span>
              <span className="text-[10px] text-text-muted">Full family safe search filter</span>
            </div>
            {safeLevel === 'strict' && <span>✓</span>}
          </button>
        </div>
      )}
    </div>
  );
}