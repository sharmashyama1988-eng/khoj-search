'use client';
import { useState } from 'react';
import Link from 'next/link';
import { SearchBar } from '@/components/search/SearchBar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { SafeSearchToggle } from '@/components/ui/SafeSearchToggle';
import { AppLauncherMenu } from '@/components/ui/AppLauncherMenu';
import { KhojLogo } from '@/components/ui/KhojLogo';
import { AgentCopilotModal } from '@/components/agent/AgentCopilotModal';

interface Props { showSearch?: boolean; query?: string; currentTab?: string }

export function Header({ showSearch = false, query = '', currentTab = 'all' }: Props) {
  const [agentOpen, setAgentOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3 sm:gap-4">
          {/* Logo — Always visible and accessible */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group hover:opacity-90 transition-opacity">
            <KhojLogo size="sm" showText />
          </Link>

          {/* Compact search bar (shown on search results page) */}
          {showSearch && (
            <div className="flex-1 max-w-2xl">
              <SearchBar initialValue={query} compact currentTab={currentTab} />
            </div>
          )}

          {/* Header Actions: SafeSearch, Agent Mode, Language, Theme Toggle, Google 9-Dot App Menu */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {/* SafeSearch Filter Toggle */}
            <SafeSearchToggle />

            {/* Autonomous Agent Mode Trigger Button */}
            <button
              type="button"
              onClick={() => setAgentOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/15 to-purple-500/15 hover:from-indigo-500/25 hover:to-purple-500/25 text-indigo-400 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer"
              title="Open Autonomous AI Agent"
            >
              <span className="text-sm animate-pulse">🤖</span>
              <span className="hidden sm:inline">Agent Mode</span>
            </button>

            <LanguageSelector />
            <ThemeToggle />
            <AppLauncherMenu />
          </div>
        </div>
      </header>

      {/* Autonomous Agent Copilot Modal */}
      <AgentCopilotModal
        initialQuery={query}
        isOpen={agentOpen}
        onClose={() => setAgentOpen(false)}
      />
    </>
  );
}
