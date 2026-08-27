'use client';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      onClick={toggle}
      className="relative w-10 h-10 flex items-center justify-center rounded-xl
        bg-surface-2 border border-border text-text-secondary
        hover:bg-surface-3 hover:text-text-primary hover:border-accent/40
        active:scale-95 transition-all duration-200 shadow-sm overflow-hidden group"
      title={theme === 'dark' ? t('light_mode') : t('dark_mode')}
      aria-label="Toggle theme"
    >
      <div className={`transition-transform duration-500 ease-out transform ${theme === 'dark' ? 'rotate-0 scale-100' : 'rotate-180 scale-100'}`}>
        {theme === 'dark' ? (
          /* Sun icon for switching to light mode */
          <svg className="w-5 h-5 text-amber-400 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          /* Moon icon for switching to dark mode */
          <svg className="w-5 h-5 text-indigo-400 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </div>
    </button>
  );
}
