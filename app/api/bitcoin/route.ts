import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface LiveBitcoinData {
  price: number;          // EUR
  changePercent24h: number;
  changePercent7d: number;
  marketCap: number;      // EUR
  volume24h: number;      // EUR
  dominance: number;      // %
  fearGreedIndex: number; // 0–100
  fearGreedLabel: string;
  lastUpdated: string;
  ok: boolean;
}

async function fetchCoinGecko(): Promise<{ price: number; change24h: number; change7d: number; marketCap: number; volume: number } | null> {
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur&include_24hr_change=true&include_7d_change=true&include_market_cap=true&include_24hr_vol=true';
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'market-operator-ai/1.0', Accept: 'application/json' },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const btc = data?.bitcoin;
    if (!btc) return null;
    return {
      price: btc.eur ?? 0,
      change24h: btc.eur_24h_change ?? 0,
      change7d: btc.eur_7d_change ?? 0,
      marketCap: btc.eur_market_cap ?? 0,
      volume: btc.eur_24h_vol ?? 0,
    };
  } catch {
    return null;
  }
}

async function fetchFearGreed(): Promise<{ value: number; label: string } | null> {
  try {
    const res = await fetch('https://api.alternative.me/fng/?limit=1', {
      headers: { 'User-Agent': 'market-operator-ai/1.0', Accept: 'application/json' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const item = data?.data?.[0];
    if (!item) return null;
    return { value: parseInt(item.value, 10), label: item.value_classification };
  } catch {
    return null;
  }
}

async function fetchDominance(): Promise<number | null> {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/global', {
      headers: { 'User-Agent': 'market-operator-ai/1.0', Accept: 'application/json' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.market_cap_percentage?.btc ?? null;
  } catch {
    return null;
  }
}

export async function GET() {
  const [cgData, fgData, domData] = await Promise.all([
    fetchCoinGecko(),
    fetchFearGreed(),
    fetchDominance(),
  ]);

  const result: LiveBitcoinData = {
    price: cgData?.price ?? 0,
    changePercent24h: cgData?.change24h ?? 0,
    changePercent7d: cgData?.change7d ?? 0,
    marketCap: cgData?.marketCap ?? 0,
    volume24h: cgData?.volume ?? 0,
    dominance: domData ?? 0,
    fearGreedIndex: fgData?.value ?? 50,
    fearGreedLabel: fgData?.label ?? 'Neutral',
    lastUpdated: new Date().toISOString(),
    ok: !!(cgData && cgData.price > 0),
  };

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
