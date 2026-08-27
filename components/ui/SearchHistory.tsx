'use client';
import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface SearchHistoryItem {
  query: string;
  lang: string;
  timestamp: number;
}

const HISTORY_KEY = 'khoj-history';
const MAX_ITEMS   = 50;

export function useSearchHistory() {
  const getHistory = useCallback((): SearchHistoryItem[] => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]') as SearchHistoryItem[];
    } catch { return []; }
  }, []);

  const addToHistory = useCallback((query: string, lang: string) => {
    if (!query.trim() || typeof window === 'undefined') return;
    const existing = getHistory().filter((h) => h.query !== query);
    const updated  = [{ query, lang, timestamp: Date.now() }, ...existing].slice(0, MAX_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  }, [getHistory]);

  const clearHistory = useCallback(() => {
    if (typeof window !== 'undefined') localStorage.removeItem(HISTORY_KEY);
  }, []);

  return { getHistory, addToHistory, clearHistory };
}

interface Props {
  onSelect: (query: string) => void;
  onClose: () => void;
}

export function SearchHistory({ onSelect, onClose }: Props) {
  const { t, lang } = useLanguage();
  const { getHistory, clearHistory } = useSearchHistory();
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => { setHistory(getHistory()); }, [getHistory]);

  if (history.length === 0) return null;

  return (
    <div className="absolute left-0 right-0 top-full mt-2 bg-surface border border-border
      rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">🕐 Recent Searches</span>
        <button
          onClick={() => { clearHistory(); setHistory([]); onClose(); }}
          className="text-xs text-text-muted hover:text-red-400 transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* History items */}
      <div className="max-h-60 overflow-y-auto">
        {history.slice(0, 15).map((item) => (
          <button
            key={item.timestamp}
            onClick={() => { onSelect(item.query); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left
              hover:bg-surface-2 transition-colors group"
          >
            <span className="text-text-muted text-xs">🕐</span>
            <span className="flex-1 text-sm text-text-secondary group-hover:text-text-primary truncate">
              {item.query}
            </span>
            <span className="text-xs text-text-muted shrink-0">
              {new Date(item.timestamp).toLocaleDateString()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
