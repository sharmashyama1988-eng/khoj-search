'use client';
import { useState, useCallback } from 'react';
import { hexToRgb, rgbToHsl } from '@/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';
import { useLanguage } from '@/hooks/useLanguage';

interface Props { initialColor?: string }

export function ColorPickerWidget({ initialColor = '#6366f1' }: Props) {
  const { t } = useLanguage();
  const [hex, setHex]   = useState(initialColor.startsWith('#') ? initialColor : '#6366f1');
  const [input, setInput] = useState(hex);

  const applyHex = useCallback((value: string) => {
    const clean = value.startsWith('#') ? value : '#' + value;
    setHex(clean);
    setInput(clean);
  }, []);

  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  const swatches = [
    '#ef4444','#f97316','#eab308','#22c55e','#06b6d4',
    '#6366f1','#8b5cf6','#ec4899','#64748b','#1e293b',
    '#ffffff','#000000','#f1f5f9','#fef3c7','#dcfce7',
  ];

  return (
    <div className="rounded-xl border border-border bg-surface-2/80 overflow-hidden w-full animate-fade-in">
      <div className="px-5 pt-4 pb-2">
        <h2 className="text-sm font-semibold text-text-primary mb-4">{t('chip_color')}</h2>

        {/* Color picker */}
        <div className="flex gap-4 items-start">
          <div className="relative">
            <input
              type="color"
              value={hex}
              onChange={(e) => applyHex(e.target.value)}
              className="w-20 h-20 rounded-xl cursor-pointer border-2 border-border bg-transparent p-0.5"
            />
          </div>

          <div className="flex-1 space-y-2">
            {/* HEX input */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted w-10">HEX</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onBlur={() => {
                  const v = input.startsWith('#') ? input : '#' + input;
                  if (/^#[0-9a-f]{6}$/i.test(v)) applyHex(v);
                }}
                className="flex-1 font-mono text-sm px-3 py-1.5 rounded-lg bg-surface border border-border
                  text-text-primary focus:outline-none focus:border-accent uppercase"
              />
              <CopyButton text={hex} />
            </div>

            {/* RGB */}
            {rgb && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted w-10">RGB</span>
                <div className="font-mono text-xs text-text-secondary flex-1 px-3 py-1.5 bg-surface rounded-lg border border-border">
                  {rgb.r}, {rgb.g}, {rgb.b}
                </div>
                <CopyButton text={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
              </div>
            )}

            {/* HSL */}
            {hsl && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted w-10">HSL</span>
                <div className="font-mono text-xs text-text-secondary flex-1 px-3 py-1.5 bg-surface rounded-lg border border-border">
                  {hsl.h}°, {hsl.s}%, {hsl.l}%
                </div>
                <CopyButton text={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
              </div>
            )}
          </div>
        </div>

        {/* Preview bar */}
        <div className="mt-4 h-8 rounded-lg border border-border" style={{ backgroundColor: hex }} />

        {/* Swatches */}
        <div className="mt-3 flex flex-wrap gap-2">
          {swatches.map((swatch) => (
            <button
              key={swatch}
              onClick={() => applyHex(swatch)}
              className="w-7 h-7 rounded-md border-2 transition-all hover:scale-110 active:scale-95"
              style={{ backgroundColor: swatch, borderColor: swatch === hex ? 'var(--accent)' : 'var(--border)' }}
              title={swatch}
            />
          ))}
        </div>
      </div>

      <div className="px-5 py-3 mt-2 bg-surface border-t border-border text-xs text-text-muted text-center">
        Click the square to open native color picker
      </div>
    </div>
  );
}
