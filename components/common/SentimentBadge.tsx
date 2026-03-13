import type { Sentiment } from '@/lib/types';

interface SentimentBadgeProps {
  sentiment: Sentiment;
}

const config: Record<
  Sentiment,
  { bg: string; text: string; border: string; label: string }
> = {
  bullish: {
    bg: 'bg-emerald-400/20',
    text: 'text-emerald-400',
    border: 'border-emerald-400/30',
    label: 'Bullish',
  },
  bearish: {
    bg: 'bg-red-400/20',
    text: 'text-red-400',
    border: 'border-red-400/30',
    label: 'Bearish',
  },
  neutraal: {
    bg: 'bg-slate-400/20',
    text: 'text-slate-400',
    border: 'border-slate-400/30',
    label: 'Neutraal',
  },
};

export default function SentimentBadge({ sentiment }: SentimentBadgeProps) {
  const { bg, text, border, label } = config[sentiment];

  return (
    <span
      className={`inline-flex items-center text-xs px-2 py-0.5 rounded border font-medium
                  ${bg} ${text} ${border}`}
    >
      {label}
    </span>
  );
}
