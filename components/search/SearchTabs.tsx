'use client';
import { useLanguage } from '@/hooks/useLanguage';
import type { SearchTab } from '@/types';

interface Props {
  activeTab: SearchTab;
  onTabChange: (tab: SearchTab) => void;
}

const TABS: { id: SearchTab; labelKey: string; icon: string }[] = [
  { id: 'all',      labelKey: 'tab_all',      icon: '🔍' },
  { id: 'images',   labelKey: 'tab_images',   icon: '🖼️' },
  { id: 'code',     labelKey: 'tab_code',     icon: '💻' },
  { id: 'research', labelKey: 'tab_research', icon: '🔬' },
  { id: 'books',    labelKey: 'tab_books',    icon: '📚' },
];

export function SearchTabs({ activeTab, onTabChange }: Props) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-px scrollbar-none">
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium
              whitespace-nowrap transition-all duration-150 shrink-0
              ${isActive
                ? 'bg-accent text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
              }`}
          >
            <span className="text-sm">{tab.icon}</span>
            <span>{t(tab.labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
