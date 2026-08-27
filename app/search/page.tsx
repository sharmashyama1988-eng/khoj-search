import { Suspense } from 'react';
import SearchPageContent from './SearchPageContent';

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--surface)]">
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-accent/30" />
            <div className="h-3 w-32 rounded bg-surface-3" />
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
