import { NextRequest, NextResponse } from 'next/server';
import { getWeatherLabel } from '@/lib/utils';

export const runtime = 'edge';

// Geocoding via Open-Meteo (no key needed)
async function geocode(city: string): Promise<{ lat: number; lon: number; name: string } | null> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const res  = await fetch(url, { next: { revalidate: 3600 } });
  const data = await res.json() as { results?: Array<{ latitude: number; longitude: number; name: string }> };
  const r    = data.results?.[0];
  if (!r) return null;
  return { lat: r.latitude, lon: r.longitude, name: r.name };
}

export async function GET(req: NextRequest) {
  const city = new URL(req.url).searchParams.get('city') ?? 'Delhi';
  try {
    const geo = await geocode(city);
    if (!geo) return NextResponse.json({ error: 'City not found' }, { status: 404 });

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${geo.lat}&longitude=${geo.lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;
    const res        = await fetch(weatherUrl, { next: { revalidate: 300 } });
    const w          = await res.json() as {
      current?: {
        temperature_2m?: number; apparent_temperature?: number;
        relative_humidity_2m?: number; wind_speed_10m?: number; weather_code?: number;
      };
      daily?: {
        time?: string[]; weather_code?: number[];
        temperature_2m_max?: number[]; temperature_2m_min?: number[];
      };
    };

    const cur = w.current ?? {};
    return NextResponse.json({
      city:        geo.name,
      temperature: Math.round(cur.temperature_2m ?? 0),
      feelsLike:   Math.round(cur.apparent_temperature ?? 0),
      humidity:    cur.relative_humidity_2m ?? 0,
      windspeed:   cur.wind_speed_10m ?? 0,
      weatherCode: cur.weather_code ?? 0,
      description: getWeatherLabel(cur.weather_code ?? 0),
      daily: {
        dates:    w.daily?.time ?? [],
        maxTemps: (w.daily?.temperature_2m_max ?? []).map(Math.round),
        minTemps: (w.daily?.temperature_2m_min ?? []).map(Math.round),
        codes:    w.daily?.weather_code ?? [],
      },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
