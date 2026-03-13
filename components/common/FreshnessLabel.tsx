'use client';

import { useEffect, useState } from 'react';
import { getMockRelativeTime } from '@/lib/utils';

interface FreshnessLabelProps {
  lastUpdated: string;
  prefix?: string;
}

function getRelativeTime(isoString: string): string {
  try {
    const rel = getMockRelativeTime(isoString);
    if (rel === 'Zojuist') return 'Zonet bijgewerkt';
    return `Ververst ${rel}`;
  } catch {
    return 'Onbekende tijd';
  }
}

function formatExactTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export default function FreshnessLabel({
  lastUpdated,
  prefix,
}: FreshnessLabelProps) {
  // Start with null to produce identical server/client SSR output.
  // Relative time is computed only after mount (client-only).
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(getRelativeTime(lastUpdated));
    const id = setInterval(() => {
      setLabel(getRelativeTime(lastUpdated));
    }, 30_000);
    return () => clearInterval(id);
  }, [lastUpdated]);

  const exact = formatExactTime(lastUpdated);

  return (
    <span
      className="inline-flex items-center gap-1 text-xs text-slate-500"
      title={`Bijgewerkt om ${exact}`}
    >
      <span aria-hidden="true">&#x23F1;</span>
      <span>
        {prefix ? `${prefix} ` : ''}
        {/* Render stable placeholder on server; real value after hydration */}
        {label ?? `Bijgewerkt om ${exact}`}
      </span>
    </span>
  );
}
