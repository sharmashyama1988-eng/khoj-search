'use client';
import { SearchBar } from '@/components/search/SearchBar';
import { QuickChips } from '@/components/ui/QuickChips';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/hooks/useLanguage';

export default function HomePage() {
  const { t, currentLang } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col" dir={currentLang.dir}>
      {/* Top bar */}
      <div className="flex justify-end items-center gap-2 px-6 pt-4">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-16">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent
            text-white text-3xl font-black mb-4 shadow-lg shadow-accent/25
            hover:scale-105 transition-transform cursor-default select-none">
            খ
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-text-primary">
            Khoj
          </h1>
          <p className="text-text-secondary text-base mt-2 font-medium">
            {t('footer_tagline')}
          </p>
        </div>

        {/* Search bar */}
        <div className="w-full max-w-2xl px-2">
          <SearchBar />
        </div>

        {/* Quick chips */}
        <QuickChips />

        {/* Feature pills */}
        <div className="mt-10 flex flex-wrap justify-center gap-2 text-xs text-text-muted max-w-lg text-center">
          {[
            '🌍 30+ Languages', '⚡ Instant Answers', '📚 Books', '🔬 Research Papers',
            '💻 Code Search', '🖼️ Images', '🌤️ Weather', '💱 Crypto & Currency',
          ].map((feat) => (
            <span key={feat} className="px-3 py-1 rounded-full bg-surface-2 border border-border">{feat}</span>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
