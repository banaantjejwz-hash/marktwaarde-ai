import type { BitcoinMarket } from '@/lib/types';
import SentimentBadge from '@/components/common/SentimentBadge';
import DataStatusBadge from '@/components/common/DataStatusBadge';
import FreshnessLabel from '@/components/common/FreshnessLabel';
import ChangeIndicator from '@/components/common/ChangeIndicator';

interface BitcoinSignalGridProps {
  market: BitcoinMarket;
}

function getFearGreedColor(value: number): { text: string; bg: string; border: string } {
  if (value <= 25) return { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/25' };
  if (value <= 49) return { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/25' };
  if (value <= 74) return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25' };
  return { text: 'text-emerald-300', bg: 'bg-emerald-400/10', border: 'border-emerald-400/25' };
}

const importanceConfig: Record<
  'hoog' | 'gemiddeld' | 'laag',
  { bg: string; text: string; border: string; label: string }
> = {
  hoog: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/25', label: 'Hoog' },
  gemiddeld: { bg: 'bg-slate-700/40', text: 'text-slate-400', border: 'border-slate-600', label: 'Gemiddeld' },
  laag: { bg: 'bg-slate-800', text: 'text-slate-500', border: 'border-slate-700', label: 'Laag' },
};

function formatBtcPrice(value: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function BitcoinSignalGrid({ market }: BitcoinSignalGridProps) {
  const fg = getFearGreedColor(market.fearGreedIndex);

  return (
    <div className="bg-[#111827] border border-[#1e2d45] rounded-xl overflow-hidden">
      {/* ── Price header ── */}
      <div className="px-5 pt-5 pb-4 border-b border-[#1e2d45]">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-amber-500 font-medium uppercase tracking-wide">Bitcoin</span>
              <DataStatusBadge
                status={market.dataStatus}
                lastUpdated={market.lastUpdated}
                showTime={true}
              />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-100 tabular-nums font-mono">
              {formatBtcPrice(market.currentPrice)}
            </p>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="text-xs text-slate-500">24u:</span>
              <ChangeIndicator value={market.changePercent24h} />
              <span className="text-xs text-slate-500">7d:</span>
              <ChangeIndicator value={market.changePercent7d} />
            </div>
          </div>

          {/* Fear & Greed + Dominance */}
          <div className="flex flex-col gap-2 items-end">
            {/* Fear & Greed */}
            <div
              className={`px-3 py-2 rounded-lg border text-center ${fg.bg} ${fg.border}`}
            >
              <p className="text-xs text-slate-500 mb-0.5">Fear &amp; Greed</p>
              <p className={`text-2xl font-bold tabular-nums ${fg.text}`}>
                {market.fearGreedIndex}
              </p>
              <p className={`text-xs font-medium ${fg.text}`}>{market.fearGreedLabel}</p>
            </div>

            {/* Dominance */}
            <div className="px-3 py-1.5 rounded-lg border bg-amber-500/5 border-amber-500/20 text-center">
              <p className="text-xs text-slate-500 mb-0.5">BTC Dominance</p>
              <p className="text-base font-bold text-amber-400 tabular-nums">
                {market.dominance.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Key levels ── */}
      <div className="px-5 py-4 border-b border-[#1e2d45]">
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Sleutelni­veaus</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Steun 1', value: market.keyLevels.support1, color: 'text-emerald-400', bg: 'bg-emerald-500/5 border-emerald-500/20' },
            { label: 'Steun 2', value: market.keyLevels.support2, color: 'text-emerald-300', bg: 'bg-emerald-500/5 border-emerald-500/15' },
            { label: 'Weerstand 1', value: market.keyLevels.resistance1, color: 'text-red-400', bg: 'bg-red-500/5 border-red-500/20' },
            { label: 'Weerstand 2', value: market.keyLevels.resistance2, color: 'text-red-300', bg: 'bg-red-500/5 border-red-500/15' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`rounded-lg border px-3 py-2 ${bg}`}>
              <p className="text-xs text-slate-500 mb-0.5">{label}</p>
              <p className={`text-sm font-semibold font-mono ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Signals grid ── */}
      <div className="px-5 py-4">
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Marktsignalen</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {market.signals.map((signal) => {
            const imp = importanceConfig[signal.importance];
            return (
              <div
                key={signal.id}
                className="bg-[#0f1623] border border-[#1e2d45] rounded-lg px-3 py-3 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-slate-500 font-medium">{signal.label}</p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span
                      className={`inline-flex text-xs px-1.5 py-0.5 rounded border font-medium ${imp.bg} ${imp.text} ${imp.border}`}
                    >
                      {imp.label}
                    </span>
                    <SentimentBadge sentiment={signal.sentiment} />
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-200">{signal.value}</p>
                <p className="text-xs text-slate-400 leading-snug">{signal.interpretation}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-5 py-3 border-t border-[#1e2d45] flex items-center gap-3">
        <FreshnessLabel lastUpdated={market.lastUpdated} />
      </div>
    </div>
  );
}
