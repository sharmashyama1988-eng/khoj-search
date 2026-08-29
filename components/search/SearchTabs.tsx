'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import type { SearchTab } from '@/types';
import { BANGS } from '@/lib/bangs';

export type TimeFilter = 'all' | 'd' | 'w' | 'm' | 'y';

interface Props {
  activeTab: SearchTab;
  onTabChange: (tab: SearchTab) => void;
  timeFilter?: TimeFilter;
  onTimeChange?: (time: TimeFilter) => void;
}

const TABS: { id: SearchTab; labelKey: string; icon: string }[] = [
  { id: 'all',      labelKey: 'tab_all',      icon: '🔍' },
  { id: 'videos',   labelKey: 'tab_videos',   icon: '🎥' },
  { id: 'images',   labelKey: 'tab_images',   icon: '🖼️' },
  { id: 'code',     labelKey: 'tab_code',     icon: '💻' },
  { id: 'research', labelKey: 'tab_research', icon: '🔬' },
  { id: 'books',    labelKey: 'tab_books',    icon: '📚' },
];

const TIME_OPTIONS: { id: TimeFilter; label: string }[] = [
  { id: 'all', label: 'Any time' },
  { id: 'd',   label: 'Past 24 hours' },
  { id: 'w',   label: 'Past week' },
  { id: 'm',   label: 'Past month' },
  { id: 'y',   label: 'Past year' },
];

export function SearchTabs({ activeTab, onTabChange, timeFilter = 'all', onTimeChange }: Props) {
  const { t } = useLanguage();
  const [timeOpen, setTimeOpen] = useState(false);
  const [bangsOpen, setBangsOpen] = useState(false);
  const timeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (timeRef.current && !timeRef.current.contains(e.target as Node)) {
        setTimeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const activeTimeLabel = TIME_OPTIONS.find(o => o.id === timeFilter)?.label || 'Any time';

  return (
    <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2 mb-4 overflow-x-auto scrollbar-none">
      {/* Category Tabs */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold
                whitespace-nowrap transition-all duration-150 shrink-0 cursor-pointer active:scale-95
                ${isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                }`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span>{t(tab.labelKey)}</span>
            </button>
          );
        })}
      </div>

      {/* Tools & Bangs Shortcuts Trigger */}
      <div className="flex items-center gap-1.5 shrink-0 ml-auto pl-2">
        {/* Time Filter Menu (shown on 'all' tab) */}
        {activeTab === 'all' && onTimeChange && (
          <div className="relative inline-block" ref={timeRef}>
            <button
              type="button"
              onClick={() => setTimeOpen(!timeOpen)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                timeFilter !== 'all'
                  ? 'border-primary/40 bg-primary/10 text-primary font-bold'
                  : 'border-border/70 bg-surface-2 hover:bg-surface-3 text-text-muted hover:text-text-primary'
              }`}
              title="Filter by time / freshness"
            >
              <span>⏳</span>
              <span className="hidden sm:inline">{activeTimeLabel}</span>
              <span className="text-[10px]">▼</span>
            </button>

            {timeOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-surface-2 border border-border shadow-2xl p-1.5 z-50 animate-fade-in text-xs space-y-0.5">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Time Range
                </div>
                {TIME_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onTimeChange(opt.id);
                      setTimeOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                      timeFilter === opt.id
                        ? 'bg-primary/20 text-primary font-semibold'
                        : 'hover:bg-surface-3 text-text-primary'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {timeFilter === opt.id && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* !Bangs Cheatsheet Modal Button */}
        <button
          type="button"
          onClick={() => setBangsOpen(true)}
          className="px-2.5 py-1.5 rounded-xl border border-border/70 bg-surface-2 hover:bg-surface-3 text-text-muted hover:text-text-primary text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
          title="View !Bang Shortcuts"
        >
          <span className="font-mono text-amber-400 font-bold">!</span>
          <span className="hidden sm:inline">Bangs</span>
        </button>
      </div>

      {/* !Bangs Cheatsheet Modal */}
      {bangsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-2 border border-border rounded-3xl p-5 max-w-lg w-full shadow-2xl relative max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <h3 className="font-bold text-text-primary text-base">DuckDuckGo !Bang Shortcuts</h3>
              </div>
              <button
                type="button"
                onClick={() => setBangsOpen(false)}
                className="text-text-muted hover:text-text-primary p-1 rounded-lg text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-text-muted py-2">
              Type any bang shortcut in the search bar to jump directly to that site (e.g. <code className="bg-surface-3 px-1.5 py-0.5 rounded text-amber-300">!yt lofi music</code> or <code className="bg-surface-3 px-1.5 py-0.5 rounded text-amber-300">!w Einstein</code>).
            </p>

            <div className="overflow-y-auto flex-1 divide-y divide-border/30 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-2">
                {BANGS.map((b) => (
                  <div
                    key={b.prefix}
                    className="p-2.5 rounded-xl bg-surface-3/50 border border-border/40 flex items-center gap-2.5 text-xs"
                  >
                    <span className="text-base shrink-0">{b.icon}</span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-text-primary truncate">{b.name}</span>
                      <code className="text-amber-400 font-mono text-[11px]">{b.prefix}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border/50 text-center">
              <button
                type="button"
                onClick={() => setBangsOpen(false)}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs cursor-pointer hover:bg-primary/90 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}