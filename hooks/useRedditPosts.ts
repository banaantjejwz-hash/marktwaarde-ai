'use client';

import { useState, useEffect, useRef } from 'react';
import type { SocialsData } from '@/lib/types';

export function useRedditPosts() {
  const [data, setData] = useState<SocialsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  async function fetchPosts() {
    try {
      const res = await fetch('/api/reddit', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result: SocialsData = await res.json();
      if (mounted.current) {
        setData(result);
        setError(null);
      }
    } catch {
      if (mounted.current) setError('Community posts tijdelijk niet beschikbaar');
    } finally {
      if (mounted.current) setLoading(false);
    }
  }

  useEffect(() => {
    mounted.current = true;
    fetchPosts();
    const id = setInterval(fetchPosts, 10 * 60_000); // every 10 min
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error };
}
