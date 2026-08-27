'use client';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { LANGUAGES } from '@/lib/languages';

export function LanguageSelector() {
  const { lang, setLang, currentLang, t } = useLanguage();
  const [open, setOpen]     = useState(false);
  const [search, setSearch]   = useState('');
  const searchParams          = useSearchParams();
  const router                = useRouter();
  const ref                   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectLanguage = (code: string) => {
    setLang(code);
    setOpen(false);
    setSearch('');

    // If on search page, update URL so results immediately refresh in selected language
    const query = searchParams?.get('q');
    const tab   = searchParams?.get('tab') ?? 'all';
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}&lang=${code}&tab=${tab}`);
    }
  };

  const filtered = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open); }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium
          bg-surface-2/80 border border-border/80 text-text-secondary
          hover:bg-surface-3 hover:text-text-primary hover:border-accent/40
          transition-all duration-200 shadow-sm cursor-pointer select-none"
        title={t('language')}
      >
        <span className="text-sm">{currentLang.flag}</span>
        <span className="hidden sm:inline font-medium">{currentLang.nativeName}</span>
        <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border/80 bg-surface-2/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden animate-slide-up">
          <div className="p-2 border-b border-border/60">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search language…"
              className="w-full px-3 py-1.5 text-xs rounded-xl bg-surface border border-border/60
                text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
              autoFocus
            />
          </div>
          <div className="max-h-72 overflow-y-auto">
            {filtered.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => selectLanguage(l.code)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs text-left
                  hover:bg-surface-3 transition-colors cursor-pointer
                  ${lang === l.code ? 'text-accent font-semibold bg-accent/10' : 'text-text-secondary'}`}
              >
                <span className="text-base">{l.flag}</span>
                <div>
                  <div className="font-medium text-text-primary">{l.nativeName}</div>
                  <div className="text-[10px] text-text-muted">{l.name}</div>
                </div>
                {lang === l.code && (
                  <svg className="w-4 h-4 text-accent ml-auto shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-text-muted text-xs py-4">No language found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
