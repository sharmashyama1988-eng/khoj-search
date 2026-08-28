'use client';
import { useLanguage } from '@/hooks/useLanguage';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function KhojPagination({ currentPage, totalPages, onPageChange }: Props) {
  const { dir } = useLanguage();

  if (totalPages <= 1) return null;

  const maxVisible = 10;
  const pagesCount = Math.min(Math.max(totalPages, 10), maxVisible);
  const oPages = Array.from({ length: pagesCount }, (_, i) => i + 1);

  const colors = [
    '#4285f4', // blue
    '#ea4335', // red
    '#fbbc05', // yellow
    '#4285f4', // blue
    '#34a853', // green
    '#ea4335', // red
    '#fbbc05', // yellow
    '#4285f4', // blue
    '#34a853', // green
    '#ea4335', // red
  ];

  return (
    <div className="flex flex-col items-center justify-center pt-10 pb-12 mt-6 border-t border-border/30 select-none w-full animate-fade-in" dir={dir}>
      {/* Branded "Khoooooooj" Header */}
      <div className="flex items-center gap-0.5 text-2xl sm:text-4xl font-black tracking-normal mb-3">
        {/* K */}
        <span className="text-[#4285f4] font-black">K</span>

        {/* h */}
        <span className="text-[#ea4335] font-black">h</span>

        {/* Dynamic 'o' letters = pages */}
        {oPages.map((pageNum) => {
          const isActive = pageNum === currentPage;
          const color = colors[(pageNum - 1) % colors.length];

          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`relative px-0.5 transition-all duration-200 cursor-pointer focus:outline-none
                ${isActive ? 'scale-125 z-10' : 'hover:scale-110 opacity-80 hover:opacity-100'}`}
              title={`Go to page ${pageNum}`}
              aria-label={`Page ${pageNum}`}
            >
              <span
                className="font-black inline-block"
                style={{
                  color,
                  textDecoration: isActive ? 'underline' : 'none',
                  textDecorationColor: color,
                  textUnderlineOffset: '6px',
                  textDecorationThickness: '3px',
                }}
              >
                o
              </span>
            </button>
          );
        })}

        {/* j */}
        <span className="text-[#fbbc05] font-black">j</span>
      </div>

      {/* Numerical Navigation Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 mt-2">
        {/* Prev Button */}
        {currentPage > 1 && (
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-1.5 rounded-lg border border-border/60 bg-surface-2 hover:bg-surface-3 text-text-primary text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>{dir === 'rtl' ? '→' : '←'}</span>
            <span>Previous</span>
          </button>
        )}

        {/* Page Pills */}
        {oPages.map((pageNum) => {
          const isActive = pageNum === currentPage;
          return (
            <button
              key={`pill-${pageNum}`}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg font-mono text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center
                ${isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-105'
                  : 'bg-surface-2 hover:bg-surface-3 border border-border/60 text-text-secondary hover:text-text-primary'}`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        {currentPage < totalPages && (
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 py-1.5 rounded-lg border border-border/60 bg-surface-2 hover:bg-surface-3 text-text-primary text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Next</span>
            <span>{dir === 'rtl' ? '←' : '→'}</span>
          </button>
        )}
      </div>

      {/* Page Info */}
      <p className="text-[12px] text-text-muted mt-3 font-normal">
        Showing results page <span className="font-semibold text-text-primary">{currentPage}</span> of{' '}
        <span className="font-semibold text-text-primary">{totalPages}</span>
      </p>
    </div>
  );
}
