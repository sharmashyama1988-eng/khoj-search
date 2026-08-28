'use client';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/search/SearchBar';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/hooks/useLanguage';

export default function HomePage() {
  const { t, currentLang } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-surface text-text-primary transition-colors" dir={currentLang.dir}>
      {/* Header Top Bar with Top-Left Brand Logo, 9-Dot App Menu, Language Selector & Theme Toggle */}
      <Header showSearch={false} />

      {/* Hero Content — Shifted gracefully upwards */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-24 sm:-mt-32">
        {/* Branding Title & Tagline */}
        <div className="mb-8 flex flex-col items-center text-center">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-text-primary bg-clip-text text-transparent bg-gradient-to-r from-text-primary via-indigo-200 to-indigo-400 select-none">
            Khoj
          </h1>
          <p className="text-text-secondary text-sm sm:text-base mt-2.5 font-normal max-w-md">
            {t('footer_tagline')}
          </p>
        </div>

        {/* Search bar */}
        <div className="w-full max-w-2xl px-2">
          <SearchBar />
        </div>
      </main>

      <Footer />
    </div>
  );
}
