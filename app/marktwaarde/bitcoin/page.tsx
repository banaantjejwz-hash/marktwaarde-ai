'use client';

import {
  bitcoinMarket,
  tradeSetups,
  allNewsItems,
  dailyAdvice,
  monthlyAdvice,
  monthlyCategoryComparison,
} from '@/lib/mockData';
import { formatPrice, formatTime } from '@/lib/utils';
import BitcoinSignalGrid from '@/components/bitcoin/BitcoinSignalGrid';
import ScenarioPanel from '@/components/advice/ScenarioPanel';
import NewsList from '@/components/news/NewsList';
import SectionHeader from '@/components/common/SectionHeader';
import DataStatusBadge from '@/components/common/DataStatusBadge';
import FreshnessLabel from '@/components/common/FreshnessLabel';
import ChangeIndicator from '@/components/common/ChangeIndicator';
import ScoreBar from '@/components/common/ScoreBar';
import TradeabilityBadge from '@/components/common/TradeabilityBadge';

// ── Derived data ─────────────────────────────────────────────────────────────

const btcSetup = tradeSetups.find((s) => s.ticker === 'BTC') ?? tradeSetups[2];
const btcNewsItems = allNewsItems.filter((n) =>
  n.affectedCategories.includes('bitcoin')
);
const btcScore = monthlyCategoryComparison.scores.bitcoin;

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatBtcPrice(value: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// ── Key levels data for display ───────────────────────────────────────────────

const keyLevels = [
  {
    label: 'Kritieke steun',
    value: bitcoinMarket.keyLevels.support1,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/5 border-emerald-500/20',
    implication: 'Bodem-vorming zone. Bounce kansrijk als STH-realized price houdt.',
  },
  {
    label: 'Diepere steun',
    value: bitcoinMarket.keyLevels.support2,
    color: 'text-emerald-300',
    bg: 'bg-emerald-500/5 border-emerald-500/15',
    implication: 'Mocht de eerste steun falen, dan is dit het volgende strategische koopgebied.',
  },
  {
    label: 'Eerste weerstand',
    value: bitcoinMarket.keyLevels.resistance1,
    color: 'text-red-400',
    bg: 'bg-red-500/5 border-red-500/20',
    implication: 'Doorbreken bevestigt herstel. Verwacht verkoopdruk bij eerste test.',
  },
];

export default function BitcoinPage() {
  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 max-w-7xl space-y-10">

      {/* ── 1. Page header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg text-amber-400 font-bold">₿</span>
            <span className="text-xs text-amber-500 font-semibold uppercase tracking-wider">
              Bitcoin
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">Bitcoin</h1>
          <p className="text-sm text-slate-400 mt-1">
            Marktintelligentie &amp; Analyse
          </p>
        </div>

        {/* Price + change block */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="bg-[#111827] border border-[#1e2d45] rounded-xl px-4 py-3 flex items-center gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Bitcoin prijs</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-100 font-mono tabular-nums">
                {formatBtcPrice(bitcoinMarket.currentPrice)}
              </p>
            </div>
            <div className="flex flex-col gap-1 border-l border-[#1e2d45] pl-4">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500">24u</span>
                <ChangeIndicator value={bitcoinMarket.changePercent24h} />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500">7d</span>
                <ChangeIndicator value={bitcoinMarket.changePercent7d} />
              </div>
            </div>
          </div>
          <DataStatusBadge
            status={bitcoinMarket.dataStatus}
            lastUpdated={bitcoinMarket.lastUpdated}
            showTime={true}
          />
        </div>
      </div>

      {/* ── Guidance banner ───────────────────────────────────────────────────── */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3.5 flex items-start gap-3">
        <span className="text-amber-600 text-base mt-0.5 flex-shrink-0">ℹ</span>
        <p className="text-sm text-slate-400 leading-relaxed">
          Op deze pagina vind je een gedetailleerde analyse van Bitcoin: koers, Fear &amp; Greed-index, technische niveaus,
          actieve signalen en handelskansen. Bitcoin is een volatiel instrument — gebruik altijd een stop-loss.
        </p>
      </div>

      {/* ── 2. BitcoinSignalGrid ────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHeader
          title="Marktsignalen &amp; Sleutelniveaus"
          subtitle="On-chain data, sentiment en technische niveaus"
        />
        <BitcoinSignalGrid market={bitcoinMarket} />
      </div>

      {/* ── 3. Drie perspectieven ───────────────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeader
          title="Bitcoin advies — drie perspectieven"
          subtitle="Intraday, maandelijks en structureel — elk met eigen tijdshorizon"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Intraday — Nu */}
          <div className="bg-[#111827] border border-[#1e2d45] rounded-xl overflow-hidden flex flex-col">
            <div className="px-4 pt-4 pb-3 border-b border-[#1e2d45]">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-blue-500/15 border border-blue-500/25 text-blue-400 font-semibold">
                  Nu — Intraday
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-100">Bitcoin trade setup</h3>
              <p className="text-xs text-slate-400 mt-0.5">Steunzone retest — korte termijn</p>
            </div>
            <div className="px-4 py-4 flex-1 space-y-3">
              {/* Setup details */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Entry zone', value: btcSetup.entryZone, color: 'text-slate-200' },
                  { label: 'Stop-loss', value: btcSetup.stopLoss, color: 'text-red-400' },
                  { label: 'Target 1', value: btcSetup.target1, color: 'text-emerald-400' },
                  { label: 'R/R ratio', value: `${btcSetup.riskReward}x`, color: 'text-amber-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-[#0f1623] border border-[#1e2d45] rounded-lg px-2.5 py-2">
                    <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                    <p className={`text-sm font-semibold font-mono ${color}`}>{value}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1.5">Tradeability</p>
                <TradeabilityBadge state={btcSetup.tradeabilityState} />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1.5">Katalysator</p>
                <p className="text-xs text-slate-300 leading-relaxed">{btcSetup.catalyst}</p>
              </div>
              {btcSetup.notes && (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2">
                  <p className="text-xs text-slate-300 italic leading-relaxed">{btcSetup.notes}</p>
                </div>
              )}
              <ScoreBar score={btcSetup.confidenceScore} label="Betrouwbaarheid" size="sm" />
            </div>
          </div>

          {/* Maandelijks — Deze maand */}
          <div className="bg-[#111827] border border-[#1e2d45] rounded-xl overflow-hidden flex flex-col">
            <div className="px-4 pt-4 pb-3 border-b border-[#1e2d45]">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-violet-500/15 border border-violet-500/25 text-violet-400 font-semibold">
                  Deze maand — Maandelijks
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-100">Maandelijkse allocatie</h3>
              <p className="text-xs text-slate-400 mt-0.5">{monthlyAdvice.subtitle}</p>
            </div>
            <div className="px-4 py-4 flex-1 space-y-3">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Bitcoin score deze maand</p>
                <ScoreBar score={btcScore} label="Bitcoin" size="sm" />
              </div>
              <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg px-3 py-2.5">
                <p className="text-xs text-slate-500 mb-1">Maandcontext</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Bitcoin tijdelijk minder aantrekkelijk door ETF-uitstroom, maar fundamentals op lange termijn intact. Maandelijkse allocatie beperken tot max 10%.
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1.5">Allocatie-advies</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${monthlyCategoryComparison.sampleAllocation.bitcoin * 4}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-amber-400 tabular-nums">
                    {monthlyCategoryComparison.sampleAllocation.bitcoin}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">van totale maandelijkse inleg</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1.5">Vermijden deze maand</p>
                <ul className="space-y-1">
                  {monthlyCategoryComparison.avoidThisMonth
                    .filter((a) => a.toLowerCase().includes('crypto') || a.toLowerCase().includes('altcoin'))
                    .map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-slate-400">
                        <span className="mt-1 w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Lange termijn — Structureel */}
          <div className="bg-[#111827] border border-amber-500/15 rounded-xl overflow-hidden flex flex-col">
            <div className="px-4 pt-4 pb-3 border-b border-amber-500/15">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/25 text-amber-400 font-semibold">
                  Structureel — Lange termijn
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-100">Fundamenteel narratief</h3>
              <p className="text-xs text-slate-400 mt-0.5">Halving-cyclus &amp; institutioneel momentum</p>
            </div>
            <div className="px-4 py-4 flex-1 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Bitcoin bevindt zich structureel in een bull-markt post-halving cyclus (april 2024). Historisch bereiken markten een piek 12–18 maanden na de halving, wat richting eind 2025 wijst. Institutionele instroom via spot-ETFs heeft het marktlandschap fundamenteel veranderd.
              </p>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">LTH-signalen</p>
                <ul className="space-y-2">
                  {[
                    'LTH-houders (>6 mnd) verkopen structureel niet — 74,2% van supply',
                    'Elke halving heeft historisch geleid tot hogere all-time highs',
                    'ETF-adoptie verlaagt effectief beschikbare supply op exchanges',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500/60 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2.5">
                <p className="text-xs text-amber-400 font-medium mb-1">Halving context</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Halving april 2024 heeft de nieuwe bitcoin-uitgifte gehalveerd. Bij gelijkblijvende of stijgende vraag heeft dit historisch geleid tot hogere prijzen op een horizon van 12–24 maanden.
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1.5">Structureel risico</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Regulatoire ingrepen, macro-recessie en verlies van institutioneel vertrouwen zijn de drie voornaamste risico&apos;s op lange termijn. Geen van deze materialiseert momenteel.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── 4. Bitcoin scenario's + sleutelniveaus ─────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeader
          title="Bitcoin scenario&apos;s"
          subtitle="Drie marktuitkomsten voor de komende sessie(s)"
        />
        <ScenarioPanel scenarios={dailyAdvice.scenarios} />

        {/* Key levels with implications */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          {keyLevels.map(({ label, value, color, bg, implication }) => (
            <div key={label} className={`rounded-xl border px-4 py-3 flex flex-col gap-2 ${bg}`}>
              <p className="text-xs text-slate-500">{label}</p>
              <p className={`text-base font-bold font-mono ${color}`}>{value}</p>
              <p className="text-xs text-slate-400 leading-snug">{implication}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Bitcoin nieuwsitems ──────────────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeader
          title="Bitcoin nieuwsitems"
          subtitle={`${btcNewsItems.length} items die direct betrekking hebben op Bitcoin`}
          badge={
            <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/25 text-amber-400 font-medium">
              {btcNewsItems.length} items
            </span>
          }
        />
        <NewsList
          items={btcNewsItems}
          defaultFilter="bitcoin"
          showFilterBar={false}
        />
      </div>

      {/* ── 6. On-chain signaleninterpretatie ──────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeader
          title="On-chain signalen — interpretatie"
          subtitle="Wat betekenen de signalen in combinatie?"
        />
        <div className="bg-[#111827] border border-[#1e2d45] rounded-xl px-5 py-5 space-y-4">
          <p className="text-sm text-slate-200 leading-relaxed">
            <span className="text-amber-400 font-semibold">Interpretatie van de signalen:</span>{' '}
            LTH-stabiliteit is het sterkste fundamentele signaal — 74,2% van alle Bitcoin wordt vastgehouden door langetermijn-investeerders die niet van plan zijn te verkopen. Dit wijst op een gezonde marktstructuur.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-3">
              <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wide mb-1.5">
                Sterkste fundamentele signaal
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                LTH-stabiliteit (74,2%) suggereert dat de huidige correctie door zwakke handen gedreven wordt, niet door structurele exit. Historisch volgt na dergelijke fasen een hervatting van de opwaartse trend.
              </p>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-3">
              <p className="text-xs text-red-400 font-semibold uppercase tracking-wide mb-1.5">
                Grootste korte-termijn risico
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                ETF-uitstroom van -$1,2 miljard in 7 dagen is het grootste directe risico. Institutionele uitstroom creëert verkoopdruk die moeilijk te absorberen is door retail. Dagelijkse stroomdata is cruciaal om te monitoren.
              </p>
            </div>
            <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg px-3 py-3">
              <p className="text-xs text-orange-400 font-semibold uppercase tracking-wide mb-1.5">
                Sentiment als contra-indicator
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fear &amp; Greed van 38 (Angst) is historisch gezien een fase waarin langetermijn-kopers actief worden. Extreme angst is statistisch een betere kooptiming dan extreme hebzucht — maar timing blijft onzeker.
              </p>
            </div>
          </div>
          <div className="border-t border-[#1e2d45] pt-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              <span className="text-slate-400 font-medium">Conclusie:</span> De signalen zijn gemengd — fundamenteel gezond (LTH), maar korte termijn onder druk (ETF-uitstroom, STH-realized price als weerstand). Dit is een typisch patroon voor een correctiefase in een bredere bull-markt cyclus.
            </p>
          </div>
        </div>
      </div>

      {/* ── 7. Disclaimer ──────────────────────────────────────────────────────── */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl px-5 py-4">
        <div className="flex items-start gap-3">
          <svg className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p className="text-xs text-slate-500 leading-relaxed">
            Bitcoin heeft significant hogere volatiliteit dan traditionele assets. Positiegrootte dient hierop afgestemd te zijn. Correcties van 20–40% zijn normaal in bull-markten. Investeer nooit meer dan u zich kunt veroorloven te verliezen.{' '}
            <span className="text-slate-600">
              Deze informatie is niet op te vatten als beleggingsadvies.
            </span>
          </p>
        </div>
      </div>

    </div>
  );
}
