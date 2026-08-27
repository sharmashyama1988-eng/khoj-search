'use client';
import { SearchBar } from '@/components/search/SearchBar';
import { QuickChips } from '@/components/ui/QuickChips';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { Footer } from '@/components/layout/Footer';
import { KhojLogo } from '@/components/ui/KhojLogo';
import { useLanguage } from '@/hooks/useLanguage';

export default function HomePage() {
  const { t, currentLang } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-surface text-text-primary transition-colors" dir={currentLang.dir}>
      {/* Top bar */}
      <div className="flex justify-end items-center gap-2 px-6 pt-4 z-10">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      {/* Background Decorative Auras */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl opacity-70" />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-10 z-10">
        {/* Logo & Branding */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4">
            <KhojLogo size="xl" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-text-primary via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Khoj
          </h1>
          <p className="text-text-secondary text-base sm:text-lg mt-2 font-medium max-w-md">
            {t('footer_tagline')}
          </p>
        </div>

        {/* Search bar */}
        <div className="w-full max-w-2xl px-2">
          <SearchBar />
        </div>

        {/* Quick Chips (12 instant widgets) */}
        <QuickChips />

        {/* Feature Pills */}
        <div className="mt-12 flex flex-wrap justify-center gap-2 text-xs text-text-muted max-w-xl text-center">
          {[
            '🌍 30+ Languages', '⚡ Instant Answers', '📚 Books', '🔬 Research Papers',
            '💻 Code Sandbox', '🖼️ Images', '🌤️ Weather', '💱 Crypto & Currency',
            '🗺️ Live Maps', '📈 Stocks', '🔤 RegEx Tester', '🔐 Password Generator',
          ].map((feat) => (
            <span key={feat} className="px-3 py-1.5 rounded-full bg-surface-2/80 border border-border/80 backdrop-blur-sm transition-all hover:border-accent/40">
              {feat}
            </span>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
