'use client';
import { useState } from 'react';
import type { ImageResult } from '@/types';

interface Props { images: ImageResult[] }

export function ImageGrid({ images }: Props) {
  const [selected, setSelected] = useState<ImageResult | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setSelected(img)}
            className="group relative aspect-square rounded-lg overflow-hidden bg-surface-2
              border border-border hover:border-accent/60 hover:scale-[1.02]
              transition-all duration-150 animate-fade-in"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.thumbUrl}
              alt={img.title}
              className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-200"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent
              opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
              <p className="text-white text-xs line-clamp-2 text-left">{img.title}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm"
            >
              ✕ Close
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selected.url} alt={selected.title}
              className="w-full h-full object-contain max-h-[80vh] rounded-lg" />
            <div className="mt-2 text-white/70 text-sm text-center">
              {selected.title} — <span className="text-white/40">{selected.source}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
