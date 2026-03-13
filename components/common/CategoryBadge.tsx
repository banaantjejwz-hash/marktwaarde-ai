import type { AssetCategory } from '@/lib/types';

interface CategoryBadgeProps {
  category: AssetCategory;
  size?: 'sm' | 'md';
}

const config: Record<
  AssetCategory,
  { bg: string; text: string; border: string; label: string }
> = {
  aandeel: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border border-blue-500/30',
    label: 'Aandeel',
  },
  etf: {
    bg: 'bg-violet-500/20',
    text: 'text-violet-400',
    border: 'border border-violet-500/30',
    label: 'ETF',
  },
  bitcoin: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border border-amber-500/30',
    label: 'Bitcoin',
  },
};

export default function CategoryBadge({
  category,
  size = 'sm',
}: CategoryBadgeProps) {
  const { bg, text, border, label } = config[category];

  const sizeClasses =
    size === 'sm'
      ? 'text-xs px-2 py-0.5 rounded'
      : 'text-sm px-2.5 py-1 rounded-md';

  return (
    <span
      className={`inline-flex items-center font-medium ${bg} ${text} ${border} ${sizeClasses}`}
    >
      {label}
    </span>
  );
}
