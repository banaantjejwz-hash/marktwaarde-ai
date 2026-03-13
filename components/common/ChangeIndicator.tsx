interface ChangeIndicatorProps {
  value: number;
  showAbsolute?: boolean;
  absoluteValue?: number;
  currency?: string;
}

function formatAbsolute(value: number, currency = 'USD'): string {
  const sign = value >= 0 ? '+' : '';
  try {
    return (
      sign +
      new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    );
  } catch {
    return `${sign}${value.toFixed(2)}`;
  }
}

function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export default function ChangeIndicator({
  value,
  showAbsolute = false,
  absoluteValue,
  currency = 'USD',
}: ChangeIndicatorProps) {
  if (value === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-slate-400 tabular-nums text-sm">
        <span>—</span>
        <span>0.00%</span>
      </span>
    );
  }

  const isPositive = value > 0;
  const colorClass = isPositive ? 'text-emerald-400' : 'text-red-400';
  const arrow = isPositive ? '↑' : '↓';

  return (
    <span
      className={`inline-flex items-center gap-1 tabular-nums text-sm font-medium ${colorClass}`}
    >
      <span className="text-xs leading-none" aria-hidden="true">
        {arrow}
      </span>
      <span>{formatPercent(value)}</span>
      {showAbsolute && absoluteValue !== undefined && (
        <span className="text-xs opacity-75">
          ({formatAbsolute(absoluteValue, currency)})
        </span>
      )}
    </span>
  );
}
