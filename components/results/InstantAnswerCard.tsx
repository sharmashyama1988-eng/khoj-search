'use client';

import { useState } from 'react';
import type { InstantAnswerResponse } from '@/app/api/instant/route';

interface Props {
  data: InstantAnswerResponse;
  onTopicClick?: (query: string) => void;
}

export function InstantAnswerCard({ data, onTopicClick }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (!data.found || (!data.abstract && (!data.relatedTopics || data.relatedTopics.length === 0))) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-surface-2/90 backdrop-blur-md p-5 shadow-lg transition-all hover:border-primary/40 hover:shadow-xl mb-6">
      {/* Decorative Top Gradient Highlight */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="flex flex-col md:flex-row gap-5 items-start">
        {/* Entity Image */}
        {data.image && (
          <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-surface-3 border border-border/50 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.image}
              alt={data.heading || 'Knowledge Image'}
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLElement).parentElement!.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/25 text-[11px] font-semibold uppercase tracking-wide">
              ⚡ Instant Fact
            </span>
            {data.entityType && (
              <span className="px-2 py-0.5 rounded-md bg-surface-3 text-text-muted text-[11px] font-medium">
                {data.entityType}
              </span>
            )}
            <span className="text-text-muted text-xs ml-auto">
              Source: <span className="font-semibold text-text-primary">{data.source}</span>
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight mb-2">
            {data.heading}
          </h3>

          {data.abstract && (
            <p className="text-sm text-text-muted leading-relaxed mb-3 line-clamp-4">
              {data.abstract}
            </p>
          )}

          {/* Related topics / Disambiguation chips */}
          {data.relatedTopics && data.relatedTopics.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/40">
              <div className="text-[11px] font-semibold uppercase text-text-muted tracking-wider mb-2">
                Related Meanings & Topics:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(expanded ? data.relatedTopics : data.relatedTopics.slice(0, 3)).map((topic, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (onTopicClick) onTopicClick(topic.text);
                      else if (topic.url) window.open(topic.url, '_blank', 'noopener,noreferrer');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-surface-3 hover:bg-primary/15 hover:text-primary text-text-secondary text-xs font-medium border border-border/60 transition-all text-left flex items-center gap-1.5 cursor-pointer active:scale-95"
                    title={topic.text}
                  >
                    <span>🔍</span>
                    <span className="line-clamp-1 max-w-[200px]">{topic.text.replace(/\s*\(.*?\)/g, '')}</span>
                  </button>
                ))}

                {data.relatedTopics.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className="px-2 py-1 rounded-lg bg-surface-3/50 hover:bg-surface-3 text-text-muted text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {expanded ? 'Show Less' : `+${data.relatedTopics.length - 3} More`}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Full Link */}
          {data.url && (
            <div className="mt-3">
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
              >
                <span>Read authoritative article on {data.source}</span>
                <span>↗</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}