'use client';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/search/SearchBar';
import { QuickChips } from '@/components/ui/QuickChips';
import { Footer } from '@/components/layout/Footer';
import { KhojLogo } from '@/components/ui/KhojLogo';
import { useLanguage } from '@/hooks/useLanguage';

export default function HomePage() {
  const { t, currentLang } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-surface text-text-primary transition-colors" dir={currentLang.dir}>
      {/* Google-style Header Top Bar with 9-Dot App Menu, Language Selector & Theme Toggle */}
      <Header showSearch={false} />

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-12">
        {/* Logo & Branding */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4">
            <KhojLogo size="xl" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-text-primary">
            Khoj
          </h1>
          <p className="text-text-secondary text-base sm:text-lg mt-2 font-normal max-w-md">
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
