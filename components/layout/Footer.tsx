'use client';
import { useLanguage } from '@/hooks/useLanguage';
import { KhojLogo } from '@/components/ui/KhojLogo';

const API_LINKS = [
  { name: 'Wikipedia', url: 'https://wikipedia.org' },
  { name: 'Open-Meteo', url: 'https://open-meteo.com' },
  { name: 'CoinGecko', url: 'https://coingecko.com' },
  { name: 'Frankfurter', url: 'https://frankfurter.dev' },
  { name: 'arXiv', url: 'https://arxiv.org' },
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'Open Library', url: 'https://openlibrary.org' },
];

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border/80 bg-surface/50 backdrop-blur-md py-8 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted">
        <div className="flex items-center gap-3">
          <KhojLogo size="sm" />
          <div>
            <p className="font-semibold text-text-primary text-sm">Khoj</p>
            <p className="text-text-muted">{t('footer_tagline')}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
          <span className="font-medium text-text-secondary">{t('powered_by')}:</span>
          {API_LINKS.map((link, idx) => (
            <span key={link.name} className="inline-flex items-center gap-1.5">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent hover:underline font-medium transition-colors"
              >
                {link.name}
              </a>
              {idx < API_LINKS.length - 1 && <span className="opacity-40">·</span>}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
