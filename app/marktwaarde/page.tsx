'use client';

import Link from 'next/link';
import {
  marketSummary,
  indexPrices,
  bitcoinMarket,
  allNewsItems,
  relevantNewsItems,
} from '@/lib/mockData';
import { formatPrice, formatChangePercent } from '@/lib/utils';
import { useLivePrices } from '@/hooks/useLivePrices';
import DataStatusBadge from '@/components/common/DataStatusBadge';
import FreshnessLabel from '@/components/common/FreshnessLabel';
import SentimentBadge from '@/components/common/SentimentBadge';
import ChangeIndicator from '@/components/common/ChangeIndicator';
import NewsList from '@/components/news/NewsList';

// Map indexPrices ticker → Yahoo Finance symbol for live overlay
const TICKER_TO_SYMBOL: Record<string, string> = {
  SPX: '^GSPC',
  NDX: '^NDX',
  DAX: '^GDAXI',
  BTC: 'BTC-EUR',
};

// ── Regime colour helper ───────────────────────────────────────────────────────

function getRegimeStyle(regime: typeof marketSummary.regime) {
  switch (regime) {
    case 'bull':
      return {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        dot: 'bg-emerald-400',
      };
    case 'bear':
      return {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        dot: 'bg-red-400',
      };
    case 'volatile':
      return {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
        dot: 'bg-orange-400',
      };
    case 'sideways':
    default:
      return {
        bg: 'bg-slate-700/30',
        border: 'border-slate-600',
        text: 'text-slate-400',
        dot: 'bg-slate-400',
      };
  }
}

function getFearGreedColor(value: number) {
  if (value <= 25) return 'text-red-400';
  if (value <= 49) return 'text-orange-400';
  if (value <= 74) return 'text-emerald-400';
  return 'text-emerald-300';
}

