'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface Props {
  onOpenAgent?: () => void;
}

export function MobileBottomNav({ onOpenAgent }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get('tab') || 'all';
  const query = searchParams.get('q') || '';
  const isSearchPage = pathname.includes('/search');

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      href: '/',
      active: pathname === '/',
    },
    {
      id: 'all',
      label: 'Search',
      icon: '🔍',
      href: query ? `/search?q=${encodeURIComponent(query)}&tab=all` : '/search',
      active: isSearchPage && currentTab === 'all',
    },
    {
      id: 'images',
      label: 'Images',
      icon: '🖼️',
      href: query ? `/search?q=${encodeURIComponent(query)}&tab=images` : '/search?tab=images',
      active: isSearchPage && currentTab === 'images',
    },
    {
      id: 'videos',
      label: 'Videos',
      icon: '🎬',
      href: query ? `/search?q=${encodeURIComponent(query)}&tab=videos` : '/search?tab=videos',
      active: isSearchPage && currentTab === 'videos',
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-t border-border/70 px-3 py-2 shadow-2xl transition-all"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-90 ${
              item.active
                ? 'text-primary font-bold bg-primary/10'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <span className="text-lg leading-none mb-1">{item.icon}</span>
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </Link>
        ))}

        {/* AI Agent Mode Button */}
        <button
          type="button"
          onClick={onOpenAgent}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-indigo-400 font-semibold hover:bg-indigo-500/10 active:scale-90 transition-all cursor-pointer"
          title="Open AI Agent"
        >
          <span className="text-lg leading-none mb-1 animate-pulse">🤖</span>
          <span className="text-[10px] tracking-tight">Agent</span>
        </button>
      </div>
    </nav>
  );
}