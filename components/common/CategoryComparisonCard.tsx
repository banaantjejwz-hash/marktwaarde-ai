import type { CategoryComparison } from '@/lib/types';
import FreshnessLabel from '@/components/common/FreshnessLabel';
import ScoreBar from '@/components/common/ScoreBar';

interface CategoryComparisonCardProps {
  comparison: CategoryComparison;
}

const categoryConfig = {
  aandelen: {
    label: 'Aandelen',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/25',
    bar: 'bg-blue-500',
    winnerBorder: 'border-blue-500/50',
  },
  etfs: {
    label: "ETF's",
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/25',
    bar: 'bg-violet-500',
    winnerBorder: 'border-violet-500/50',
  },
  bitcoin: {
    label: 'Bitcoin',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    bar: 'bg-amber-500',
    winnerBorder: 'border-amber-500/50',
  },
};

const winnerLabelConfig: Record<string, { bg: string; text: string; border: string }> = {
  aandeel: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
  etf: { bg: 'bg-violet-500/15', text: 'text-violet-400', border: 'border-violet-500/30' },
  bitcoin: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
};

type ScoreKey = 'aandelen' | 'etfs' | 'bitcoin';

const scoreKeys: ScoreKey[] = ['aandelen', 'etfs', 'bitcoin'];

function winnerFromCategory(winner: string): ScoreKey {
  if (winner === 'aandeel') return 'aandelen';
  if (winner === 'etf') return 'etfs';
  return 'bitcoin';
}

export default function CategoryComparisonCard({ comparison }: CategoryComparisonCardProps) {
  const winnerKey = winnerFromCategory(comparison.winner);
  const winnerCfg = winnerLabelConfig[comparison.winner] ?? winnerLabelConfig.etf;
  const totalAlloc =
    comparison.sampleAllocation.aandelen +
    comparison.sampleAllocation.etfs +
    comparison.sampleAllocation.bitcoin +
    comparison.sampleAllocation.cash;

  return (
    <div className="bg-[#111827] border border-[#1e2d45] rounded-xl overflow-hidden">
      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-4 border-b border-[#1e2d45]">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
              Categorie vergelijking — deze maand
            </p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-slate-100">Beste categorie:</p>
              <span
                className={`inline-flex text-sm px-2.5 py-0.5 rounded border font-semibold ${winnerCfg.bg} ${winnerCfg.text} ${winnerCfg.border}`}
              >
                {categoryConfig[winnerKey]?.label ?? comparison.winner}
              </span>
            </div>
          </div>
          <FreshnessLabel lastUpdated={comparison.lastUpdated} />
        </div>
      </div>

      {/* ── Score columns ── */}
      <div className="px-5 py-4 border-b border-[#1e2d45]">
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Scores</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {scoreKeys.map((key) => {
            const cfg = categoryConfig[key];
            const score = comparison.scores[key];
            const isWinner = key === winnerKey;
            return (
              <div
                key={key}
                className={`rounded-lg border px-3 py-3 flex flex-col gap-2 transition-colors ${
                  isWinner
                    ? `${cfg.bg} ${cfg.winnerBorder}`
                    : 'bg-[#0f1623] border-[#1e2d45]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</p>
                  {isWinner && (
                    <span className="text-xs text-slate-400">Winnaar</span>
                  )}
                </div>
                <p className={`text-2xl font-bold tabular-nums ${cfg.color}`}>
                  {score.toFixed(1)}
                </p>
                <ScoreBar score={score} size="sm" />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Sample allocation visual bar ── */}
      <div className="px-5 py-4 border-b border-[#1e2d45]">
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">
          Voorbeeldverdeling
        </p>
        {/* Visual segmented bar */}
        <div className="flex h-4 rounded-full overflow-hidden mb-3 gap-px">
          {comparison.sampleAllocation.aandelen > 0 && (
            <div
              className="bg-blue-500 transition-all"
              style={{ width: `${(comparison.sampleAllocation.aandelen / totalAlloc) * 100}%` }}
              title={`Aandelen: ${comparison.sampleAllocation.aandelen}%`}
            />
          )}
          {comparison.sampleAllocation.etfs > 0 && (
            <div
              className="bg-violet-500 transition-all"
              style={{ width: `${(comparison.sampleAllocation.etfs / totalAlloc) * 100}%` }}
              title={`ETFs: ${comparison.sampleAllocation.etfs}%`}
            />
          )}
          {comparison.sampleAllocation.bitcoin > 0 && (
            <div
              className="bg-amber-500 transition-all"
              style={{ width: `${(comparison.sampleAllocation.bitcoin / totalAlloc) * 100}%` }}
              title={`Bitcoin: ${comparison.sampleAllocation.bitcoin}%`}
            />
          )}
          {comparison.sampleAllocation.cash > 0 && (
            <div
              className="bg-slate-600 transition-all"
              style={{ width: `${(comparison.sampleAllocation.cash / totalAlloc) * 100}%` }}
              title={`Cash: ${comparison.sampleAllocation.cash}%`}
            />
          )}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Aandelen', pct: comparison.sampleAllocation.aandelen, dot: 'bg-blue-500' },
            { label: "ETF's", pct: comparison.sampleAllocation.etfs, dot: 'bg-violet-500' },
            { label: 'Bitcoin', pct: comparison.sampleAllocation.bitcoin, dot: 'bg-amber-500' },
            { label: 'Cash', pct: comparison.sampleAllocation.cash, dot: 'bg-slate-600' },
          ]
            .filter(({ pct }) => pct > 0)
            .map(({ label, pct, dot }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot}`} />
                <span className="text-xs text-slate-400">
                  {label}{' '}
                  <span className="text-slate-300 font-semibold">{pct}%</span>
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* ── Te vermijden ── */}
      {comparison.avoidThisMonth.length > 0 && (
        <div className="px-5 py-4 border-b border-[#1e2d45]">
          <p className="text-xs text-red-500/70 uppercase tracking-wide mb-2 font-medium">
            Te vermijden deze maand
          </p>
          <ul className="space-y-1.5">
            {comparison.avoidThisMonth.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Rationale ── */}
      <div className="px-5 py-4">
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Onderbouwing</p>
        <p className="text-sm text-slate-300 leading-relaxed">{comparison.rationale}</p>
      </div>
    </div>
  );
}
