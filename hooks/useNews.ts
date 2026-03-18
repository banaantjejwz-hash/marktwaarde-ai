'use client';

import { useState, useEffect, useRef } from 'react';
import type { NewsItem } from '@/lib/types';

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  async function fetchNews() {
    try {
      const res = await fetch('/api/news', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: NewsItem[] = await res.json();
      if (mounted.current) {
        setNews(data);
        setError(null);
      }
    } catch {
      if (mounted.current) setError('Nieuws tijdelijk niet beschikbaar');
    } finally {
      if (mounted.current) setLoading(false);
    }
  }

  useEffect(() => {
    mounted.current = true;
    fetchNews();
    const id = setInterval(fetchNews, 5 * 60_000); // every 5 min
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { news, loading, error };
}
