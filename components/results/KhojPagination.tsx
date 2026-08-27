'use client';
import { useLanguage } from '@/hooks/useLanguage';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Khoooooj pagination — each 'o' = one page (like Goooooogle)
export function KhojPagination({ currentPage, totalPages, onPageChange }: Props) {
  const { dir } = useLanguage();

  if (totalPages <= 1) return null;

  // Build the "Khoooooj" string dynamically
  // K + h = prefix, j = suffix, middle 'o's = pages
  const oPages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center gap-6 py-8 select-none" dir={dir}>
      {/* Branded pagination */}
      <div className="flex items-center gap-0.5 text-2xl sm:text-3xl font-black tracking-tight">
        {/* Prev arrow */}
        {currentPage > 1 && (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="text-text-muted hover:text-accent transition-colors mr-2 text-xl"
            aria-label="Previous page"
          >
            {dir === 'rtl' ? '›' : '‹'}
          </button>
        )}

        {/* K */}
        <span className="text-[#4285f4] font-black">K</span>

        {/* h */}
        <span className="text-[#ea4335] font-black">h</span>

        {/* Dynamic 'o' letters = pages */}
        {oPages.map((page) => {
          const isActive = page === currentPage;
          const colors = [
            '#4285f4', // blue
            '#34a853', // green
            '#fbbc05', // yellow
            '#ea4335', // red
            '#4285f4',
            '#34a853',
            '#fbbc05',
            '#ea4335',
            '#4285f4',
            '#34a853',
          ];
          const color = colors[(page - 1) % colors.length];

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`relative transition-all duration-150 hover:scale-125 active:scale-95
                ${isActive ? 'scale-125' : 'hover:opacity-80'}`}
              title={`Page ${page}`}
              aria-label={`Page ${page}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className="font-black"
                style={{
                  color,
                  textDecoration: isActive ? 'underline' : 'none',
                  textDecorationColor: color,
                  textUnderlineOffset: '4px',
                  textDecorationThickness: '2px',
                }}
              >
                o
              </span>
              {/* Page number tooltip on hover */}
              <span className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-mono
                text-text-muted transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {page}
              </span>
            </button>
          );
        })}

        {/* j */}
        <span className="text-[#fbbc05] font-black">j</span>

        {/* Next arrow */}
        {currentPage < totalPages && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="text-text-muted hover:text-accent transition-colors ml-2 text-xl"
            aria-label="Next page"
          >
            {dir === 'rtl' ? '‹' : '›'}
          </button>
        )}
      </div>

      {/* Page info */}
      <p className="text-xs text-text-muted">
        Page <span className="font-semibold text-text-secondary">{currentPage}</span> of{' '}
        <span className="font-semibold text-text-secondary">{totalPages}</span>
      </p>

      {/* Dot indicators */}
      <div className="flex items-center gap-1.5">
        {oPages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`rounded-full transition-all duration-200
              ${page === currentPage
                ? 'w-4 h-2 bg-accent'
                : 'w-2 h-2 bg-surface-3 hover:bg-accent/40'}`}
          />
        ))}
      </div>
    </div>
  );
}
