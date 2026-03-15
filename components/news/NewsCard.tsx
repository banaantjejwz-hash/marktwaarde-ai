'use client';

import { useEffect, useState } from 'react';
import type { NewsItem } from '@/lib/types';
import ScoreBar from '@/components/common/ScoreBar';
import SentimentBadge from '@/components/common/SentimentBadge';
import CategoryBadge from '@/components/common/CategoryBadge';
import { getMockRelativeTimeShort } from '@/lib/utils';

interface NewsCardProps {
  item: NewsItem;
  variant: 'compact' | 'full';
}

const timeHorizonLabels: Record<string, string> = {
  intraday: 'Intraday',
  'volgende-sessie': 'Volgende sessie',
  swing: 'Swing',
  'lange-termijn': 'Lange termijn',
};

const eventTypeLabels: Record<string, string> = {
  macro: 'Macro',
  earnings: 'Earnings',
  geopolitiek: 'Geopolitiek',
  regelgeving: 'Regelgeving',
  technisch: 'Technisch',
  bitcoin: 'Bitcoin',
  sectornieuws: 'Sectornieuws',
  algemeen: 'Algemeen',
};

const eventTypeBgConfig: Record<string, string> = {
  macro: 'bg-violet-500/15 text-violet-400 border-violet-500/25',
  earnings: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  geopolitiek: 'bg-red-500/15 text-red-400 border-red-500/25',
  regelgeving: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
  technisch: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
  bitcoin: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  sectornieuws: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  algemeen: 'bg-slate-700/50 text-slate-400 border-slate-600',
};

export default function NewsCard({ item, variant }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false);
  // Relative timestamp is client-only — prevents SSR/hydration mismatch
  const [relTime, setRelTime] = useState<string | null>(null);

  useEffect(() => {
    setRelTime(getMockRelativeTimeShort(item.timestamp));
    const id = setInterval(() => setRelTime(getMockRelativeTimeShort(item.timestamp)), 60_000);
    return () => clearInterval(id);
  }, [item.timestamp]);

  const isCompact = variant === 'compact';
  const showFull = variant === 'full' || expanded;

  return (
    <div
      className={`bg-[#111827] border border-[#1e2d45] rounded-lg overflow-hidden transition-all ${
        isCompact ? 'cursor-pointer hover:border-slate-600' : ''
      }`}
      onClick={isCompact ? () => setExpanded((v) => !v) : undefined}
    >
      {/* ── Top row: source + time + event type ── */}
      <div className="px-4 pt-3 pb-0 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-400">{item.source}</span>
          <span className="text-xs text-slate-600">·</span>
          <span className="text-xs text-slate-500">{relTime ?? '—'}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {item.eventType && (
            <span
              className={`inline-flex text-xs px-1.5 py-0.5 rounded border font-medium ${
                eventTypeBgConfig[item.eventType] ?? eventTypeBgConfig.algemeen
              }`}
            >
              {eventTypeLabels[item.eventType] ?? item.eventType}
            </span>
          )}
          <SentimentBadge sentiment={item.sentiment} />
        </div>
      </div>

      {/* ── Headline ── */}
      <div className="px-4 pt-2 pb-2">
        <p className="text-sm font-medium text-slate-100 leading-snug">{item.headline}</p>
      </div>

      {/* ── Category chips ── */}
      <div className="px-4 pb-2 flex flex-wrap gap-1">
        {item.categoryTags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="inline-flex text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* ── Compact: relevance score bar + expand hint ── */}
      {isCompact && (
        <div className="px-4 pb-3 flex items-center gap-4">
          <div className="flex-1 max-w-32">
            <ScoreBar score={item.relevanceScore} label="Relevantie" size="sm" />
          </div>
          <span className="text-xs text-slate-500 ml-auto">
            {expanded ? 'Inklappen ↑' : 'Meer detail →'}
          </span>
        </div>
      )}

      {/* ── Full content ── */}
      {showFull && (
        <div
          className="px-4 pb-4 space-y-4 border-t border-[#1e2d45] mt-1 pt-3"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Summary */}
          <p className="text-sm text-slate-300 leading-relaxed">{item.summary}</p>

          {/* Score bars */}
          <div className="grid grid-cols-2 gap-3">
            <ScoreBar score={item.relevanceScore} label="Relevantie" size="sm" />
            <ScoreBar score={item.marketImpactScore} label="Marktimpact" size="sm" />
          </div>

          {/* Why it matters */}
          {item.whyItMatters && (
            <div className="bg-amber-500/5 border border-amber-500/25 rounded-lg px-3 py-2.5">
              <p className="text-xs text-amber-500 uppercase tracking-wide mb-1 font-medium">
                Waarom dit relevant is
              </p>
              <p className="text-sm text-slate-300 leading-snug">{item.whyItMatters}</p>
            </div>
          )}

          {/* Time horizon + Affected categories + instruments */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="inline-flex text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              {timeHorizonLabels[item.timeHorizon] ?? item.timeHorizon}
            </span>
            {item.affectedCategories.map((cat) => (
              <CategoryBadge key={cat} category={cat} size="sm" />
            ))}
          </div>

          {item.affectedInstruments && item.affectedInstruments.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-1">Betrokken instrumenten</p>
              <div className="flex flex-wrap gap-1">
                {item.affectedInstruments.map((inst) => (
                  <span
                    key={inst}
                    className="inline-flex text-xs px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono"
                  >
                    {inst}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Scenario implication */}
          {item.scenarioImplication && (
            <div>
              <p className="text-xs text-slate-500 mb-1">Scenario-implicatie</p>
              <p className="text-sm text-slate-300 leading-snug italic">
                {item.scenarioImplication}
              </p>
            </div>
          )}

          {/* Wat te volgen */}
          {item.watchNext && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg px-3 py-2.5">
              <p className="text-xs text-blue-400 uppercase tracking-wide mb-1 font-medium">
                Wat te volgen
              </p>
              <p className="text-sm text-slate-300 leading-snug">{item.watchNext}</p>
            </div>
          )}

          {/* Invalidation note */}
          {item.invalidationNote && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2.5">
              <p className="text-xs text-red-400 uppercase tracking-wide mb-1 font-medium">
                Invalideert wanneer
              </p>
              <p className="text-sm text-slate-300 leading-snug">{item.invalidationNote}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