export default function OverzichtPage() {
  const { prices, loading: liveLoading } = useLivePrices();
  const regime = marketSummary.regime;
  const regimeStyle = getRegimeStyle(regime);
  const fearGreedColor = getFearGreedColor(bitcoinMarket.fearGreedIndex);

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 max-w-7xl space-y-8">

      {/* ── 1. Page header ─────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">Overzicht</h1>
        <p className="text-sm text-slate-400 mt-1">Wat is nu het meest relevant?</p>
      </div>

      {/* ── Guidance banner ───────────────────────────────────────────────────── */}
      <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl px-4 py-3.5 flex items-start gap-3">
        <span className="text-slate-500 text-base mt-0.5 flex-shrink-0">ℹ</span>
        <p className="text-sm text-slate-400 leading-relaxed">
          Dit is je startpunt. Je ziet hier het marktregime, de belangrijkste signalen en de snelkoppelingen naar de drie handelsmodi.
          Kies <span className="text-blue-400 font-medium">Daghandel</span> als je vandaag wilt handelen,{' '}
          <span className="text-violet-400 font-medium">Maandelijks</span> als je gespreid wilt beleggen, of{' '}
          <span className="text-amber-400 font-medium">Avondbriefing</span> om de dag samen te vatten.
        </p>
      </div>

      {/* ── 2. Market regime strip ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        {/* Regime badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${regimeStyle.bg} ${regimeStyle.border}`}>
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${regimeStyle.dot}`} />
          <span className={`text-xs font-semibold uppercase tracking-wider ${regimeStyle.text}`}>
            Marktregime:
          </span>
          <span className={`text-sm font-bold ${regimeStyle.text}`}>
            {marketSummary.regimeLabel}
          </span>
          <SentimentBadge sentiment={marketSummary.sentiment} />
        </div>

        {/* Top signal + Biggest risk */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-[#111827] border border-emerald-500/20 rounded-xl px-4 py-4">
            <p className="text-xs text-emerald-500 uppercase tracking-wide font-medium mb-1.5">
              Top signaal
            </p>
            <p className="text-sm text-slate-200 leading-relaxed">{marketSummary.topSignal}</p>
          </div>
          <div className="bg-[#111827] border border-red-500/20 rounded-xl px-4 py-4">
            <p className="text-xs text-red-500 uppercase tracking-wide font-medium mb-1.5">
              Grootste risico
            </p>
            <p className="text-sm text-slate-200 leading-relaxed">{marketSummary.biggestRisk}</p>
          </div>
        </div>
      </div>

      {/* ── 3. Mode entry cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Daghandel */}
        <Link href="/marktwaarde/daghandel" className="group block">
          <div className="h-full bg-[#111827] border border-[#1e2d45] hover:border-blue-500/40 rounded-xl px-5 py-5 transition-all duration-200 flex flex-col gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-blue-400 uppercase tracking-wide font-medium mb-1">Daghandel</p>
              <p className="text-sm text-slate-300 leading-snug">Welke kansen zijn er vandaag?</p>
            </div>
            <span className="text-xs text-blue-400 group-hover:text-blue-300 flex items-center gap-1 transition-colors">
              Bekijk daghandel
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>

        {/* Maandelijks */}
        <Link href="/marktwaarde/maandelijks" className="group block">
          <div className="h-full bg-[#111827] border border-[#1e2d45] hover:border-violet-500/40 rounded-xl px-5 py-5 transition-all duration-200 flex flex-col gap-3">
            <div className="w-9 h-9 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-violet-400 uppercase tracking-wide font-medium mb-1">Maandelijks</p>
              <p className="text-sm text-slate-300 leading-snug">Wat investeer ik deze maand?</p>
            </div>
            <span className="text-xs text-violet-400 group-hover:text-violet-300 flex items-center gap-1 transition-colors">
              Bekijk maandadvies
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>

        {/* Avondbriefing */}
        <Link href="/marktwaarde/avondbriefing" className="group block">
          <div className="h-full bg-[#111827] border border-[#1e2d45] hover:border-amber-500/40 rounded-xl px-5 py-5 transition-all duration-200 flex flex-col gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-amber-400 uppercase tracking-wide font-medium mb-1">Avondbriefing</p>
              <p className="text-sm text-slate-300 leading-snug">Hoe bereid ik morgen voor?</p>
            </div>
            <span className="text-xs text-amber-400 group-hover:text-amber-300 flex items-center gap-1 transition-colors">
              Bekijk briefing
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>
      </div>

      {/* ── 4. Index snapshot ──────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Index snapshot</p>
          {!liveLoading && Object.keys(prices).length > 0 && (
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-medium">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              Live koersen
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {indexPrices.map((asset) => {
            const symbol = TICKER_TO_SYMBOL[asset.ticker];
            const live = symbol ? prices[symbol] : undefined;
            const price = live ? live.price : asset.price;
            const changePercent = live ? live.changePercent : asset.changePercent;
            const changeAbsolute = live ? live.changeAbsolute : asset.changeAbsolute;
            const currency = live ? live.currency : asset.currency;
            const isLive = !!live;
            return (
              <div
                key={asset.ticker}
                className="bg-[#111827] border border-[#1e2d45] rounded-xl px-4 py-3 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-300 font-mono">{asset.ticker}</span>
                  <DataStatusBadge
                    status={isLive ? 'live' : asset.dataStatus}
                    lastUpdated={live ? live.lastUpdated : asset.lastUpdated}
                  />
                </div>
                <p className="text-xs text-slate-500">{asset.name}</p>
                <p className="text-lg font-bold text-slate-100 tabular-nums font-mono mt-1">
                  {formatPrice(price, currency)}
                </p>
                <ChangeIndicator
                  value={changePercent}
                  showAbsolute={true}
                  absoluteValue={changeAbsolute}
                  currency={currency}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 5. Wat te volgen ───────────────────────────────────────────────────── */}
      <div className="bg-[#111827] border border-[#1e2d45] rounded-xl px-5 py-4">
        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">
          Wat te volgen
        </p>
        <p className="text-sm text-slate-200 leading-relaxed">{marketSummary.whatToWatchNext}</p>
      </div>

      {/* ── 6. Bitcoin compact snapshot ───────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Bitcoin snapshot</p>
          <Link href="/marktwaarde/bitcoin" className="text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
            Volledige analyse
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="bg-[#111827] border border-amber-500/20 rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#1e2d45]">
            {/* Price + 24h */}
            <div className="px-5 py-4 flex flex-col gap-1">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Koers</p>
              <p className="text-xl font-bold text-amber-400 tabular-nums font-mono">
                {formatPrice(prices['BTC-EUR']?.price ?? bitcoinMarket.currentPrice, 'EUR')}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-500">24u:</span>
                <ChangeIndicator value={prices['BTC-EUR']?.changePercent ?? bitcoinMarket.changePercent24h} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">7d:</span>
                <ChangeIndicator value={bitcoinMarket.changePercent7d} />
              </div>
            </div>

            {/* Fear & Greed */}
            <div className="px-5 py-4 flex flex-col gap-1">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Fear &amp; Greed</p>
              <p className={`text-3xl font-bold tabular-nums ${fearGreedColor}`}>
                {bitcoinMarket.fearGreedIndex}
              </p>
              <p className={`text-sm font-medium ${fearGreedColor}`}>
                {bitcoinMarket.fearGreedLabel}
              </p>
            </div>

            {/* Key support */}
            <div className="px-5 py-4 flex flex-col gap-1">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Sleutelsteun</p>
              <p className="text-base font-bold text-emerald-400 font-mono">
                {bitcoinMarket.keyLevels.support1}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Steun 2: <span className="text-emerald-300 font-mono">{bitcoinMarket.keyLevels.support2}</span>
              </p>
              <p className="text-xs text-slate-400">
                Weerstand: <span className="text-red-400 font-mono">{bitcoinMarket.keyLevels.resistance1}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 7. Top relevant news ──────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Relevant nieuws</p>
          <Link href="/marktwaarde/nieuws" className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
            Meer nieuws
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <NewsList
          items={relevantNewsItems.slice(0, 4)}
          defaultFilter="relevant"
          showFilterBar={false}
          title=""
        />
      </div>

      {/* ── 8. Last refresh ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pt-2 border-t border-slate-800 flex-wrap">
        <DataStatusBadge
          status={marketSummary.dataStatus}
          lastUpdated={marketSummary.lastUpdated}
          showTime={true}
        />
        <span className="text-xs text-slate-600">|</span>
        <FreshnessLabel lastUpdated={marketSummary.lastUpdated} prefix="Bijgewerkt" />
      </div>

    </div>
  );
}
