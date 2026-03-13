import type { TradeabilityState } from '@/lib/types';

interface TradeabilityBadgeProps {
  state: TradeabilityState;
}

const config: Record<
  TradeabilityState,
  { bg: string; text: string; border: string; label: string }
> = {
  actionable: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    label: 'Uitvoerbaar',
  },
  'bevestiging-nodig': {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    label: 'Bevestiging nodig',
  },
  vermijden: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/30',
    label: 'Vermijden',
  },
  'alleen-observeren': {
    bg: 'bg-slate-700/50',
    text: 'text-slate-400',
    border: 'border-slate-600',
    label: 'Observeren',
  },
};

export default function TradeabilityBadge({ state }: TradeabilityBadgeProps) {
  const { bg, text, border, label } = config[state];

  return (
    <span
      className={`inline-flex items-center text-xs px-2 py-0.5 rounded border font-medium
                  ${bg} ${text} ${border}`}
    >
      {label}
    </span>
  );
}
