'use client';
import { useEffect, useState } from 'react';
import type { VideoResult } from '@/types';

interface Props {
  query: string;
}

export function VideosTab({ query }: Props) {
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<VideoResult | null>(null);

  useEffect(() => {
    if (!query) return;
    setLoading(true);

    fetch(`/api/videos?q=${encodeURIComponent(query)}&limit=18`)
      .then((r) => r.json())
      .then((data: { results?: VideoResult[] }) => {
        setVideos(data.results || []);
      })
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, [query]);

  // Handle escape key to close video modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveVideo(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-surface-2 overflow-hidden animate-pulse">
            <div className="aspect-video w-full bg-surface-3" />
            <div className="p-3.5 space-y-2">
              <div className="h-4 w-3/4 bg-surface-3 rounded" />
              <div className="h-3 w-1/2 bg-surface-3 rounded" />
              <div className="h-3 w-1/3 bg-surface-3 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="text-center py-16 text-text-muted">
        <div className="text-4xl mb-3">🎥</div>
        <p className="text-base font-medium">No videos found for &ldquo;{query}&rdquo;</p>
        <p className="text-xs text-text-muted/80 mt-1">Try another keyword or broader search term.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
        {videos.map((vid) => (
          <div
            key={vid.id}
            onClick={() => setActiveVideo(vid)}
            className="group relative rounded-2xl border border-border/70 bg-surface-2/90 overflow-hidden
              hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-200 cursor-pointer flex flex-col"
          >
            {/* Thumbnail Box */}
            <div className="relative aspect-video w-full bg-black/40 overflow-hidden">
              <img
                src={vid.thumbnail}
                alt={vid.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${vid.videoId}/hqdefault.jpg`;
                }}
              />

              {/* Red Play Overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center
                  shadow-lg transform group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 ml-0.5 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Duration Badge */}
              {vid.duration && (
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[11px] font-semibold tracking-wide backdrop-blur-sm">
                  {vid.duration}
                </span>
              )}

              {/* YouTube Tag */}
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                YouTube
              </span>
            </div>

            {/* Video Meta */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-sm line-clamp-2 text-text-primary group-hover:text-red-400 transition-colors leading-snug">
                  {vid.title}
                </h3>
                {vid.channelTitle && (
                  <p className="text-xs text-text-secondary mt-1.5 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {vid.channelTitle}
                  </p>
                )}
              </div>

              {/* Stats Bar */}
              <div className="flex items-center gap-2 mt-3 text-[11px] text-text-muted border-t border-border/40 pt-2">
                {vid.views && <span>{vid.views}</span>}
                {vid.views && vid.publishedAt && <span>•</span>}
                {vid.publishedAt && <span>{vid.publishedAt}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive YouTube Embed Video Modal */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveVideo(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-surface-1 border border-border/80 rounded-2xl overflow-hidden shadow-2xl animate-scale-in"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60 bg-surface-2">
              <div className="flex items-center gap-2 min-w-0 pr-4">
                <span className="px-2 py-0.5 rounded bg-red-600 text-white text-xs font-bold">YouTube</span>
                <h3 className="font-semibold text-sm text-text-primary truncate">{activeVideo.title}</h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={activeVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-surface-3 hover:bg-surface-4 text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
                >
                  <span>Open on YouTube</span>
                  <span>↗</span>
                </a>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-3 transition-colors"
                  aria-label="Close video"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Video Iframe Container */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={activeVideo.embedUrl}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Modal Footer Info */}
            <div className="p-4 bg-surface-2 flex items-center justify-between text-xs text-text-secondary">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text-primary">{activeVideo.channelTitle}</span>
                {activeVideo.views && <span>• {activeVideo.views}</span>}
                {activeVideo.publishedAt && <span>• {activeVideo.publishedAt}</span>}
              </div>
              <span className="text-[11px] text-text-muted">Press ESC or click outside to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
