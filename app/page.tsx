'use client';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/search/SearchBar';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/hooks/useLanguage';

export default function HomePage() {
  const { t, currentLang } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-surface text-text-primary transition-colors" dir={currentLang.dir}>
      {/* Header with 9-dot tools menu, language selector & theme toggle */}
      <Header showSearch={false} />

      {/* Hero Content — Clean, minimalist & elegant */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-12 sm:-mt-16 w-full max-w-4xl mx-auto">
        {/* Branding Title & Tagline */}
        <div className="mb-7 flex flex-col items-center text-center">
          <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight text-text-primary bg-clip-text text-transparent bg-gradient-to-r from-text-primary via-indigo-200 to-indigo-400 select-none">
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
