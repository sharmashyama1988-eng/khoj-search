'use client';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/search/SearchBar';
import { QuickChips } from '@/components/ui/QuickChips';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/hooks/useLanguage';

export default function HomePage() {
  const { t, currentLang } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-surface text-text-primary transition-colors" dir={currentLang.dir}>
      {/* Header */}
      <Header showSearch={false} />

      {/* Hero Content — Naturally centered with perfect proportions */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 w-full max-w-4xl mx-auto my-auto">
        {/* Branding Title & Tagline */}
        <div className="mb-6 flex flex-col items-center text-center">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-text-primary bg-clip-text text-transparent bg-gradient-to-r from-text-primary via-indigo-200 to-indigo-400 select-none">
            Khoj
          </h1>
          <p className="text-text-secondary text-sm sm:text-base mt-2 font-normal max-w-md">
            {t('footer_tagline')}
          </p>
        </div>

        {/* Search bar */}
        <div className="w-full max-w-2xl px-2">
          <SearchBar />
        </div>

        {/* Quick Tools & Knowledge Discovery Chips */}
        <div className="w-full mt-5">
          <QuickChips />
        </div>
      </main>

      <Footer />
    </div>
  );
}
