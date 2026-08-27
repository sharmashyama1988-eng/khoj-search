'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { getWeatherIcon } from '@/lib/utils';
import type { WeatherData } from '@/types';

interface Props { city: string }

export function WeatherWidget({ city }: Props) {
  const { t } = useLanguage();
  const [data, setData]     = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);
  const [input, setInput]   = useState(city);
  const [search, setSearch] = useState(city);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/weather?city=${encodeURIComponent(search)}`)
      .then((r) => r.json())
      .then((d: WeatherData & { error?: string }) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError('Failed to fetch weather'))
      .finally(() => setLoading(false));
  }, [search]);

  const icon = data ? getWeatherIcon(data.weatherCode) : '🌡️';

  return (
    <div className="rounded-xl border border-border bg-surface-2/80 overflow-hidden w-full animate-fade-in">
      {/* Search city */}
      <div className="px-5 pt-4 pb-3 border-b border-border flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && setSearch(input)}
          placeholder="City name…"
          className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted
            outline-none border-none focus:ring-0"
        />
        <button onClick={() => setSearch(input)}
          className="px-3 py-1 text-xs rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors">
          Go
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-10 text-text-muted text-sm animate-pulse">
          {t('loading')}
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-8 text-red-400 text-sm">{error}</div>
      )}

      {data && !loading && (
        <div>
          {/* Main */}
          <div className="px-5 py-4 flex items-start justify-between">
            <div>
              <p className="text-sm text-text-muted">{t('weather_in')} <span className="font-medium text-text-secondary">{data.city}</span></p>
              <p className="text-5xl font-bold text-text-primary mt-1">{data.temperature}°<span className="text-2xl font-light">C</span></p>
              <p className="text-sm text-text-secondary mt-1">{data.description}</p>
              <div className="flex gap-4 mt-2 text-xs text-text-muted">
                <span>💧 {data.humidity}%</span>
                <span>💨 {data.windspeed} km/h</span>
                <span>🌡️ {t('feels_like')} {data.feelsLike}°C</span>
              </div>
            </div>
            <span className="text-6xl select-none">{icon}</span>
          </div>

          {/* 7-day forecast */}
          <div className="px-5 pb-4 border-t border-border pt-3">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">{t('days_forecast')}</p>
            <div className="grid grid-cols-7 gap-1">
              {data.daily.dates.slice(0, 7).map((date, i) => {
                const day = new Date(date).toLocaleDateString('en', { weekday: 'short' });
                return (
                  <div key={date} className="flex flex-col items-center gap-1 text-xs text-text-muted">
                    <span className="font-medium">{i === 0 ? 'Now' : day}</span>
                    <span className="text-lg">{getWeatherIcon(data.daily.codes[i])}</span>
                    <span className="text-text-primary font-medium">{data.daily.maxTemps[i]}°</span>
                    <span>{data.daily.minTemps[i]}°</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
