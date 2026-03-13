'use client';

import { useEffect, useState } from 'react';
import { getCurrentMarketSession } from '@/lib/utils';
import type { MarketSessionInfo } from '@/lib/types';

function formatDutchDate(date: Date): string {
  return date.toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatClock(date: Date): string {
  return date.toLocaleTimeString('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

interface SessionBadgeProps {
  info: MarketSessionInfo;
}

function SessionBadge({ info }: SessionBadgeProps) {
  const config: Record<
    string,
    { bg: string; text: string; dot: string; pulse: boolean }
  > = {
    open: {
      bg: 'bg-emerald-500/10 border border-emerald-500/30',
      text: 'text-emerald-400',
      dot: 'bg-green-400',
      pulse: true,
    },
    'pre-market': {
      bg: 'bg-yellow-500/10 border border-yellow-500/30',
      text: 'text-yellow-400',
      dot: 'bg-yellow-400',
      pulse: false,
    },
    'after-hours': {
      bg: 'bg-blue-500/10 border border-blue-500/30',
      text: 'text-blue-400',
      dot: 'bg-blue-400',
      pulse: false,
    },
    gesloten: {
      bg: 'bg-slate-700/30 border border-slate-700',
      text: 'text-slate-400',
      dot: 'bg-slate-500',
      pulse: false,
    },
    weekend: {
      bg: 'bg-slate-700/30 border border-slate-700',
      text: 'text-slate-400',
      dot: 'bg-slate-500',
      pulse: false,
    },
  };

  const style = config[info.session] ?? config['gesloten'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium ${style.bg} ${style.text}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot} ${
          style.pulse ? 'animate-pulse' : ''
        }`}
      />
      {info.label}
    </span>
  );
}

export default function MarketStatusBar() {
  // `mounted` guards all time-dependent output from SSR.
  // Server renders a stable skeleton; client populates after hydration.
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const [sessionInfo, setSessionInfo] = useState<MarketSessionInfo | null>(null);

  useEffect(() => {
    const tick = () => {
      const next = new Date();
      setNow(next);
      setSessionInfo(getCurrentMarketSession());
    };
    tick(); // populate immediately on mount
    setMounted(true);
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 md:left-[220px] h-12 z-20
                 bg-[#111827] border-b border-[#1e2d45]
                 flex items-center px-4 gap-4"
      aria-label="Marktstatus"
    >
      {/* Clock — hidden until mounted to prevent hydration mismatch */}
      <span className="text-xs font-mono text-slate-300 tabular-nums flex-shrink-0 min-w-[60px]">
        {mounted && now ? formatClock(now) : <span className="opacity-0">00:00:00</span>}
      </span>

      {/* Date */}
      <span className="text-xs text-slate-500 hidden sm:block flex-shrink-0 capitalize min-w-[160px]">
        {mounted && now ? formatDutchDate(now) : ''}
      </span>

      {/* Divider */}
      <span className="hidden sm:block w-px h-4 bg-slate-700 flex-shrink-0" />

      {/* Session badge — stable fallback until mounted */}
      {mounted && sessionInfo ? (
        <SessionBadge info={sessionInfo} />
      ) : (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-slate-700/30 border border-slate-700 text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          Laden…
        </span>
      )}

      {/* Mock data badge */}
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs text-slate-500 bg-slate-800 border border-slate-700 flex-shrink-0">
        Voorbeelddata
      </span>

      {/* Spacer */}
      <span className="flex-1" />

      {/* Refresh indicator */}
      <span className="text-xs text-slate-600 hidden md:block flex-shrink-0">
        Ververst 15 min geleden
      </span>

      {/* ET time */}
      <span className="text-xs font-mono text-slate-600 hidden lg:block flex-shrink-0 tabular-nums min-w-[56px]">
        {mounted && sessionInfo ? sessionInfo.usTime : ''}
      </span>
    </header>
  );
}
