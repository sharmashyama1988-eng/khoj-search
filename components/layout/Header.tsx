'use client';
import Link from 'next/link';
import { SearchBar } from '@/components/search/SearchBar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSelector } from '@/components/ui/LanguageSelector';

interface Props { showSearch?: boolean; query?: string; currentTab?: string }

export function Header({ showSearch = false, query = '', currentTab = 'all' }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm
            group-hover:scale-110 transition-transform">
            K
          </div>
          <span className="font-bold text-text-primary text-base hidden sm:inline">Khoj</span>
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
