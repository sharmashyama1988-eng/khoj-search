'use client';
import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';
import { truncate } from '@/lib/utils';
import type { WikiPanel as WikiPanelType } from '@/types';

interface Props { panel: WikiPanelType }

export function WikiPanel({ panel }: Props) {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border border-border bg-surface-2/50 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-border">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-1">{t('knowledge_panel')}</p>
        <h2 className="text-lg font-bold text-text-primary">{panel.title}</h2>
      </div>

      {/* Image */}
      {panel.image && (
        <div className="relative w-full h-52 bg-surface-3">
          <Image
            src={panel.image}
            alt={panel.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 380px"
            unoptimized
          />
        </div>
      )}

      {/* Description */}
      <div className="px-5 py-4 space-y-3">
        <p className="text-sm text-text-secondary leading-relaxed">
          {truncate(panel.description, 400)}
        </p>

        {/* Facts */}
        {panel.facts && panel.facts.length > 0 && (
          <div className="border-t border-border pt-3 space-y-2">
            {panel.facts.map((f) => (
              <div key={f.label} className="flex justify-between gap-2 text-sm">
                <span className="text-text-muted font-medium">{f.label}</span>
                <span className="text-text-primary text-right">{f.value}</span>
              </div>
            ))}
          </div>
        )}

        <a
          href={panel.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
        >
          {t('read_more')}
        </a>
      </div>
    </div>
  );
}
