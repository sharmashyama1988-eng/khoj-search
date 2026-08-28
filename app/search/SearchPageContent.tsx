'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchTabs } from '@/components/search/SearchTabs';
import { ResultCard } from '@/components/results/ResultCard';
import { WikiPanel } from '@/components/results/WikiPanel';
import { ImageGrid } from '@/components/results/ImageGrid';
import { BookCard } from '@/components/results/BookCard';
import { ArxivCard } from '@/components/results/ArxivCard';
import { GithubCard } from '@/components/results/GithubCard';
import { SummaryCard } from '@/components/results/SummaryCard';
import { KhojPagination } from '@/components/results/KhojPagination';
import { DidYouMean } from '@/components/results/DidYouMean';
import { PeopleAlsoAsk } from '@/components/results/PeopleAlsoAsk';
import { ReaderModal } from '@/components/results/ReaderModal';
import { SkeletonLoader, SkeletonPanel, SkeletonImageGrid } from '@/components/ui/SkeletonLoader';
import { ExportButton } from '@/components/ui/ExportButton';
// ── Widgets ──────────────────────────────────────────────────────────────────
import { CalculatorWidget } from '@/components/widgets/CalculatorWidget';
import { WeatherWidget } from '@/components/widgets/WeatherWidget';
import { CryptoWidget } from '@/components/widgets/CryptoWidget';
import { CurrencyWidget } from '@/components/widgets/CurrencyWidget';
import { DictionaryWidget } from '@/components/widgets/DictionaryWidget';
import { TimerWidget } from '@/components/widgets/TimerWidget';
import { ColorPickerWidget } from '@/components/widgets/ColorPickerWidget';
import { CoinFlipWidget, DiceWidget } from '@/components/widgets/CoinFlipWidget';
import { QRCodeWidget } from '@/components/widgets/QRCodeWidget';
import { PasswordWidget } from '@/components/widgets/PasswordWidget';
import { MapWidget } from '@/components/widgets/MapWidget';
import { StockWidget } from '@/components/widgets/StockWidget';
import { CodeRunnerWidget } from '@/components/widgets/CodeRunnerWidget';
import { RegexWidget } from '@/components/widgets/RegexWidget';
import { PriceWidget } from '@/components/widgets/PriceWidget';
import { TranslatorWidget } from '@/components/widgets/TranslatorWidget';
// ── Hooks ─────────────────────────────────────────────────────────────────────
import { useSearch } from '@/hooks/useSearch';
import { useIntentDetector } from '@/hooks/useIntentDetector';
import { useLanguage } from '@/hooks/useLanguage';
import { useSearchHistory } from '@/components/ui/SearchHistory';
import type { SearchTab } from '@/types';

