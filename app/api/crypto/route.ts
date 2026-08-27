import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const COIN_IDS: Record<string, string> = {
  bitcoin: 'bitcoin', btc: 'bitcoin',
  ethereum: 'ethereum', eth: 'ethereum',
  solana: 'solana', sol: 'solana',
  dogecoin: 'dogecoin', doge: 'dogecoin',
  binancecoin: 'binancecoin', bnb: 'binancecoin',
  cardano: 'cardano', ada: 'cardano',
  ripple: 'ripple', xrp: 'ripple',
  litecoin: 'litecoin', ltc: 'litecoin',
  polkadot: 'polkadot', dot: 'polkadot',
  avalanche: 'avalanche-2', avax: 'avalanche-2',
  shiba: 'shiba-inu', shib: 'shiba-inu',
  matic: 'matic-network', polygon: 'matic-network',
};

export async function GET(req: NextRequest) {
  const coin = new URL(req.url).searchParams.get('coin') ?? 'bitcoin';
  const id   = COIN_IDS[coin.toLowerCase()] ?? coin.toLowerCase();

  try {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${id}&order=market_cap_desc&sparkline=false`;
    const res  = await fetch(url, { next: { revalidate: 60 } });
    const data = await res.json() as Array<{
      id: string; name: string; symbol: string;
      current_price: number; price_change_percentage_24h: number;
      market_cap: number; total_volume: number; image: string;
    }>;

    if (!data.length) return NextResponse.json({ error: 'Coin not found' }, { status: 404 });
    const c = data[0];
    return NextResponse.json({
      id:        c.id,
      name:      c.name,
      symbol:    c.symbol.toUpperCase(),
      price:     c.current_price,
      change24h: c.price_change_percentage_24h,
      marketCap: c.market_cap,
      volume24h: c.total_volume,
      image:     c.image,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
