'use client';

import { useMemo } from 'react';
import { allNewsItems as mockNewsItems } from '@/lib/mockData';
import { useNews } from '@/hooks/useNews';
import NewsList from '@/components/news/NewsList';
import NewsCard from '@/components/news/NewsCard';
import SectionHeader from '@/components/common/SectionHeader';
import DataStatusBadge from '@/components/common/DataStatusBadge';
import FreshnessLabel from '@/components/common/FreshnessLabel';
import ScoreBar from '@/components/common/ScoreBar';
import SentimentBadge from '@/components/common/SentimentBadge';
import type { NewsItem } from '@/lib/types';

// ── Derived data ─────────────────────────────────────────────────────────────

function getHighestImpact(items: NewsItem[]): NewsItem | undefined {
  return [...items].sort((a, b) => b.marketImpactScore - a.marketImpactScore)[0];
}

function getHighestRelevance(items: NewsItem[]): NewsItem | undefined {
  return [...items].sort((a, b) => b.relevanceScore - a.relevanceScore)[0];
}

function getBitcoinHighestRelevance(items: NewsItem[]): NewsItem | undefined {
  return [...items]
    .filter((n) => n.affectedCategories.includes('bitcoin'))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)[0];
}

function getTop3Relevant(items: NewsItem[]): NewsItem[] {
  return [...items]
    .filter((n) => n.isRelevant)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3);
}

// ── Mini summary card ────────────────────────────────────────────────────────

interface SummaryCardProps {
  label: string;
  labelColor: string;
  labelBg: string;
  labelBorder: string;
  headline: string;
  score?: number;
  scoreLabel?: string;
  icon: React.ReactNode;
}

