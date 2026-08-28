'use client';
import Link from 'next/link';
import { SearchBar } from '@/components/search/SearchBar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { AppLauncherMenu } from '@/components/ui/AppLauncherMenu';
import { KhojLogo } from '@/components/ui/KhojLogo';

interface Props { showSearch?: boolean; query?: string; currentTab?: string }

export function Header({ showSearch = false, query = '', currentTab = 'all' }: Props) {
  return (
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

        {/* Header Actions: Language, Theme Toggle, Google 9-Dot App Menu */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <LanguageSelector />
          <ThemeToggle />
          <AppLauncherMenu />
        </div>
      </div>
    </header>
  );
}
