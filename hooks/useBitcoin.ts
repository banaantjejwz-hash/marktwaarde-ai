'use client';

import { useState, useEffect, useRef } from 'react';
import type { LiveBitcoinData } from '@/app/api/bitcoin/route';

export type { LiveBitcoinData };

export function useBitcoin() {
  const [data, setData] = useState<LiveBitcoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  async function fetchBitcoin() {
    try {
      const res = await fetch('/api/bitcoin', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result: LiveBitcoinData = await res.json();
      if (mounted.current && result.ok) {
        setData(result);
        setError(null);
      }
    } catch {
      if (mounted.current) setError('Bitcoin data tijdelijk niet beschikbaar');
    } finally {
      if (mounted.current) setLoading(false);
    }
  }

  useEffect(() => {
    mounted.current = true;
    fetchBitcoin();
    const id = setInterval(fetchBitcoin, 5 * 60_000); // every 5 min
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error };
}
