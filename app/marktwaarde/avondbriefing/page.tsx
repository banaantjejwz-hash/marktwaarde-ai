'use client';

import { useEffect, useState } from 'react';
import {
  eveningAdvice,
  eveningBriefItems,
  allNewsItems,
} from '@/lib/mockData';
import { formatTime } from '@/lib/utils';
import AdviceCard from '@/components/advice/AdviceCard';
import ScenarioPanel from '@/components/advice/ScenarioPanel';
import NewsList from '@/components/news/NewsList';
import SectionHeader from '@/components/common/SectionHeader';
import DataStatusBadge from '@/components/common/DataStatusBadge';
import FreshnessLabel from '@/components/common/FreshnessLabel';
import CategoryBadge from '@/components/common/CategoryBadge';
import type { AssetCategory } from '@/lib/types';

// ── Category label for EveningBriefItem (includes 'macro') ──────────────────

function CategoryOrMacroBadge({ category }: { category: AssetCategory | 'macro' }) {
  if (category === 'macro') {
    return (
      <span className="inline-flex items-center font-medium text-xs px-2 py-0.5 rounded bg-violet-500/20 text-violet-400 border border-violet-500/30">
        Macro
      </span>
    );
  }
  return <CategoryBadge category={category} size="sm" />;
}

export default function AvondbriefingPage() {
  // Client-only timestamp — null on server to avoid SSR/hydration mismatch
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  useEffect(() => {
    setGeneratedAt(
      new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
    );
  }, []);

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 max-w-7xl space-y-10">

      {/* ── 1. Page header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {/* Moon icon */}
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
            <span className="text-xs text-amber-500 font-semibold uppercase tracking-wider">Avondbriefing</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Avondbriefing
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Voorbereiding op de volgende handelssessie
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/25 bg-amber-500/8 text-xs text-amber-400 font-medium">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {generatedAt ? `Briefing gegenereerd om ${generatedAt}` : 'Briefing geladen'}
          </span>
          <DataStatusBadge
            status={eveningAdvice.dataStatus}
            lastUpdated={eveningAdvice.lastUpdated}
            showTime={true}
          />
        </div>
      </div>

      {/* ── Guidance banner ───────────────────────────────────────────────────── */}
      <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl px-4 py-3.5 flex items-start gap-3">
        <span className="text-slate-500 text-base mt-0.5 flex-shrink-0">ℹ</span>
        <p className="text-sm text-slate-400 leading-relaxed">
          De avondbriefing is bedoeld als afsluiting van de handelsdag.
          Je ziet wat er vandaag gebeurd is, welke scenario&apos;s voor morgen gelden en wat je kunt klaarzetten.
          Ideaal om 's avonds door te nemen zodat je de volgende ochtend beslist kunt starten.
        </p>
      </div>

      {/* ── 2. AdviceCard — centerpiece ────────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHeader
          title="Avondadvies"
          subtitle="Wat zijn de kansen en risico's voor de volgende sessie?"
        />
        <AdviceCard advice={eveningAdvice} mode="avondbriefing" />
      </div>

      {/* ── 3. Wat er vandaag gebeurde ─────────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeader
          title="Wat er vandaag gebeurde"
          subtitle="Observaties van vandaag en hun implicaties voor morgen"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {eveningBriefItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#111827] border border-[#1e2d45] rounded-xl overflow-hidden"
            >
              {/* Card header */}
              <div className="px-4 pt-4 pb-3 border-b border-[#1e2d45] flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <CategoryOrMacroBadge category={item.category} />
                    {item.eventRisk && (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border bg-red-500/10 border-red-500/25 text-red-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        Event-risico
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-100 leading-snug">{item.title}</h3>
                </div>
              </div>

              {/* Vandaag / Morgen columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#1e2d45]">
                <div className="px-4 py-3">
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1.5">
                    Vandaag
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.todayObservation}</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs text-amber-500 uppercase tracking-wide font-medium mb-1.5">
                    Morgen
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.tomorrowImplication}</p>
                </div>
              </div>

              {/* Key levels */}
              <div className="px-4 pb-4 pt-2 border-t border-[#1e2d45]">
                <p className="text-xs text-slate-600 uppercase tracking-wide mb-2">Sleutelniveaus</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.keyLevelsToCheck.map((level, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono"
                    >
                      {level}
                    </span>
                  ))}
                </div>
              </div>

              {/* Event risk detail */}
              {item.eventRisk && (
                <div className="px-4 pb-4">
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
                    <p className="text-xs text-red-400 font-medium">{item.eventRisk}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Scenario's voor morgen ──────────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeader
          title="Scenario&apos;s voor morgen"
          subtitle="Drie mogelijke marktuitkomsten en hun implicaties"
        />
        <ScenarioPanel scenarios={eveningAdvice.scenarios} />
      </div>

      {/* ── 5. Checklist voor morgenochtend ────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeader
          title="Checklist voor morgenochtend"
          subtitle="Actiepunten voor de opening van de volgende sessie"
        />
        <div className="bg-[#111827] border border-[#1e2d45] rounded-xl overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-[#1e2d45]">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <p className="text-sm font-semibold text-slate-100">
                Vóór 14:00 NL-tijd — doe dit voor de markt opent
              </p>
            </div>
          </div>
          <div className="px-5 py-5">
            <ul className="space-y-3">
              {eveningAdvice.actionPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  {/* Visual checkbox */}
                  <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 border-amber-500/40 bg-amber-500/5 flex items-center justify-center">
                    <svg className="w-3 h-3 text-amber-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  <span className="text-sm text-slate-200 leading-snug">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="px-5 py-3 border-t border-[#1e2d45] bg-amber-500/5">
            <p className="text-xs text-amber-500/80 italic">
              Tip: markeer items als gedaan zodra je ze hebt uitgevoerd voor de sessie opent.
            </p>
          </div>
        </div>
      </div>

      {/* ── 6. Nieuws van vandaag — impact op morgen ───────────────────────────── */}
      <div className="space-y-4">
        <SectionHeader
          title="Nieuwsitems van vandaag — impact op morgen"
          subtitle="Relevante items met verwachte doorwerking naar de volgende sessie"
        />
        <NewsList
          items={allNewsItems}
          defaultFilter="relevant"
          showFilterBar={true}
        />
      </div>

      {/* ── 7. Wat moet ik NIET doen morgen ────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeader
          title="Wat moet ik NIET doen morgen"
          subtitle="Fouten om te vermijden — discipline is de helft van het handelen"
        />
        <div className="bg-[#111827] border border-red-500/20 rounded-xl overflow-hidden">
          <div className="px-5 pt-4 pb-3 border-b border-red-500/15">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-sm font-semibold text-red-400">Verboden handelingen</p>
            </div>
          </div>
          <div className="px-5 py-5">
            <ul className="space-y-3">
              {eveningAdvice.whatToAvoid.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1 w-4 h-4 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-sm text-slate-300 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="px-5 py-3 border-t border-red-500/15 bg-red-500/5">
            <p className="text-xs text-red-400/70 italic">
              {eveningAdvice.doNothingLogic}
            </p>
          </div>
        </div>
      </div>

      {/* ── 8. Trust + freshness footer ────────────────────────────────────────── */}
      <div className="bg-[#111827] border border-[#1e2d45] rounded-xl px-5 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <DataStatusBadge
              status={eveningAdvice.dataStatus}
              lastUpdated={eveningAdvice.lastUpdated}
              showTime={true}
            />
            <FreshnessLabel lastUpdated={eveningAdvice.lastUpdated} />
            <span className="text-xs text-slate-600">|</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-amber-400/80">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {generatedAt ? `Briefing gegenereerd om ${generatedAt}` : 'Briefing geladen'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <span className="text-xs text-slate-500 italic">
              Hercheck bij grote overnight events
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
