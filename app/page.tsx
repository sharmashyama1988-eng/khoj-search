'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/search/SearchBar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { AgentCopilotModal } from '@/components/agent/AgentCopilotModal';
import { useLanguage } from '@/hooks/useLanguage';

const QUICK_SHORTCUTS = [
  { prefix: '!yt', name: 'YouTube', icon: '▶️', color: 'hover:border-red-500/40 hover:bg-red-500/10' },
  { prefix: '!w', name: 'Wikipedia', icon: '📖', color: 'hover:border-blue-500/40 hover:bg-blue-500/10' },
  { prefix: '!gh', name: 'GitHub', icon: '🐙', color: 'hover:border-purple-500/40 hover:bg-purple-500/10' },
  { prefix: '!a', name: 'Amazon', icon: '📦', color: 'hover:border-amber-500/40 hover:bg-amber-500/10' },
  { prefix: '!r', name: 'Reddit', icon: '👽', color: 'hover:border-orange-500/40 hover:bg-orange-500/10' },
  { prefix: '!m', name: 'Maps', icon: '🗺️', color: 'hover:border-emerald-500/40 hover:bg-emerald-500/10' },
  { prefix: '!chatgpt', name: 'AI Chat', icon: '🤖', color: 'hover:border-teal-500/40 hover:bg-teal-500/10' },
];

export default function HomePage() {
  const { t, currentLang } = useLanguage();
  const [agentOpen, setAgentOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface text-text-primary transition-colors pb-14 md:pb-0" dir={currentLang.dir}>
      {/* Header with tools menu, language selector, theme toggle & SafeSearch */}
      <Header showSearch={false} />

      {/* Hero Content — Clean, minimalist & elegant */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-8 sm:-mt-14 w-full max-w-4xl mx-auto">
        {/* Branding Title & Tagline */}
        <div className="mb-6 sm:mb-8 flex flex-col items-center text-center">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-text-primary via-indigo-200 to-indigo-400 select-none drop-shadow-sm">
            Khoj
          </h1>
          <p className="text-text-secondary text-sm sm:text-base mt-2 font-normal max-w-md">
            {t('footer_tagline')}
          </p>
        </div>

        {/* Search bar */}
        <div className="w-full max-w-2xl px-1 sm:px-2">
          <SearchBar />
        </div>

        {/* Quick Bang Shortcuts & Direct Launchers */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-xl px-2">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mr-1 hidden sm:inline">
            Fast Shortcuts:
          </span>
          {QUICK_SHORTCUTS.map((s) => (
            <Link
              key={s.prefix}
              href={`/search?q=${encodeURIComponent(s.prefix + ' ')}`}
              className={`px-3 py-1.5 rounded-xl bg-surface-2/80 backdrop-blur-md border border-border/70 text-xs font-semibold text-text-secondary flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${s.color}`}
              title={`Direct search on ${s.name}`}
            >
              <span>{s.icon}</span>
              <span>{s.name}</span>
              <code className="text-[10px] font-mono opacity-60">{s.prefix}</code>
            </Link>
          ))}
        </div>
      </main>

      {/* Mobile Floating Bottom Navigation Bar */}
      <MobileBottomNav onOpenAgent={() => setAgentOpen(true)} />

      {/* Autonomous Agent Copilot Modal (Mobile & Global) */}
      <AgentCopilotModal
        isOpen={agentOpen}
        onClose={() => setAgentOpen(false)}
      />

      <Footer />
    </div>
  );
}