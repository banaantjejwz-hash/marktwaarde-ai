import { getConfidenceLabel } from '@/lib/utils';

interface ConfidenceIndicatorProps {
  score: number;
  showLabel?: boolean;
}

function getDotColors(score: number): string {
  if (score >= 7.5) return 'bg-emerald-500';
  if (score >= 5) return 'bg-amber-500';
  return 'bg-red-500';
}

function getLabelColor(score: number): string {
  if (score >= 7.5) return 'text-emerald-400';
  if (score >= 5) return 'text-amber-400';
  return 'text-red-400';
}

export default function ConfidenceIndicator({
  score,
  showLabel = true,
}: ConfidenceIndicatorProps) {
  const clampedScore = Math.max(0, Math.min(10, score));

  // Map 0–10 score to 0–5 filled dots
  const filledDots = Math.round((clampedScore / 10) * 5);
  const totalDots = 5;

  const activeDotColor = getDotColors(clampedScore);
  const confidenceLabel = getConfidenceLabel(clampedScore);

  return (
    <div className="flex flex-col gap-1">
      {/* Dots row */}
      <div
        className="flex items-center gap-1"
        role="meter"
        aria-valuenow={clampedScore}
        aria-valuemin={0}
        aria-valuemax={10}
        aria-label={`Vertrouwensniveau: ${confidenceLabel} (${clampedScore.toFixed(1)} van 10)`}
      >
        {Array.from({ length: totalDots }, (_, i) => {
          const filled = i < filledDots;
          return (
            <span
              key={i}
              className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors duration-200 ${
                filled ? activeDotColor : 'bg-slate-700'
              }`}
              aria-hidden="true"
            />
          );
        })}
      </div>

      {/* Label */}
      {showLabel && (
        <span className={`text-xs ${getLabelColor(clampedScore)}`}>
          Vertrouwensniveau:{' '}
          <span className="font-medium">{confidenceLabel}</span>
        </span>
      )}
    </div>
  );
}
