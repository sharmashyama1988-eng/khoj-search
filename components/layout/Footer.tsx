'use client';
import { useLanguage } from '@/hooks/useLanguage';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border py-6 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-text-muted">
        <div className="flex items-center gap-2">
          <span className="font-bold text-text-primary">Khoj</span>
          <span>·</span>
          <span>{t('footer_tagline')}</span>
        </div>
        <span>{t('powered_by')}: Wikipedia · Open-Meteo · CoinGecko · Frankfurter · arXiv · GitHub</span>
      </div>
    </footer>
  );
}
