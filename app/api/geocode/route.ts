import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const place = new URL(req.url).searchParams.get('q') ?? '';
  if (!place) return NextResponse.json({ error: 'Place required' }, { status: 400 });

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1&addressdetails=1`;
    const res  = await fetch(url, {
      headers: { 'User-Agent': 'Khoj-SearchEngine/1.0' },
      next: { revalidate: 3600 },
    });
    const data = await res.json() as Array<{
      lat?: string; lon?: string; display_name?: string;
      type?: string; importance?: number;
    }>;

    if (!data.length) return NextResponse.json({ error: 'Place not found' }, { status: 404 });

    const loc = data[0];
    return NextResponse.json({
      lat:         parseFloat(loc.lat ?? '0'),
      lon:         parseFloat(loc.lon ?? '0'),
      displayName: loc.display_name ?? place,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
