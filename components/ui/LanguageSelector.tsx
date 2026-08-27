'use client';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { LANGUAGES } from '@/lib/languages';

export function LanguageSelector() {
  const { lang, setLang, currentLang, t } = useLanguage();
  const [open, setOpen]   = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
          bg-surface-2 border border-border text-text-secondary
          hover:bg-surface-3 hover:text-text-primary transition-all duration-150"
        title={t('language')}
      >
        <span className="text-base">{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.nativeName}</span>
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-surface shadow-2xl z-50 overflow-hidden animate-slide-up">
          <div className="p-2 border-b border-border">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search language…"
              className="w-full px-3 py-1.5 text-sm rounded-lg bg-surface-2 border border-border
                text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
              autoFocus
            />
          </div>
          <div className="max-h-72 overflow-y-auto">
            {filtered.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); setSearch(''); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left
                  hover:bg-surface-2 transition-colors
                  ${lang === l.code ? 'text-accent font-medium bg-surface-2' : 'text-text-secondary'}`}
              >
                <span className="text-lg">{l.flag}</span>
                <div>
                  <div className="font-medium text-text-primary">{l.nativeName}</div>
                  <div className="text-xs text-text-muted">{l.name}</div>
                </div>
                {lang === l.code && (
                  <svg className="w-4 h-4 text-accent ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-text-muted text-sm py-4">No language found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
