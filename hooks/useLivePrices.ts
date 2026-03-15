'use client';

import { useState, useEffect, useRef } from 'react';
import type { LivePriceResult } from '@/app/api/prices/route';

export type { LivePriceResult };
export type LivePrices = Record<string, LivePriceResult>;

export function useLivePrices() {
  const [prices, setPrices] = useState<LivePrices>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  async function fetchPrices() {
    try {
      const res = await fetch('/api/prices', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: LivePrices = await res.json();
      if (mounted.current) {
        setPrices(data);
        setError(null);
      }
    } catch {
      if (mounted.current) setError('Koersen tijdelijk niet beschikbaar');
    } finally {
      if (mounted.current) setLoading(false);
    }
  }

  useEffect(() => {
    mounted.current = true;
    fetchPrices();
    // Refresh every 60 seconds
    const id = setInterval(fetchPrices, 60_000);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { prices, loading, error };
}
