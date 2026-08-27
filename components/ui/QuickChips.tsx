'use client';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';

const CHIPS = [
  { key: 'chip_calculator', query: 'calculator',         icon: '🧮' },
  { key: 'chip_weather',    query: 'weather in Delhi',   icon: '⛅' },
  { key: 'chip_dictionary', query: 'define cosmos',      icon: '📖' },
  { key: 'chip_timer',      query: 'timer 5 minutes',    icon: '⏱️' },
  { key: 'chip_currency',   query: '100 USD to INR',     icon: '💱' },
  { key: 'chip_qr',         query: 'qr code',            icon: '🔲' },
  { key: 'chip_password',   query: 'password generator', icon: '🔐' },
  { key: 'chip_color',      query: 'color picker',       icon: '🎨' },
  { key: 'chip_map',        query: 'map of Paris',       icon: '🗺️' },
  { key: 'chip_stock',      query: 'AAPL stock',         icon: '📈' },
  { key: 'chip_code',       query: 'code runner',        icon: '💻' },
  { key: 'chip_regex',      query: 'regex tool',         icon: '🔤' },
];

export function QuickChips() {
  const router = useRouter();
  const { t, lang } = useLanguage();

  const go = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}&lang=${lang}&tab=all`);
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-6 max-w-3xl mx-auto px-2">
      {CHIPS.map((chip) => {
        const label = t(chip.key) || chip.key.replace('chip_', '').replace('_', ' ');
        return (
          <button
            key={chip.key}
            onClick={() => go(chip.query)}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium
              bg-surface-2/80 backdrop-blur-md border border-border/80 text-text-secondary
              hover:bg-surface-3 hover:text-text-primary hover:border-accent/60 hover:shadow-md hover:shadow-accent/10
              transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer select-none"
          >
            <span className="text-sm group-hover:scale-110 transition-transform">{chip.icon}</span>
            <span className="capitalize">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
