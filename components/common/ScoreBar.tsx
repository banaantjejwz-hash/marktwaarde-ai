interface ScoreBarProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md';
}

function getBarColor(score: number): string {
  if (score >= 7.5) return 'bg-emerald-500';
  if (score >= 5) return 'bg-amber-500';
  return 'bg-red-500';
}

function getTextColor(score: number): string {
  if (score >= 7.5) return 'text-emerald-400';
  if (score >= 5) return 'text-amber-400';
  return 'text-red-400';
}

export default function ScoreBar({
  score,
  label,
  size = 'sm',
}: ScoreBarProps) {
  const clampedScore = Math.max(0, Math.min(10, score));
  const widthPercent = (clampedScore / 10) * 100;
  const barHeight = size === 'sm' ? 'h-1' : 'h-1.5';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex flex-col gap-1 w-full">
      {(label !== undefined || true) && (
        <div className={`flex items-center justify-between ${textSize}`}>
          {label && (
            <span className="text-slate-400 truncate mr-2">{label}</span>
          )}
          <span
            className={`font-semibold tabular-nums flex-shrink-0 ml-auto ${getTextColor(
              clampedScore
            )}`}
          >
            {clampedScore.toFixed(1)}
          </span>
        </div>
      )}
      <div className={`w-full ${barHeight} bg-slate-800 rounded-full overflow-hidden`}>
        <div
          className={`${barHeight} rounded-full transition-all duration-500 ${getBarColor(
            clampedScore
          )}`}
          style={{ width: `${widthPercent}%` }}
          role="progressbar"
          aria-valuenow={clampedScore}
          aria-valuemin={0}
          aria-valuemax={10}
          aria-label={label ? `${label}: ${clampedScore.toFixed(1)} van 10` : `Score: ${clampedScore.toFixed(1)} van 10`}
        />
      </div>
    </div>
  );
}
