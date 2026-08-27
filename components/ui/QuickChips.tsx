'use client';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';

const CHIPS = [
  { key: 'chip_calculator', query: 'calculator', icon: '🧮' },
  { key: 'chip_weather',    query: 'weather in Delhi', icon: '⛅' },
  { key: 'chip_dictionary', query: 'define cosmos', icon: '📖' },
  { key: 'chip_timer',      query: 'timer 5 minutes', icon: '⏱️' },
  { key: 'chip_currency',   query: '100 USD to INR', icon: '💱' },
  { key: 'chip_qr',         query: 'qr code', icon: '🔲' },
  { key: 'chip_password',   query: 'password generator', icon: '🔐' },
  { key: 'chip_color',      query: 'color picker', icon: '🎨' },
];

export function QuickChips() {
  const router = useRouter();
  const { t, lang } = useLanguage();

  const go = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}&lang=${lang}&tab=all`);
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-5">
      {CHIPS.map((chip) => (
        <button
          key={chip.key}
          onClick={() => go(chip.query)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
            bg-surface-2 border border-border text-text-secondary
            hover:bg-surface-3 hover:text-text-primary hover:border-accent
            transition-all duration-150 hover:scale-105 active:scale-95"
        >
          <span>{chip.icon}</span>
          <span>{t(chip.key)}</span>
        </button>
      ))}
    </div>
  );
}
