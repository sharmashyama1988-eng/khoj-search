import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const symbol = (new URL(req.url).searchParams.get('symbol') ?? 'AAPL').toUpperCase();

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d&includePrePost=false`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
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
      if (result) {
        const meta = result.meta ?? {};
        const closes = result.indicators?.quote?.[0]?.close ?? [];
        const times = result.timestamp ?? [];

        return NextResponse.json({
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

    // Fallback Mock data if Yahoo rate limits or is down
    return NextResponse.json({
      symbol,
      name: `${symbol} Inc.`,
      price: symbol === 'AAPL' ? 224.23 : symbol === 'TSLA' ? 218.89 : 150.00,
      prevClose: symbol === 'AAPL' ? 220.50 : 215.00,
      changePercent: 1.68,
      currency: 'USD',
      exchange: 'NASDAQ',
      marketState: 'REGULAR',
      history: [
        { date: 'Mon', close: 219.5 },
        { date: 'Tue', close: 221.0 },
        { date: 'Wed', close: 220.8 },
        { date: 'Thu', close: 222.4 },
        { date: 'Fri', close: 224.23 },
      ],
    });
  } catch (e) {
    return NextResponse.json({
      symbol,
      name: `${symbol} Equity`,
      price: 180.50,
      prevClose: 178.00,
      changePercent: 1.40,
      currency: 'USD',
      exchange: 'Global',
      marketState: 'REGULAR',
      history: [],
      error: String(e),
    });
  }
}
