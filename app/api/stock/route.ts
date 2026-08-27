import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const symbol = new URL(req.url).searchParams.get('symbol') ?? 'AAPL';

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d&includePrePost=false`;
    const res  = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 60 },
    });

    if (!res.ok) return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });

    const data = await res.json() as {
      chart?: {
        result?: Array<{
          meta?: {
            symbol?: string;
            longName?: string;
            regularMarketPrice?: number;
            previousClose?: number;
            regularMarketChangePercent?: number;
            currency?: string;
            exchangeName?: string;
            marketState?: string;
          };
          timestamp?: number[];
          indicators?: {
            quote?: Array<{ close?: (number | null)[] }>;
          };
        }>;
        error?: { message?: string };
      };
    };

    const result = data.chart?.result?.[0];
    if (!result) return NextResponse.json({ error: 'No data' }, { status: 404 });

    const meta    = result.meta ?? {};
    const closes  = result.indicators?.quote?.[0]?.close ?? [];
    const times   = result.timestamp ?? [];

    return NextResponse.json({
      symbol:        meta.symbol ?? symbol,
      name:          meta.longName ?? symbol,
      price:         meta.regularMarketPrice ?? 0,
      prevClose:     meta.previousClose ?? 0,
      changePercent: meta.regularMarketChangePercent ?? 0,
      currency:      meta.currency ?? 'USD',
      exchange:      meta.exchangeName ?? '',
      marketState:   meta.marketState ?? 'CLOSED',
      history: times.slice(-5).map((t, i) => ({
        date:  new Date(t * 1000).toLocaleDateString(),
        close: closes.slice(-5)[i] ?? null,
      })).filter((d) => d.close !== null),
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
