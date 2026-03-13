import type { RankingItem } from '@/lib/types';
import CategoryBadge from '@/components/common/CategoryBadge';
import SentimentBadge from '@/components/common/SentimentBadge';
import TradeabilityBadge from '@/components/common/TradeabilityBadge';
import ScoreBar from '@/components/common/ScoreBar';
import ChangeIndicator from '@/components/common/ChangeIndicator';

interface RankingCardProps {
  item: RankingItem;
  showFullDetail?: boolean;
}

const timeHorizonLabels: Record<string, string> = {
  intraday: 'Intraday',
  'volgende-sessie': 'Volgende sessie',
  swing: 'Swing',
  'lange-termijn': 'Lange termijn',
};

function getRankStyle(rank: number): { color: string; bg: string; border: string } {
  if (rank === 1) return { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' };
  if (rank === 2) return { color: 'text-slate-300', bg: 'bg-slate-400/10', border: 'border-slate-500/30' };
  if (rank === 3) return { color: 'text-amber-600', bg: 'bg-amber-700/10', border: 'border-amber-700/30' };
  return { color: 'text-slate-500', bg: 'bg-slate-800', border: 'border-slate-700' };
}

export default function RankingCard({ item, showFullDetail = false }: RankingCardProps) {
  const rankStyle = getRankStyle(item.rank);

  return (
    <div className="bg-[#111827] border border-[#1e2d45] rounded-lg overflow-hidden">
      {/* ── Header row ── */}
      <div className="px-4 pt-3 pb-3 flex items-start gap-3">
        {/* Rank number */}
        <div
          className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-bold text-base
                      ${rankStyle.bg} ${rankStyle.color} border ${rankStyle.border}`}
        >
          {item.rank}
        </div>

        {/* Ticker + name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-bold text-slate-100 font-mono">{item.ticker}</span>
            <CategoryBadge category={item.category} size="sm" />
            <SentimentBadge sentiment={item.sentiment} />
            {item.monthlyAllocationSuitable && (
              <span className="inline-flex text-xs px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/25 text-violet-400 font-medium">
                Maand-allocatie
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-0.5 truncate">{item.name}</p>
        </div>

        {/* Change % */}
        <div className="flex-shrink-0">
          <ChangeIndicator value={item.changePercent} />
        </div>
      </div>

      {/* ── Score bar ── */}
      <div className="px-4 pb-3">
        <ScoreBar score={item.score} label="Score" size="sm" />
      </div>

      {/* ── Rationale ── */}
      <div className="px-4 pb-3">
        <p className="text-sm text-slate-300 leading-snug">{item.rationale}</p>
      </div>

      {/* ── Badges row ── */}
      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
        <TradeabilityBadge state={item.tradeabilityState} />
        <span className="inline-flex text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
          {timeHorizonLabels[item.timeHorizon] ?? item.timeHorizon}
        </span>
      </div>

      {/* ── Full detail ── */}
      {showFullDetail && (
        <div className="border-t border-[#1e2d45] px-4 py-3 space-y-3">
          {/* Main drivers */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1.5">
              Belangrijkste drivers
            </p>
            <div className="flex flex-wrap gap-1">
              {item.mainDrivers.map((driver, i) => (
                <span
                  key={i}
                  className="inline-flex text-xs px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                >
                  {driver}
                </span>
              ))}
            </div>
          </div>

          {/* Risks */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1.5">Risico&apos;s</p>
            <p className="text-xs text-slate-400 leading-snug">{item.risks}</p>
          </div>
        </div>
      )}
    </div>
  );
}
