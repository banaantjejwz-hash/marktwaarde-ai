'use client';

import {
  monthlyAdvice,
  monthlyCategoryComparison,
  monthlyStockRankings,
  monthlyETFRankings,
  bitcoinMarket,
} from '@/lib/mockData';
import { formatPrice } from '@/lib/utils';
import AdviceCard from '@/components/advice/AdviceCard';
import CategoryComparisonCard from '@/components/common/CategoryComparisonCard';
import RankingList from '@/components/ranking/RankingList';
import BitcoinSignalGrid from '@/components/bitcoin/BitcoinSignalGrid';
import SectionHeader from '@/components/common/SectionHeader';
import DataStatusBadge from '@/components/common/DataStatusBadge';
import FreshnessLabel from '@/components/common/FreshnessLabel';
import ChangeIndicator from '@/components/common/ChangeIndicator';

// ── Allocation visual helpers ──────────────────────────────────────────────────

const allocationConfig = [
  {
    key: 'aandelen' as const,
    label: 'Aandelen',
    dot: 'bg-blue-500',
    bar: 'bg-blue-500',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/25',
  },
  {
    key: 'etfs' as const,
    label: "ETF's",
    dot: 'bg-violet-500',
    bar: 'bg-violet-500',
    text: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/25',
  },
  {
    key: 'bitcoin' as const,
    label: 'Bitcoin',
    dot: 'bg-amber-500',
    bar: 'bg-amber-500',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
  },
  {
    key: 'cash' as const,
    label: 'Cash',
    dot: 'bg-slate-500',
    bar: 'bg-slate-500',
    text: 'text-slate-400',
    bg: 'bg-slate-700/30',
    border: 'border-slate-600',
  },
];

