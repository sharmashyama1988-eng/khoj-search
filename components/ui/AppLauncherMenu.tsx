'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';

const KHOJ_APPS = [
  { key: 'chip_calculator', query: 'calculator',         icon: '🧮', label: 'Calculator' },
  { key: 'chip_weather',    query: 'weather in Delhi',   icon: '⛅', label: 'Weather' },
  { key: 'chip_dictionary', query: 'define cosmos',      icon: '📖', label: 'Dictionary' },
  { key: 'chip_timer',      query: 'timer 5 minutes',    icon: '⏱️', label: 'Timer' },
  { key: 'chip_currency',   query: '100 USD to INR',     icon: '💱', label: 'Currency' },
  { key: 'chip_qr',         query: 'qr code',            icon: '🔲', label: 'QR Code' },
  { key: 'chip_password',   query: 'password generator', icon: '🔐', label: 'Password' },
  { key: 'chip_color',      query: 'color picker',       icon: '🎨', label: 'Color Picker' },
  { key: 'chip_map',        query: 'map of Paris',       icon: '🗺️', label: 'Live Maps' },
  { key: 'chip_stock',      query: 'AAPL stock',         icon: '📈', label: 'Stocks' },
  { key: 'chip_code',       query: 'code runner',        icon: '💻', label: 'Code Sandbox' },
  { key: 'chip_regex',      query: 'regex tool',         icon: '🔤', label: 'RegEx & Base64' },
];

export function AppLauncherMenu() {
  const [open, setOpen] = useState(false);
  const router          = useRouter();
  const { lang, t }     = useLanguage();
  const ref             = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const launchApp = (query: string) => {
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}&lang=${lang}&tab=all`);
  };

  return (
    <div ref={ref} className="relative">
      {/* Google 9-Dot App Launcher Button */}
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open); }}
        className="w-9 h-9 rounded-full flex items-center justify-center
          text-text-secondary hover:text-text-primary hover:bg-surface-3/80
          active:scale-95 transition-all duration-200 cursor-pointer select-none"
        title="Khoj Apps"
        aria-label="Khoj Apps Menu"
      >
        <svg className="w-5 h-5 opacity-90 hover:opacity-100" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      </button>

      {/* Google-style App Grid Popup Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 p-3 rounded-3xl border border-border/80
          bg-surface-2/95 backdrop-blur-2xl shadow-2xl z-50 animate-slide-up">
          <div className="px-2 py-1 mb-2 border-b border-border/40 flex items-center justify-between">
            <span className="text-xs font-semibold text-text-primary">Khoj Apps & Tools</span>
            <span className="text-[10px] text-text-muted">Instant utilities</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {KHOJ_APPS.map((app) => {
              const translatedLabel = t(app.key) || app.label;
              return (
                <button
                  key={app.key}
                  type="button"
                  onClick={() => launchApp(app.query)}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl
                    hover:bg-surface-3/80 transition-all duration-200 group cursor-pointer"
                >
                  <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">
                    {app.icon}
                  </span>
                  <span className="text-[11px] font-medium text-text-secondary group-hover:text-text-primary text-center line-clamp-1">
                    {translatedLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
