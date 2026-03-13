'use client';

import type { Scenario } from '@/lib/types';

interface ScenarioPanelProps {
  scenarios: {
    bullish: Scenario;
    bearish: Scenario;
    neutral: Scenario;
  };
}

const probabilityConfig: Record<
  'laag' | 'gemiddeld' | 'hoog',
  { bg: string; text: string; border: string; label: string }
> = {
  hoog: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    label: 'Hoog',
  },
  gemiddeld: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    label: 'Gemiddeld',
  },
  laag: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/30',
    label: 'Laag',
  },
};

interface ScenarioCardProps {
  scenario: Scenario;
  variant: 'bullish' | 'bearish' | 'neutral';
}

const variantConfig = {
  bullish: {
    bg: 'bg-emerald-500/10',
    topBorder: 'border-t-emerald-500',
    labelColor: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  bearish: {
    bg: 'bg-red-500/10',
    topBorder: 'border-t-red-500',
    labelColor: 'text-red-400',
    border: 'border-red-500/20',
  },
  neutral: {
    bg: 'bg-slate-700/30',
    topBorder: 'border-t-slate-500',
    labelColor: 'text-slate-400',
    border: 'border-slate-600/40',
  },
};

function ScenarioCard({ scenario, variant }: ScenarioCardProps) {
  const vc = variantConfig[variant];
  const prob = probabilityConfig[scenario.probability];

  return (
    <div
      className={`flex flex-col gap-3 p-4 rounded-lg border border-t-2 ${vc.topBorder} ${vc.border} ${vc.bg}`}
    >
      {/* Label + Probability */}
      <div className="flex items-start justify-between gap-2">
        <span className={`text-sm font-semibold ${vc.labelColor}`}>
          {scenario.label}
        </span>
        <span
          className={`flex-shrink-0 inline-flex items-center text-xs px-2 py-0.5 rounded border font-medium ${prob.bg} ${prob.text} ${prob.border}`}
        >
          {prob.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-300 leading-snug">{scenario.description}</p>

      {/* Implication */}
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Marktimplicatie</p>
        <p className="text-xs text-slate-400 leading-snug">{scenario.implication}</p>
      </div>

      {/* Watch Triggers */}
      {scenario.watchTriggers.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1.5">Te volgen</p>
          <div className="flex flex-wrap gap-1">
            {scenario.watchTriggers.map((trigger, i) => (
              <span
                key={i}
                className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400"
              >
                {trigger}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Invalidation */}
      {scenario.invalidation && (
        <p className="text-xs text-slate-500 italic border-t border-slate-700/50 pt-2 mt-auto">
          {scenario.invalidation}
        </p>
      )}
    </div>
  );
}

export default function ScenarioPanel({ scenarios }: ScenarioPanelProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <ScenarioCard scenario={scenarios.bullish} variant="bullish" />
      <ScenarioCard scenario={scenarios.bearish} variant="bearish" />
      <ScenarioCard scenario={scenarios.neutral} variant="neutral" />
    </div>
  );
}