function QuickSummaryCard({
  label,
  labelColor,
  labelBg,
  labelBorder,
  headline,
  score,
  scoreLabel,
  icon,
}: SummaryCardProps) {
  return (
    <div className="bg-[#111827] border border-[#1e2d45] rounded-xl overflow-hidden flex flex-col">
      <div className="px-4 pt-3 pb-2 border-b border-[#1e2d45] flex items-center gap-2">
        <span className="flex-shrink-0">{icon}</span>
        <span
          className={`inline-flex items-center text-xs px-2 py-0.5 rounded border font-semibold uppercase tracking-wide ${labelBg} ${labelColor} ${labelBorder}`}
        >
          {label}
        </span>
      </div>
      <div className="px-4 py-3 flex-1 flex flex-col gap-2.5">
        <p className="text-xs font-medium text-slate-100 leading-snug line-clamp-3">{headline}</p>
        {score !== undefined && scoreLabel && (
          <div className="mt-auto">
            <ScoreBar score={score} label={scoreLabel} size="sm" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function NieuwsPage() {
  const { news: liveNews, loading: newsLoading } = useNews();
  const allNewsItems = liveNews.length > 0 ? liveNews : mockNewsItems;
  const relevantNewsItems = allNewsItems.filter(n => n.isRelevant);
  const isLive = liveNews.length > 0;

  const highestImpact = useMemo(() => getHighestImpact(allNewsItems), [allNewsItems]);
  const highestRelevance = useMemo(() => getHighestRelevance(allNewsItems), [allNewsItems]);
  const btcTopItem = useMemo(() => getBitcoinHighestRelevance(allNewsItems), [allNewsItems]);
  const top3Relevant = useMemo(() => getTop3Relevant(allNewsItems), [allNewsItems]);

  const latestTimestamp = useMemo(() => {
    const sorted = [...allNewsItems].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return sorted[0]?.timestamp ?? new Date().toISOString();
  }, [allNewsItems]);

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 max-w-7xl space-y-10">

      {/* ── 1. Page header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
            </svg>
            <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">Nieuws</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Nieuws &amp; Marktintelligentie
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Signalen onderscheiden van ruis
          </p>
        </div>

        {/* Counts */}
        <div className="flex items-center gap-2 flex-wrap">
          {isLive && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live nieuws
            </span>
          )}
          {newsLoading && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-600 bg-slate-800 text-xs text-slate-400">
              Laden…
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e2d45] bg-[#111827] text-xs text-slate-400">
            <span className="font-bold text-slate-200">{allNewsItems.length}</span>
            items totaal
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-500/25 bg-blue-500/10 text-xs text-blue-400">
            <span className="font-bold">{relevantNewsItems.length}</span>
            relevant
          </span>
        </div>
      </div>

      {/* ── Guidance banner ───────────────────────────────────────────────────── */}
      <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl px-4 py-3.5 flex items-start gap-3">
        <span className="text-slate-500 text-base mt-0.5 flex-shrink-0">ℹ</span>
        <p className="text-sm text-slate-400 leading-relaxed">
          Elk nieuwsbericht heeft een relevantiescore en een marktimpactscore.
          Items met een hoge score zijn het meest direct van belang voor je posities.
          Klik op een nieuwsitem om de samenvatting, scenario-implicatie en &apos;Wat te volgen&apos; te zien.
        </p>
      </div>

      {/* ── 2. Quick summary strip ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHeader
          title="Uitgelicht vandaag"
          subtitle="Top items op impact, relevantie en Bitcoin-focus"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Hoogste impact */}
          {highestImpact && (
            <QuickSummaryCard
              label="Hoogste impact"
              labelColor="text-red-400"
              labelBg="bg-red-500/15"
              labelBorder="border-red-500/25"
              headline={highestImpact.headline}
              score={highestImpact.marketImpactScore}
              scoreLabel="Marktimpact"
              icon={
                <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              }
            />
          )}

          {/* Meest relevant */}
          {highestRelevance && (
            <QuickSummaryCard
              label="Meest relevant"
              labelColor="text-blue-400"
              labelBg="bg-blue-500/15"
              labelBorder="border-blue-500/25"
              headline={highestRelevance.headline}
              score={highestRelevance.relevanceScore}
              scoreLabel="Relevantie"
              icon={
                <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              }
            />
          )}

          {/* Bitcoin focus */}
          {btcTopItem && (
            <QuickSummaryCard
              label="Bitcoin focus"
              labelColor="text-amber-400"
              labelBg="bg-amber-500/15"
              labelBorder="border-amber-500/25"
              headline={btcTopItem.headline}
              score={btcTopItem.relevanceScore}
              scoreLabel="Relevantie"
              icon={
                <span className="text-amber-400 font-bold text-sm">₿</span>
              }
            />
          )}

        </div>
      </div>

      {/* ── 3. Main news list ──────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeader
          title="Alle nieuwsitems"
          subtitle="Volledig nieuwsoverzicht — filter op categorie of relevantie"
          badge={
            <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-slate-700/40 border border-slate-600 text-slate-400">
              {allNewsItems.length} items
            </span>
          }
        />
        {/* Terminal-style container */}
        <div className="bg-[#0a0f1a] border border-[#1e2d45] rounded-xl overflow-hidden">
          {/* Terminal header bar */}
          <div className="px-4 py-2 border-b border-[#1e2d45] bg-[#0f1623] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/40 border border-red-500/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40 border border-amber-500/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40 border border-emerald-500/20" />
            </div>
            <span className="text-xs text-slate-600 font-mono">nieuws-terminal — {allNewsItems.length} items geladen</span>
            <div className="w-12" />
          </div>
          <div className="px-4 py-4">
            <NewsList
              items={allNewsItems}
              defaultFilter="all"
              showFilterBar={true}
            />
          </div>
        </div>
      </div>

      {/* ── 4. Nieuws uitgelicht — top 3 relevant ──────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeader
          title="Nieuws uitgelicht"
          subtitle="De drie meest relevante items van vandaag — volledig uitgewerkt"
          badge={
            <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-blue-500/15 border border-blue-500/25 text-blue-400 font-medium">
              Top 3
            </span>
          }
        />

        {/* Distinct background for uitgelicht section */}
        <div className="bg-[#0d1525] border border-blue-500/15 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-blue-500/15">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-blue-400 font-medium uppercase tracking-wide">
              Hoogste relevantie — volledig geanalyseerd
            </p>
          </div>

          {top3Relevant.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">Geen relevante items beschikbaar</p>
          ) : (
            <div className="space-y-3">
              {top3Relevant.map((item, i) => (
                <div key={item.id} className="relative">
                  {/* Rank indicator */}
                  <div className="absolute -left-0 top-3 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs font-bold text-blue-400" style={{ left: '-10px' }}>
                    {i + 1}
                  </div>
                  <div className="ml-3">
                    <NewsCard item={item} variant="full" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── 5. Relevantie vs. Impact explainer ────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHeader
          title="Relevantie vs. Marktimpact"
          subtitle="Wat betekenen deze scores?"
        />
        <div className="bg-[#111827] border border-[#1e2d45] rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#1e2d45]">

            {/* Relevantie */}
            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
                  Relevantiescore
                </p>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-2">
                Hoe relevant is dit item voor jouw gevolgde categorieën en instrumenten?
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Een hoge relevantiescore betekent dat het item direct betrekking heeft op assets in jouw watchlist — aandelen, ETFs of Bitcoin.
              </p>
            </div>

            {/* Marktimpact */}
            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <p className="text-xs font-semibold text-red-400 uppercase tracking-wide">
                  Marktimpactscore
                </p>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-2">
                Hoe groot is de verwachte koerseffect op de bredere markt?
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Macro-events (Fed, CPI) scoren hoog op marktimpact omdat ze de hele markt bewegen — ook assets die je niet volgt.
              </p>
            </div>

            {/* Verschil */}
            <div className="px-5 py-4 bg-slate-800/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
                  Het verschil
                </p>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-2">
                Een item kan hoog relevant zijn voor jou, maar beperkte brede marktimpact hebben.
              </p>
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2">
                <p className="text-xs text-slate-400 leading-relaxed italic">
                  Voorbeeld: Bitcoin on-chain nieuws is zeer relevant voor BTC-beleggers, maar heeft beperkte impact op S&amp;P 500 of traditionele ETFs.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── 6. Freshness footer ────────────────────────────────────────────────── */}
      <div className="bg-[#111827] border border-[#1e2d45] rounded-xl px-5 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <DataStatusBadge
              status={isLive ? 'live' : 'vertraagd'}
              lastUpdated={latestTimestamp}
              showTime={true}
            />
            <FreshnessLabel lastUpdated={latestTimestamp} />
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <p className="text-xs text-slate-500 italic">
              Nieuws wordt continu gevolgd — score en interpretatie zijn analytisch en niet automatisch gegenereerd
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
