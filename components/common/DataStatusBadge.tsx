import type { DataStatus } from '@/lib/types';

interface DataStatusBadgeProps {
  status: DataStatus;
  lastUpdated: string;
  showTime?: boolean;
}

interface StatusStyle {
  dot: string;
  text: string;
  bg: string;
  border: string;
  label: string;
  pulse: boolean;
}

const statusConfig: Record<DataStatus, StatusStyle> = {
  live: {
    dot: 'bg-green-400',
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    label: 'Live',
    pulse: true,
  },
  vertraagd: {
    dot: 'bg-yellow-400',
    text: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    label: '15 min vertraagd',
    pulse: false,
  },
  eod: {
    dot: 'bg-orange-400',
    text: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    label: 'Slotkoers',
    pulse: false,
  },
  verouderd: {
    dot: 'bg-red-400',
    text: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    label: 'Verouderd',
    pulse: false,
  },
  mock: {
    dot: 'bg-slate-500',
    text: 'text-slate-500',
    bg: 'bg-slate-700/40',
    border: 'border-slate-700',
    label: 'Voorbeelddata',
    pulse: false,
  },
};

function formatTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export default function DataStatusBadge({
  status,
  lastUpdated,
  showTime = false,
}: DataStatusBadgeProps) {
  const { dot, text, bg, border, label, pulse } = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium
                  ${bg} ${text} border ${border}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot} ${
          pulse ? 'animate-pulse' : ''
        }`}
      />
      {label}
      {showTime && lastUpdated && (
        <span className="text-[10px] opacity-70 ml-0.5">
          {formatTime(lastUpdated)}
        </span>
      )}
    </span>
  );
}
