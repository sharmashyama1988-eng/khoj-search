'use client';
import { useState, useEffect, useCallback } from 'react';

export function useTheme() {
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('khoj-theme') as 'dark' | 'light' | null;
    const pref  = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    apply(saved ?? pref);
  }, []);

  const apply = (t: 'dark' | 'light') => {
    setThemeState(t);
    document.documentElement.classList.toggle('dark', t === 'dark');
    localStorage.setItem('khoj-theme', t);
  };

  const toggle = useCallback(() => apply(theme === 'dark' ? 'light' : 'dark'), [theme]);

  return { theme, toggle };
}
