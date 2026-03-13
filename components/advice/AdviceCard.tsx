'use client';

import { useState } from 'react';
import type { AdviceBlock } from '@/lib/types';
import {
  formatTimestamp,
  getDataStatusLabel,
  getTimeHorizonLabel,
  getConfidenceLabel,
} from '@/lib/utils';
import ConfidenceIndicator from '@/components/common/ConfidenceIndicator';
import DataStatusBadge from '@/components/common/DataStatusBadge';
import FreshnessLabel from '@/components/common/FreshnessLabel';
import ScenarioPanel from './ScenarioPanel';

interface AdviceCardProps {
  advice: AdviceBlock;
  mode: 'maandelijks' | 'daghandel' | 'avondbriefing';
}

const modeConfig = {
  maandelijks: {
    icon: (
      <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    label: 'Maandelijkse allocatie',
  },
  daghandel: {
    icon: (
      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
    label: 'Daghandel sessie',
  },
  avondbriefing: {
    icon: (
      <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
    ),
    label: 'Avondbriefing',
  },
};

const probabilityConfig: Record<
  'laag' | 'gemiddeld' | 'hoog',
  { bg: string; text: string; border: string; label: string }
> = {
  hoog: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Hoog' },
  gemiddeld: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Gemiddeld' },
  laag: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', label: 'Laag' },
};

export default function AdviceCard({ advice, mode }: AdviceCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const mc = modeConfig[mode];

  return (
    <div className="bg-[#111827] border border-[#1e2d45] rounded-xl overflow-hidden">
      {/* ── Header ── */}
      <div className="px-6 pt-5 pb-4 border-b border-[#1e2d45]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {mc.icon}
              <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                {mc.label}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 leading-tight">{advice.title}</h2>
            {advice.subtitle && (
              <p className="text-sm text-slate-400 mt-1">{advice.subtitle}</p>
            )}
          </div>

          {/* Confidence dots + data status */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <ConfidenceIndicator score={advice.confidenceLevel} showLabel={true} />
            <DataStatusBadge
              status={advice.dataStatus}
              lastUpdated={advice.lastUpdated}
              showTime={true}
            />
          </div>
        </div>

        {/* Freshness + time horizon row */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <FreshnessLabel lastUpdated={advice.lastUpdated} />
          <span className="text-xs text-slate-600">|</span>
          <span className="text-xs text-slate-500">
            Horizon:{' '}
            <span className="text-slate-400 font-medium">
              {getTimeHorizonLabel(advice.timeHorizon)}
            </span>
          </span>
        </div>
      </div>

      {/* ── Summary ── */}
      <div className="px-6 py-4 border-b border-[#1e2d45]">
        <p className="text-base text-slate-200 leading-relaxed">{advice.summary}</p>
      </div>

      {/* ── Collapsible Details ── */}
      <div className="px-6 py-3 border-b border-[#1e2d45]">
        <button
          onClick={() => setDetailsOpen((v) => !v)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          aria-expanded={detailsOpen}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${detailsOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          <span className="font-medium">{detailsOpen ? 'Minder details' : 'Meer details'}</span>
        </button>

        {detailsOpen && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Belangrijkste drivers */}
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">
                Belangrijkste drivers
              </p>
              <ul className="space-y-1.5">
                {advice.mainDrivers.map((driver, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    {driver}
                  </li>
                ))}
              </ul>
            </div>

            {/* Risico's */}
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">
                Risico&apos;s
              </p>
              <ul className="space-y-1.5">
                {advice.risks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    {risk}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tegenargumenten */}
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">
                Tegenargumenten
              </p>
              <ul className="space-y-1.5">
                {advice.counterArguments.map((arg, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    {arg}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* ── Scenarios ── */}
      <div className="px-6 py-4 border-b border-[#1e2d45]">
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Scenario&apos;s</p>
        <ScenarioPanel scenarios={advice.scenarios} />
      </div>

      {/* ── Conclusie ── */}
      <div className="px-6 py-4 border-b border-[#1e2d45]">
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Conclusie</p>
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg px-4 py-3">
          <p className="text-sm text-slate-200 leading-relaxed">{advice.conclusion}</p>
        </div>
      </div>

      {/* ── Actiepunten ── */}
      <div className="px-6 py-4 border-b border-[#1e2d45]">
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Actiepunten</p>
        <ol className="space-y-2">
          {advice.actionPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400 mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-slate-300 leading-snug">{point}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* ── Defensief / Offensief ── */}
      <div className="px-6 py-4 border-b border-[#1e2d45]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-[#0f1623] border border-slate-700/50 rounded-lg px-4 py-3">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1.5">
              Defensief alternatief
            </p>
            <p className="text-sm text-slate-300 leading-snug">
              {advice.defensiveAlternative}
            </p>
          </div>
          <div className="bg-[#0f1623] border border-slate-700/50 rounded-lg px-4 py-3">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1.5">
              Offensief alternatief
            </p>
            <p className="text-sm text-slate-300 leading-snug">
              {advice.offensiveAlternative}
            </p>
          </div>
        </div>
      </div>

      {/* ── Wanneer niets doen beter is ── */}
      {advice.doNothingLogic && (
        <div className="px-6 py-4 border-b border-[#1e2d45]">
          <div className="bg-amber-500/5 border border-amber-500/25 rounded-lg px-4 py-3">
            <p className="text-xs text-amber-500 uppercase tracking-wide mb-1.5 font-medium">
              Wanneer niets doen beter is
            </p>
            <p className="text-sm text-slate-300 leading-snug">{advice.doNothingLogic}</p>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="px-6 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <FreshnessLabel lastUpdated={advice.lastUpdated} prefix="Bijgewerkt" />
          <span className="text-xs text-slate-600">|</span>
          <DataStatusBadge
            status={advice.dataStatus}
            lastUpdated={advice.lastUpdated}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {getConfidenceLabel(advice.confidenceLevel)}
          </span>
          <ConfidenceIndicator score={advice.confidenceLevel} showLabel={false} />
        </div>
      </div>
    </div>
  );
}