export default function MaandelijksPage() {
  const alloc = monthlyCategoryComparison.sampleAllocation;
  const totalAlloc = alloc.aandelen + alloc.etfs + alloc.bitcoin + alloc.cash;

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 max-w-7xl space-y-8">

      {/* ── 1. Page header ─────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">Maandelijks Investeren</h1>
        <p className="text-sm text-slate-400 mt-1">Rationele allocatie voor de lange termijn</p>
      </div>

      {/* ── Guidance banner ───────────────────────────────────────────────────── */}
      <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl px-4 py-3.5 flex items-start gap-3">
        <span className="text-slate-500 text-base mt-0.5 flex-shrink-0">ℹ</span>
        <p className="text-sm text-slate-400 leading-relaxed">
          Maandelijks beleggen betekent: elke maand een vast bedrag inleggen, ongeacht de markt.
          Je ziet hier welke categorie (aandelen, ETF of Bitcoin) momenteel het beste past bij gespreid inleggen,
          met een ranking van concrete instrumenten.
        </p>
      </div>

      {/* ── 2. Monthly advice ──────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHeader
          title="Maandelijks advies"
          subtitle={monthlyAdvice.subtitle}
        />
        <AdviceCard advice={monthlyAdvice} mode="maandelijks" />
      </div>

      {/* ── 3. Category comparison ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHeader
          title="Welke categorie deze maand?"
          subtitle="Vergelijking op basis van risico-rendement en marktomstandigheden"
        />
        <CategoryComparisonCard comparison={monthlyCategoryComparison} />
      </div>

      {/* ── 4. Aandelen ranking ────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHeader
          title="Aandelen ranking"
          subtitle="Meest kansrijke individuele aandelen voor maandelijkse allocatie"
        />
        <RankingList
          stockRankings={monthlyStockRankings}
          etfRankings={monthlyETFRankings}
          showBitcoin={false}
        />
      </div>

      {/* ── 5. ETF ranking ─────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHeader
          title="ETF ranking"
          subtitle="Beste ETFs voor gespreide maandelijkse inleg"
        />
        <RankingList
          stockRankings={monthlyStockRankings}
          etfRankings={monthlyETFRankings}
          showBitcoin={false}
        />
      </div>

      {/* ── 6. Bitcoin allocatie ───────────────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeader
          title="Bitcoin allocatie"
          subtitle="Maandelijkse bitcoin context en signalen"
        />

        {/* Compact Bitcoin overview before full grid */}
        <div className="bg-[#111827] border border-amber-500/20 rounded-xl overflow-hidden">
          <div className="px-5 pt-4 pb-3 border-b border-[#1e2d45]">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs text-amber-500 uppercase tracking-wide font-medium mb-1">Bitcoin koers</p>
                <p className="text-2xl font-bold text-slate-100 tabular-nums font-mono">
                  {formatPrice(bitcoinMarket.currentPrice, 'EUR')}
                </p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-xs text-slate-500">24u:</span>
                  <ChangeIndicator value={bitcoinMarket.changePercent24h} />
                  <span className="text-xs text-slate-500">7d:</span>
                  <ChangeIndicator value={bitcoinMarket.changePercent7d} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 mb-0.5">Fear &amp; Greed</p>
                <p className="text-lg font-bold text-orange-400 tabular-nums">{bitcoinMarket.fearGreedIndex}</p>
                <p className="text-xs text-orange-400">{bitcoinMarket.fearGreedLabel}</p>
              </div>
            </div>
          </div>

          <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Monthly allocation advice */}
            <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg px-4 py-3">
              <p className="text-xs text-amber-500 uppercase tracking-wide font-medium mb-2">
                Maandelijkse allocatie
              </p>
              <p className="text-sm text-slate-200 leading-relaxed">
                Bitcoin maandelijkse allocatie: max 10% van maandelijkse inleg bij huidige marktomstandigheden.
              </p>
            </div>

            {/* Monthly suitability */}
            <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg px-4 py-3">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">
                LT-geschiktheid
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                LTH stabiel positief voor lange termijn, maar ETF-uitstroom en VIX &gt;20 reduceren korte-termijn aantrekkelijkheid.
              </p>
            </div>
          </div>
        </div>

        {/* Full Bitcoin signal grid */}
        <BitcoinSignalGrid market={bitcoinMarket} />
      </div>

      {/* ── 7. Voorbeeldallocatie ──────────────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHeader
          title="Voorbeeldallocatie"
          subtitle="Indicatieve spreiding voor een gemiddeld risicoprofiel"
        />
        <div className="bg-[#111827] border border-[#1e2d45] rounded-xl px-5 py-5">
          {/* Segmented bar */}
          <div className="flex h-5 rounded-full overflow-hidden mb-4 gap-px">
            {allocationConfig.map(({ key, bar }) => {
              const pct = alloc[key];
              if (!pct) return null;
              return (
                <div
                  key={key}
                  className={`${bar} transition-all`}
                  style={{ width: `${(pct / totalAlloc) * 100}%` }}
                  title={`${allocationConfig.find((c) => c.key === key)?.label}: ${pct}%`}
                />
              );
            })}
          </div>

          {/* Individual allocation cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {allocationConfig.map(({ key, label, dot, text, bg, border }) => {
              const pct = alloc[key];
              if (pct === undefined) return null;
              return (
                <div key={key} className={`rounded-lg border px-4 py-3 ${bg} ${border}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot}`} />
                    <p className={`text-xs font-medium ${text}`}>{label}</p>
                  </div>
                  <p className={`text-3xl font-bold tabular-nums ${text}`}>{pct}%</p>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-500 mt-4">
            Voorbeeldverdeling gebaseerd op huidig marktregime. Pas aan op basis van eigen risicoprofiel en beleggingshorizon.
          </p>
        </div>
      </div>

      {/* ── 8. Te vermijden ────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHeader
          title="Te vermijden deze maand"
          subtitle="Posities en categorieën met verhoogd risico in het huidige regime"
        />
        <div className="bg-[#111827] border border-red-500/15 rounded-xl px-5 py-5">
          <ul className="space-y-3">
            {monthlyCategoryComparison.avoidThisMonth.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-sm text-slate-300 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── 9. Freshness + trust footer ───────────────────────────────────────── */}
      <div className="flex flex-col gap-3 pt-2 border-t border-slate-800">
        <div className="flex items-center gap-3 flex-wrap">
          <DataStatusBadge
            status={monthlyAdvice.dataStatus}
            lastUpdated={monthlyAdvice.lastUpdated}
            showTime={true}
          />
          <span className="text-xs text-slate-600">|</span>
          <FreshnessLabel lastUpdated={monthlyAdvice.lastUpdated} prefix="Bijgewerkt" />
        </div>
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg px-4 py-3 inline-flex items-start gap-2 max-w-xl">
          <svg className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p className="text-xs text-slate-400 leading-relaxed">
            Geschikt voor maandelijkse allocatie, niet voor intraday actie. Geen beleggingsadvies — uitsluitend informatief.
          </p>
        </div>
      </div>

    </div>
  );
}
