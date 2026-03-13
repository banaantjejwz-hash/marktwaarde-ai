'use client';

import { useState } from 'react';
import type { TradeSetup } from '@/lib/types';
import CategoryBadge from '@/components/common/CategoryBadge';
import TradeabilityBadge from '@/components/common/TradeabilityBadge';
import ConfidenceIndicator from '@/components/common/ConfidenceIndicator';
import FreshnessLabel from '@/components/common/FreshnessLabel';

interface SetupCardProps {
  setup: TradeSetup;
  collapsed?: boolean;
}

const sessionLabels: Record<string, string> = {
  'pre-market': 'Pre-market',
  open: 'Reguliere sessie',
  'after-hours': 'After-hours',
  gesloten: 'Gesloten',
  weekend: 'Weekend',
};

function getRRColor(rr: number): string {
  if (rr >= 2) return 'text-emerald-400';
  if (rr >= 1.5) return 'text-amber-400';
  return 'text-red-400';
}

function getRRBg(rr: number): string {
  if (rr >= 2) return 'bg-emerald-500/10 border-emerald-500/25';
  if (rr >= 1.5) return 'bg-amber-500/10 border-amber-500/25';
  return 'bg-red-500/10 border-red-500/25';
}

export default function SetupCard({ setup, collapsed: initialCollapsed = false }: SetupCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  const directionClasses =
    setup.direction === 'long'
      ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/25'
      : 'text-red-400 bg-red-500/10 border border-red-500/25';

  const directionLabel = setup.direction === 'long' ? 'LONG' : 'SHORT';

  return (
    <div className="bg-[#111827] border border-[#1e2d45] rounded-xl overflow-hidden">
      {/* ── Header — always visible ── */}
      <button
        onClick={() => setIsCollapsed((v) => !v)}
        className="w-full text-left px-4 pt-4 pb-3 flex items-start gap-3 hover:bg-white/[0.01] transition-colors"
        aria-expanded={!isCollapsed}
      >
        {/* Ticker + name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-bold text-slate-100 font-mono">{setup.ticker}</span>
            <span
              className={`inline-flex items-center text-xs px-2 py-0.5 rounded font-bold tracking-wide ${directionClasses}`}
            >
              {directionLabel}
            </span>
            <CategoryBadge category={setup.category} size="sm" />
            <TradeabilityBadge state={setup.tradeabilityState} />
          </div>
          <p className="text-sm text-slate-400 mt-0.5 truncate">{setup.name}</p>
        </div>

        {/* Collapsed key metrics */}
        {isCollapsed && (
          <div className="flex-shrink-0 flex items-center gap-3 text-sm">
            <span className="text-slate-300 font-mono font-medium">{setup.currentPrice}</span>
            <span
              className={`font-bold tabular-nums ${getRRColor(setup.riskReward)}`}
            >
              1:{setup.riskReward.toFixed(1)}
            </span>
          </div>
        )}

        {/* Chevron */}
        <svg
          className={`flex-shrink-0 w-4 h-4 text-slate-500 transition-transform duration-200 mt-0.5 ${
            isCollapsed ? '' : 'rotate-180'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ── Expanded content ── */}
      {!isCollapsed && (
        <div className="px-4 pb-4 space-y-4">
          {/* Current price + setup type */}
          <div className="flex items-center gap-3 flex-wrap">
            <div>
              <p className="text-xs text-slate-500">Huidige koers</p>
              <p className="text-lg font-bold text-slate-100 font-mono">{setup.currentPrice}</p>
            </div>
            <div className="ml-4">
              <p className="text-xs text-slate-500">Type setup</p>
              <p className="text-sm text-slate-300">{setup.setupType}</p>
            </div>
          </div>

          {/* Price grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: 'Entry zone', value: setup.entryZone, color: 'text-blue-400' },
              { label: 'Stop loss', value: setup.stopLoss, color: 'text-red-400' },
              { label: 'Target 1', value: setup.target1, color: 'text-emerald-400' },
              { label: 'Target 2', value: setup.target2 ?? '—', color: 'text-emerald-300' },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="bg-[#0f1623] border border-[#1e2d45] rounded-lg px-3 py-2"
              >
                <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                <p className={`text-sm font-semibold font-mono ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Risk/Reward + Confidence */}
          <div className="flex items-center gap-4 flex-wrap">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-bold ${getRRBg(setup.riskReward)} ${getRRColor(setup.riskReward)}`}
            >
              <span className="text-slate-500 font-normal">R/R</span>
              1:{setup.riskReward.toFixed(1)}
            </div>
            <ConfidenceIndicator score={setup.confidenceScore} showLabel={true} />
          </div>

          {/* Catalyst */}
          <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg px-3 py-2.5">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Katalysator</p>
            <p className="text-sm text-slate-300">{setup.catalyst}</p>
          </div>

          {/* Volume context */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Volume context</p>
            <p className="text-sm text-slate-400">{setup.volumeContext}</p>
          </div>

          {/* Invalidation */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2.5">
            <p className="text-xs text-red-400 uppercase tracking-wide mb-1 font-medium">
              Invalidatieconditie
            </p>
            <p className="text-sm text-slate-300">{setup.invalidationCondition}</p>
          </div>

          {/* Session relevance chips */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1.5">
              Sessie relevantie
            </p>
            <div className="flex flex-wrap gap-1">
              {setup.sessionRelevance.map((session) => (
                <span
                  key={session}
                  className="inline-flex text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400"
                >
                  {sessionLabels[session] ?? session}
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          {setup.notes && (
            <p className="text-sm text-slate-400 italic border-t border-[#1e2d45] pt-3">
              {setup.notes}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <FreshnessLabel lastUpdated={setup.lastUpdated} />
          </div>
        </div>
      )}
    </div>
  );
}
