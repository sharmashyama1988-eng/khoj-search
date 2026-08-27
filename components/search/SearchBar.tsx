'use client';
import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import { debounce } from '@/lib/utils';

interface Props {
  initialValue?: string;
  compact?: boolean;
  currentTab?: string;
}

export function SearchBar({ initialValue = '', compact = false, currentTab = 'all' }: Props) {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [query, setQuery]             = useState(initialValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSugg, setShowSugg]       = useState(false);
  const [activeIdx, setActiveIdx]     = useState(-1);
  const [listening, setListening]     = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Voice search — Web Speech API (free, browser-native)
  const startVoice = () => {
    if (typeof window === 'undefined') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Voice search not supported in this browser'); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'ar' ? 'ar-SA' : lang === 'zh' ? 'zh-CN' : lang === 'ja' ? 'ja-JP' : lang === 'ko' ? 'ko-KR' : lang === 'de' ? 'de-DE' : lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setListening(true);
    recognition.onresult = (e: { results: { transcript: string }[][] }) => {
      const transcript = e.results[0][0].transcript;
      setQuery(transcript);
      setListening(false);
      doSearch(transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend   = () => setListening(false);
    recognition.start();
  };

  // Keyboard shortcut: / or Ctrl+K to focus search
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const fetchSuggestions = debounce(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); return; }
    try {
      const res  = await fetch(`/api/suggestions?q=${encodeURIComponent(q)}&lang=${lang}`);
      const data = await res.json() as { suggestions: string[] };
      setSuggestions(data.suggestions ?? []);
      setShowSugg(true);
    } catch { setSuggestions([]); }
  }, 250);

  const handleChange = (v: string) => {
    setQuery(v);
    setActiveIdx(-1);
    fetchSuggestions(v);
  };

  const doSearch = (q: string) => {
    if (!q.trim()) return;
    setShowSugg(false);
    setSuggestions([]);
    router.push(`/search?q=${encodeURIComponent(q.trim())}&lang=${lang}&tab=${currentTab}`);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    doSearch(activeIdx >= 0 ? suggestions[activeIdx] : query);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSugg || !suggestions.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setShowSugg(false);
      setActiveIdx(-1);
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      doSearch(suggestions[activeIdx]);
    }
  };

  return (
    <div className={`w-full ${compact ? 'max-w-2xl' : 'max-w-2xl'} relative`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={`flex items-center gap-2 w-full
          bg-surface-2/80 backdrop-blur-md border border-border rounded-2xl
          shadow-lg hover:border-accent/50 focus-within:border-accent focus-within:shadow-accent/10
          transition-all duration-200 ${compact ? 'px-4 py-2.5' : 'px-5 py-4'}`}
        >
          {/* Search icon */}
          <svg className="w-5 h-5 text-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSugg(true)}
            onBlur={() => setTimeout(() => setShowSugg(false), 150)}
            placeholder={t('search_placeholder')}
            className={`flex-1 bg-transparent text-text-primary placeholder-text-muted
              outline-none ${compact ? 'text-sm' : 'text-base'}`}
            autoComplete="off"
            spellCheck={false}
          />

          {/* Keyboard shortcut hint */}
          {!compact && !query && (
            <kbd className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-md text-xs
              text-text-muted border border-border font-mono shrink-0">
              <span className="text-xs">⌃</span>K
            </kbd>
          )}

          {/* Clear button */}
          {query && (
            <button type="button" onClick={() => { setQuery(''); setSuggestions([]); inputRef.current?.focus(); }}
              className="shrink-0 text-text-muted hover:text-text-primary transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* 🎤 Voice search button */}
          <button
            type="button"
            onClick={startVoice}
            title="Voice search (mic)"
            className={`shrink-0 transition-all duration-150 rounded-full p-1
              ${listening
                ? 'text-red-400 animate-pulse scale-110'
                : 'text-text-muted hover:text-accent'}`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-7 11a7 7 0 0 0 14 0h-2a5 5 0 0 1-10 0H5zm7 9v-2a7.003 7.003 0 0 0 6.93-6H19a7.003 7.003 0 0 1-14 0H3.07A7.003 7.003 0 0 0 10 21v2h2z"/>
            </svg>
          </button>

          <button type="submit"
            className={`shrink-0 bg-accent hover:bg-accent-hover text-white font-medium
              rounded-xl transition-all duration-150 hover:scale-105 active:scale-95
              ${compact ? 'px-3 py-1.5 text-sm' : 'px-5 py-2 text-sm'}`}
          >
            {t('search_button')}
          </button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSugg && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-surface border border-border
          rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-up">
          {suggestions.map((s, i) => (
            <button
              key={s}
              onMouseDown={() => doSearch(s)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-sm text-left
                hover:bg-surface-2 transition-colors
                ${i === activeIdx ? 'bg-surface-2 text-text-primary' : 'text-text-secondary'}`}
            >
              <svg className="w-4 h-4 text-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
