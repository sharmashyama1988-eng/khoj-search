'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface Props { place: string }

interface GeoData { lat: number; lon: number; displayName: string }

export function MapWidget({ place }: Props) {
  const { t } = useLanguage();
  const [geo, setGeo]     = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState(place);
  const [search, setSearch] = useState(place);

  useEffect(() => {
    if (!search) return;
    setLoading(true);
    setError(null);
    fetch(`/api/geocode?q=${encodeURIComponent(search)}`)
      .then((r) => r.json())
      .then((d: GeoData & { error?: string }) => {
        if (d.error) setError(d.error);
        else setGeo(d);
      })
      .catch(() => setError('Failed to load location'))
      .finally(() => setLoading(false));
  }, [search]);

  const zoom = 13;
  const delta = 0.05;

  // OpenStreetMap embed URL (100% free, no API key)
  const mapUrl = geo
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${geo.lon - delta},${geo.lat - delta},${geo.lon + delta},${geo.lat + delta}&layer=mapnik&marker=${geo.lat},${geo.lon}`
    : null;

  const osmLink = geo
    ? `https://www.openstreetmap.org/?mlat=${geo.lat}&mlon=${geo.lon}&zoom=${zoom}`
    : null;

  return (
    <div className="rounded-xl border border-border bg-surface-2/80 overflow-hidden w-full animate-fade-in">
      {/* Search bar */}
      <div className="px-4 py-3 border-b border-border flex gap-2 items-center">
        <span className="text-lg">🗺️</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && setSearch(input)}
          placeholder="Search place or city…"
          className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted outline-none"
        />
        <button onClick={() => setSearch(input)}
          className="px-3 py-1 text-xs rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors">
          Go
        </button>
      </div>

      {/* Place name */}
      {geo && (
        <div className="px-4 py-2 border-b border-border">
          <p className="text-sm font-medium text-text-primary truncate">{geo.displayName}</p>
          <p className="text-xs text-text-muted">
            {geo.lat.toFixed(4)}°N, {geo.lon.toFixed(4)}°E
          </p>
        </div>
      )}

      {/* Map iframe */}
      {loading && (
        <div className="h-64 bg-surface-3 animate-pulse flex items-center justify-center text-text-muted text-sm">
          Loading map…
        </div>
      )}
      {error && !loading && (
        <div className="h-32 flex items-center justify-center text-red-400 text-sm">{error}</div>
      )}
      {mapUrl && !loading && (
        <iframe
          src={mapUrl}
          className="w-full h-72 border-none"
          title={`Map of ${search}`}
          loading="lazy"
          allowFullScreen
        />
      )}

      {/* OSM link */}
      {osmLink && !loading && (
        <div className="px-4 py-2 border-t border-border flex justify-between items-center">
          <span className="text-xs text-text-muted">© OpenStreetMap contributors</span>
          <a href={osmLink} target="_blank" rel="noopener noreferrer"
            className="text-xs text-accent hover:underline">
            Open full map →
          </a>
        </div>
      )}
    </div>
  );
}
