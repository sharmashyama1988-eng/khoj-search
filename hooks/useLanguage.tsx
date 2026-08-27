'use client';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Locale } from '@/types';
import { LANGUAGES, getLang } from '@/lib/languages';

interface LanguageCtx {
  lang: string;
  dir: 'ltr' | 'rtl';
  t: (key: string) => string;
  setLang: (code: string) => void;
  currentLang: typeof LANGUAGES[0];
}

const LanguageContext = createContext<LanguageCtx>({
  lang: 'en', dir: 'ltr',
  t: (k) => k, setLang: () => {},
  currentLang: LANGUAGES[0],
});

const cache: Record<string, Locale> = {};

async function loadLocale(code: string): Promise<Locale> {
  if (cache[code]) return cache[code];
  try {
    const supported = ['en','hi','es','fr','de','pt','ru','ar','zh','ja','ko'];
    const c = supported.includes(code) ? code : 'en';
    const mod = await import(`@/locales/${c}.json`);
    cache[code] = mod.default as Locale;
    return cache[code];
  } catch {
    if (!cache['en']) {
      const mod = await import('@/locales/en.json');
      cache['en'] = mod.default as Locale;
    }
    return cache['en'];
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState]   = useState('en');
  const [locale, setLocale]    = useState<Locale>({});

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('khoj-lang') : null;
    const detected = navigator.language?.split('-')[0] ?? 'en';
    const initial  = saved ?? detected;
    switchLang(initial);
  }, []);

  const switchLang = useCallback(async (code: string) => {
    const meta  = getLang(code);
    const data  = await loadLocale(code);
    setLangState(code);
    setLocale(data);
    if (typeof window !== 'undefined') {
      localStorage.setItem('khoj-lang', code);
      document.documentElement.lang = meta.wikiCode;
      document.documentElement.dir  = meta.dir;
    }
  }, []);

  const t = useCallback((key: string): string => locale[key] ?? key, [locale]);

  const currentLang = getLang(lang);

  return (
    <LanguageContext.Provider value={{ lang, dir: currentLang.dir, t, setLang: switchLang, currentLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
