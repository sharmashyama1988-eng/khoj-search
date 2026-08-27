import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from   = (searchParams.get('from') ?? 'USD').toUpperCase();
  const to     = (searchParams.get('to')   ?? 'INR').toUpperCase();
  const amount = parseFloat(searchParams.get('amount') ?? '1');

  try {
    const url  = `https://api.frankfurter.app/latest?from=${from}&to=${to}`;
    const res  = await fetch(url, { next: { revalidate: 300 } });
    const data = await res.json() as { rates?: Record<string, number>; date?: string };

    if (!data.rates?.[to]) return NextResponse.json({ error: 'Invalid currencies' }, { status: 400 });

    const rate   = data.rates[to];
    const result = parseFloat((amount * rate).toFixed(4));

    return NextResponse.json({ base: from, target: to, rate, amount, result, date: data.date });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