const PAGE_SIZE = 10;

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const { t, lang, dir, setLang } = useLanguage();
  const { addToHistory } = useSearchHistory();

  const query     = searchParams.get('q') ?? '';
  const tabParam  = (searchParams.get('tab') ?? 'all') as SearchTab;
  const langParam = searchParams.get('lang') ?? lang;
  const pageParam = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));

  const [activeTab, setActiveTab] = useState<SearchTab>(tabParam);
  const [page, setPage]           = useState(pageParam);
  const [readerTarget, setReaderTarget] = useState<{ url: string; title: string } | null>(null);

  const { results, images, books, arxiv, github, wikiPanel, loading, error, search } = useSearch();
  const intent = useIntentDetector(query);

  // Sync language from URL
  useEffect(() => {
    if (langParam && langParam !== lang) setLang(langParam);
  }, [langParam, lang, setLang]);

  // Search + add to history
  useEffect(() => {
    if (query) {
      search(query, langParam || lang, activeTab);
      addToHistory(query, langParam || lang);
    }
  }, [query, activeTab, langParam, lang, search, addToHistory]);

  const changeTab = useCallback((tab: SearchTab) => {
    setActiveTab(tab);
    setPage(1);
    router.push(`/search?q=${encodeURIComponent(query)}&lang=${lang}&tab=${tab}&page=1`);
  }, [query, lang, router]);

  const changePage = useCallback((p: number) => {
    setPage(p);
    router.push(`/search?q=${encodeURIComponent(query)}&lang=${lang}&tab=${activeTab}&page=${p}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [query, lang, activeTab, router]);

  const openReader = useCallback((url: string, title: string) => {
    setReaderTarget({ url, title });
  }, []);

  const renderWidget = () => {
    switch (intent.type) {
      case 'calculator': return <CalculatorWidget initialExpr={intent.payload} />;
      case 'weather':    return <WeatherWidget city={intent.payload ?? 'Delhi'} />;
      case 'crypto':     return <CryptoWidget coinId={intent.payload ?? 'bitcoin'} />;
      case 'currency':   return <CurrencyWidget initialPayload={intent.payload} />;
      case 'dictionary': return <DictionaryWidget word={intent.payload ?? query} />;
      case 'timer':      return <TimerWidget initialSeconds={parseInt(intent.payload ?? '60')} mode="timer" />;
      case 'stopwatch':  return <TimerWidget mode="stopwatch" />;
      case 'color':      return <ColorPickerWidget initialColor={intent.payload} />;
      case 'coin_flip':  return <CoinFlipWidget />;
      case 'dice':       return <DiceWidget />;
      case 'qr':         return <QRCodeWidget initialText={intent.payload} />;
      case 'password':   return <PasswordWidget />;
      case 'map':        return <MapWidget place={intent.payload ?? query} />;
      case 'stock':      return <StockWidget symbol={intent.payload ?? 'AAPL'} />;
      case 'price':      return <PriceWidget query={intent.payload ?? query} />;
      case 'translator': return <TranslatorWidget initialText={intent.payload} />;
      case 'code':       return <CodeRunnerWidget initialCode={intent.payload} />;
      case 'regex':      return <RegexWidget />;
      default:           return null;
    }
  };

  const widget    = renderWidget();
  const hasWidget = widget !== null;

  // Pagination calculation
  let totalItems = 0;
  if (activeTab === 'all') totalItems = results.length;
  else if (activeTab === 'images') totalItems = images.length;
  else if (activeTab === 'books') totalItems = books.length;
  else if (activeTab === 'research') totalItems = arxiv.length;
  else if (activeTab === 'code') totalItems = github.length;

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pagedResults = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pagedBooks   = books.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pagedArxiv   = arxiv.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pagedGithub  = github.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const hasResults = totalItems > 0;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface)]" dir={dir}>
      <Header showSearch query={query} currentTab={activeTab} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-4">
        {/* Tabs + export row */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SearchTabs activeTab={activeTab} onTabChange={changeTab} />
          <div className="ml-auto flex items-center gap-2">
            {hasResults && (
              <ExportButton data={{ results, arxiv, github, books, query }} />
            )}
            {query && (
              <span className="text-xs text-text-muted hidden sm:block">
                {t('results_for')}: <span className="font-medium text-text-secondary">&ldquo;{query}&rdquo;</span>
                {totalItems > 0 && <span className="ml-1.5 opacity-60">({totalItems} results)</span>}
              </span>
            )}
          </div>
        </div>

        {/* 2-column grid */}
        <div className="flex gap-6 items-start">
          {/* LEFT column */}
          <div className="flex-1 min-w-0">

            {/* Instant widget */}
            {hasWidget && (
              <div className="mb-6 animate-slide-up max-w-xl">{widget}</div>
            )}

            {/* Did You Mean */}
            {activeTab === 'all' && !loading && !hasWidget && (
              <DidYouMean query={query} />
            )}

            {/* Featured AI Answer */}
            {activeTab === 'all' && query && !hasWidget && currentPage === 1 && (
              <SummaryCard query={query} />
            )}

            {/* Loading */}
            {loading && (
              activeTab === 'images' ? <SkeletonImageGrid /> : <SkeletonLoader count={6} />
            )}

            {/* Error */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <span className="text-4xl">⚠️</span>
                <p className="text-text-secondary">{error}</p>
              </div>
            )}

            {/* Tab: All */}
            {!loading && activeTab === 'all' && (
              pagedResults.length > 0
                ? (
                  <div className="space-y-1">
                    {currentPage === 1 ? (
                      <>
                        {pagedResults.slice(0, 2).map((r, i) => (
                          <ResultCard
                            key={r.id || `res-${i}`}
                            result={r}
                            index={i}
                            onOpenReader={openReader}
                          />
                        ))}
                        <PeopleAlsoAsk query={query} />
                        {pagedResults.slice(2).map((r, i) => (
                          <ResultCard
                            key={r.id || `res-${i + 2}`}
                            result={r}
                            index={i + 2}
                            onOpenReader={openReader}
                          />
                        ))}
                      </>
                    ) : (
                      pagedResults.map((r, i) => (
                        <ResultCard
                          key={r.id || `res-${i}`}
                          result={r}
                          index={(currentPage - 1) * PAGE_SIZE + i}
                          onOpenReader={openReader}
                        />
                      ))
                    )}
                  </div>
                )
                : !error && !hasWidget && <EmptyState message={t('no_results')} />
            )}

            {/* Tab: Images */}
            {!loading && activeTab === 'images' && (
              images.length > 0 ? <ImageGrid images={images} /> : <EmptyState message={t('no_results')} />
            )}

            {/* Tab: Books */}
            {!loading && activeTab === 'books' && (
              pagedBooks.length > 0
                ? <div className="space-y-3">{pagedBooks.map((b, i) => <BookCard key={b.key} book={b} index={i} />)}</div>
                : <EmptyState message={t('no_results')} />
            )}

            {/* Tab: Research */}
            {!loading && activeTab === 'research' && (
              pagedArxiv.length > 0
                ? <div className="space-y-3">{pagedArxiv.map((p, i) => <ArxivCard key={p.id} paper={p} index={i} />)}</div>
                : <EmptyState message={t('no_results')} />
            )}

            {/* Tab: Code */}
            {!loading && activeTab === 'code' && (
              pagedGithub.length > 0
                ? <div className="space-y-3">{pagedGithub.map((r, i) => <GithubCard key={r.id} repo={r} index={i} />)}</div>
                : <EmptyState message={t('no_results')} />
            )}

            {/* Khoooooj Pagination (Only visible when totalPages > 1) */}
            {!loading && totalPages > 1 && (
              <KhojPagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage} />
            )}
          </div>

          {/* RIGHT: Knowledge Panel */}
          {activeTab === 'all' && (
            <aside className="hidden lg:block w-80 shrink-0">
              {loading ? <SkeletonPanel /> : wikiPanel && <WikiPanel panel={wikiPanel} />}
            </aside>
          )}
        </div>
      </main>

      {/* Instant In-App Reader Modal */}
      {readerTarget && (
        <ReaderModal
          url={readerTarget.url}
          initialTitle={readerTarget.title}
          onClose={() => setReaderTarget(null)}
        />
      )}

      <Footer />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center animate-fade-in">
      <span className="text-6xl opacity-30">🔍</span>
      <p className="text-text-secondary text-base">{message}</p>
    </div>
  );
}
