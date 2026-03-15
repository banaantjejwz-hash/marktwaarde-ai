import yahooFinance from 'yahoo-finance2';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Symbol map: internal key → display metadata (currency overrides Yahoo's native currency)
const SYMBOLS: Record<string, { currency: string; displayType: 'price' | 'points' }> = {
  '^GSPC':   { currency: 'POINTS', displayType: 'points' },  // S&P 500
  '^NDX':    { currency: 'POINTS', displayType: 'points' },  // Nasdaq 100
  '^GDAXI':  { currency: 'POINTS', displayType: 'points' },  // DAX
  'BTC-EUR': { currency: 'EUR',    displayType: 'price'  },  // Bitcoin in EUR
  'NVDA':    { currency: 'USD',    displayType: 'price'  },
  'AAPL':    { currency: 'USD',    displayType: 'price'  },
  'SPY':     { currency: 'USD',    displayType: 'price'  },
  'QQQ':     { currency: 'USD',    displayType: 'price'  },
};

export interface LivePriceResult {
  price: number;
  changePercent: number;
  changeAbsolute: number;
  currency: string;
  displayType: 'price' | 'points';
  lastUpdated: string;
  ok: boolean;
}

export async function GET() {
  const now = new Date().toISOString();

  const results = await Promise.allSettled(
    Object.keys(SYMBOLS).map(async (symbol) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const quote: any = await yahooFinance.quote(symbol);
      const meta = SYMBOLS[symbol];
      return {
        symbol,
        data: {
          price: (quote.regularMarketPrice as number) ?? 0,
          changePercent: (quote.regularMarketChangePercent as number) ?? 0,
          changeAbsolute: (quote.regularMarketChange as number) ?? 0,
          currency: meta.currency,
          displayType: meta.displayType,
          lastUpdated: now,
          ok: true,
        } satisfies LivePriceResult,
      };
    })
  );

  const data: Record<string, LivePriceResult> = {};
  for (const result of results) {
    if (result.status === 'fulfilled') {
      data[result.value.symbol] = result.value.data;
    }
  }

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
