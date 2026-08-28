import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const symbol = (new URL(req.url).searchParams.get('symbol') ?? 'AAPL').toUpperCase();

  try {
    const endpoints = [
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d&includePrePost=false`,
      `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d&includePrePost=false`,
    ];

    for (const url of endpoints) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' },
          signal: controller.signal,
          next: { revalidate: 60 },
        });
        clearTimeout(timer);

        if (res.ok) {
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
            };
          };

          const result = data.chart?.result?.[0];
          if (result && result.meta?.regularMarketPrice) {
            const meta = result.meta ?? {};
            const closes = result.indicators?.quote?.[0]?.close ?? [];
            const times = result.timestamp ?? [];

            return NextResponse.json({
              status: 'success',
              symbol: meta.symbol ?? symbol,
              name: meta.longName ?? symbol,
              price: meta.regularMarketPrice ?? 0,
              prevClose: meta.previousClose ?? 0,
              changePercent: meta.regularMarketChangePercent ?? 0,
              currency: meta.currency ?? 'USD',
              exchange: meta.exchangeName ?? 'NASDAQ',
              marketState: meta.marketState ?? 'REGULAR',
              history: times.slice(-5).map((t, i) => ({
                date: new Date(t * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                close: closes.slice(-5)[i] ?? 0,
              })).filter((d) => d.close > 0),
            });
          }
        }
      } catch {}
    }

    return NextResponse.json({
      error: `Live market rate temporarily unreachable for ${symbol}`,
      symbol,
    }, { status: 404 });
  } catch (e) {
    return NextResponse.json({
      error: String(e),
      symbol,
    }, { status: 500 });
  }
}
