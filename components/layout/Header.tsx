'use client';
import Link from 'next/link';
import { SearchBar } from '@/components/search/SearchBar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { KhojLogo } from '@/components/ui/KhojLogo';

interface Props { showSearch?: boolean; query?: string; currentTab?: string }

export function Header({ showSearch = false, query = '', currentTab = 'all' }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-border/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <KhojLogo size="sm" showText />
        </Link>

        {/* Compact search bar */}
        {showSearch && (
          <div className="flex-1 max-w-xl">
            <SearchBar initialValue={query} compact currentTab={currentTab} />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
