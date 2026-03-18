'use client';

import { useState } from 'react';
import {
  bitcoinMarket as mockBitcoinMarket,
  tradeSetups,
  allNewsItems,
  monthlyCategoryComparison,
  MOCK_REFERENCE_NOW,
} from '@/lib/mockData';
import { useBitcoin } from '@/hooks/useBitcoin';
import ChangeIndicator from '@/components/common/ChangeIndicator';
import ScoreBar from '@/components/common/ScoreBar';
import NewsList from '@/components/news/NewsList';

// ─── Derived data ─────────────────────────────────────────────────────────────

const btcSetup = tradeSetups.find((s) => s.ticker === 'BTC') ?? tradeSetups[2];
const btcNewsItems = allNewsItems.filter((n) =>
  n.affectedCategories.includes('bitcoin')
);
const btcAllocationPct = monthlyCategoryComparison.sampleAllocation.bitcoin;
const btcScore = monthlyCategoryComparison.scores.bitcoin;

// ─── Static display strings (derived from fixed mock reference — hydration safe) ─

const _ref = new Date(MOCK_REFERENCE_NOW);
const _upd = new Date('2026-03-13T14:45:00.000Z');

const CURRENT_MONTH = _ref.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' }); // "maart 2026"
const UPDATED_LABEL =
  _upd.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }) +
  ', ' +
  _upd.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }) +
  ' CET';

// ─── Format helper ────────────────────────────────────────────────────────────

function fmtEur(n: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

// ─── Recommendation config ────────────────────────────────────────────────────

const recoConfig = {
  'bevestiging-nodig': {
    label: 'Wacht op bevestiging',
    badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
    dotColor: 'bg-amber-400',
    riskLabel: 'Verhoogd',
    riskBg: 'bg-orange-500/15 border-orange-500/30 text-orange-400',
    summary:
      'Bitcoin bevindt zich in een steunzone, maar er is nog geen duidelijk koopsignaal. Wacht op een bevestiging — een duidelijke omkeringskaarrs of volume-bevestiging — voor je instapt.',
    actionToday: `Koopzone €60.500–€62.000 is actief. Wacht op een herstel-signaal (reversal-candle + volume) voor je instapt. Stop-loss altijd op €58.500 instellen.`,
    actionMonth: `Maximaal ${btcAllocationPct}% van je maandelijkse inleg in Bitcoin. Spreid over meerdere weken (DCA) om instaprisico te verlagen.`,
    actionLongTerm:
      'Structureel positief. De halvering-cyclus is intact. Grote correcties zijn historisch gezien koopkansen voor beleggers met een horizon van 2+ jaar.',
  },
  actionable: {
    label: 'Entry mogelijk',
    badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    dotColor: 'bg-emerald-400',
    riskLabel: 'Gemiddeld',
    riskBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
    summary:
      'Er is een duidelijk instapmoment. Technische condities en signalen wijzen op een mogelijke opstoot.',
    actionToday: 'Entry zone actief. Bevestig met volume voor je instapt.',
    actionMonth: 'Reguliere maandelijkse allocatie is van toepassing.',
    actionLongTerm: 'Structureel bullish. Halvering-cyclus intact.',
  },
  'alleen-observeren': {
    label: 'Alleen observeren',
    badgeBg: 'bg-slate-700/50 border-slate-600 text-slate-300',
    dotColor: 'bg-slate-400',
    riskLabel: 'Verhoogd',
    riskBg: 'bg-orange-500/15 border-orange-500/30 text-orange-400',
    summary:
      'Condities zijn onduidelijk. Observeer de markt en wacht op een duidelijker signaal voor je actie onderneemt.',
    actionToday: 'Geen posities innemen. Prijsontwikkeling volgen.',
    actionMonth: 'Minimale allocatie of geen. Betere momenten komen.',
    actionLongTerm: 'Langetermijnverhaal intact, maar timing is ongunstig.',
  },
  vermijden: {
    label: 'Vermijden',
    badgeBg: 'bg-red-500/15 border-red-500/30 text-red-400',
    dotColor: 'bg-red-400',
    riskLabel: 'Hoog',
    riskBg: 'bg-red-500/15 border-red-500/30 text-red-400',
    summary:
      'Condities zijn ongunstig. Wacht op betere omstandigheden voor je instapt.',
    actionToday: 'Geen posities innemen.',
    actionMonth: 'Geen allocatie deze maand.',
    actionLongTerm: 'Langetermijnverhaal intact, maar timing is ongunstig.',
  },
} as const;

type RecoKey = keyof typeof recoConfig;
const recoKey: RecoKey =
  btcSetup.tradeabilityState in recoConfig
    ? (btcSetup.tradeabilityState as RecoKey)
    : 'bevestiging-nodig';
const reco = recoConfig[recoKey];

// ─── "Why" signals (built inside component to use live data) ──────────────────

// ─── Key levels ───────────────────────────────────────────────────────────────

const keyLevels = [
  {
    label: 'Steun 2',
    helper: 'Dieper vangnet',
    value: mockBitcoinMarket.keyLevels.support2,
    note: 'Als de eerste steun bezwijkt, is dit het volgende strategische koopgebied.',
    colorText: 'text-emerald-300',
    colorBg: 'bg-emerald-500/5 border-emerald-500/15',
    dotColor: 'bg-emerald-300',
  },
  {
    label: 'Steun 1',
    helper: 'Interessante koopzone',
    value: mockBitcoinMarket.keyLevels.support1,
    note: 'Huidige steunzone. Bounce kansrijk als volume dit bevestigt.',
    colorText: 'text-emerald-400',
    colorBg: 'bg-emerald-500/8 border-emerald-500/25',
    dotColor: 'bg-emerald-400',
  },
  {
    label: 'Weerstand 1',
    helper: 'Eerste horde omhoog',
    value: mockBitcoinMarket.keyLevels.resistance1,
    note: 'Doorbreken hiervan bevestigt herstel richting €72k.',
    colorText: 'text-red-400',
    colorBg: 'bg-red-500/8 border-red-500/25',
    dotColor: 'bg-red-400',
  },
  {
    label: 'Weerstand 2',
    helper: 'Tweede zone',
    value: mockBitcoinMarket.keyLevels.resistance2,
    note: 'Doel bij sterker herstelscenario. Verwacht aanbod in deze zone.',
    colorText: 'text-red-300',
    colorBg: 'bg-red-500/5 border-red-500/15',
    dotColor: 'bg-red-300',
  },
] as const;

// ─── Bitcoin-specific scenarios ───────────────────────────────────────────────

const btcScenarios = [
  {
    variant: 'bullish' as const,
    label: 'Positief scenario',
    condition: 'Steun €60k–€62k houdt',
    implication: 'Herstel richting €67k–€72k mogelijk in de komende weken.',
    probability: '35%',
    watch: ['Bounce op €60k–€62k met hoog volume', 'ETF-instroom keert positief', 'Fear & Greed stijgt boven 50'],
    colorBg: 'bg-emerald-500/10 border-emerald-500/20',
    colorLabel: 'text-emerald-400',
    probBg: 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400',
  },
  {
    variant: 'bearish' as const,
    label: 'Negatief scenario',
    condition: 'Steun €60k bezwijkt',
    implication: 'Verdere daling naar €54k–€57k zone mogelijk.',
    probability: '30%',
    watch: ['Dagelijkse sluit onder €58.500', 'Aanhoudende ETF-uitstroom', 'Fear & Greed daalt onder 25'],
    colorBg: 'bg-red-500/10 border-red-500/20',
    colorLabel: 'text-red-400',
    probBg: 'bg-red-500/15 border-red-500/25 text-red-400',
  },
  {
    variant: 'neutral' as const,
    label: 'Neutraal scenario',
    condition: 'Consolidatie zonder richting',
    implication: 'Koers beweegt zijwaarts tussen €60k en €67k. Geduld vereist.',
    probability: '35%',
    watch: ['Bitcoin houdt €60k–€67k range', 'Laag volume', 'Geen grote ETF-bewegingen'],
    colorBg: 'bg-slate-700/30 border-slate-600/40',
    colorLabel: 'text-slate-300',
    probBg: 'bg-slate-700/50 border-slate-600 text-slate-400',
  },
] as const;

// ─── On-chain signal plain explanations ──────────────────────────────────────

const signalExplanations: Record<string, string> = {
  'btc-sig-1':
    'Mensen die Bitcoin al meer dan 6 maanden bezitten, houden vast. Zolang zij niet verkopen, blijft de marktstructuur gezond.',
  'btc-sig-2':
    'Grote beleggers halen geld weg uit Bitcoin-fondsen (ETFs). Dit veroorzaakt extra verkoopdruk op korte termijn.',
  'btc-sig-3':
    'Hoe banger de markt, hoe lager dit getal. Historisch zijn angst-niveaus potentiële kooptijden gebleken — maar timing is onzeker.',
  'btc-sig-4':
    'Bitcoin versus alle andere cryptomunten. Hoge dominantie betekent: beleggers kiezen Bitcoin boven risicovollere alternatieven.',
  'btc-sig-5':
    'De gemiddelde aankoopprijs van recente kopers (~€61.000). Zolang Bitcoin hier vlakbij zit, is er verkoopdruk van mensen die break-even willen sluiten.',
};

// ─── Page component ───────────────────────────────────────────────────────────

export default function BitcoinPage() {
  const [tab, setTab] = useState<'today' | 'month' | 'longterm'>('today');
  const { data: liveData } = useBitcoin();

  // Use live data when available, fall back to mock
  const bitcoinMarket = liveData?.ok ? {
    ...mockBitcoinMarket,
    currentPrice: liveData.price,
    changePercent24h: liveData.changePercent24h,
    changePercent7d: liveData.changePercent7d,
    fearGreedIndex: liveData.fearGreedIndex,
    fearGreedLabel: liveData.fearGreedLabel,
    dominance: liveData.dominance,
    dataStatus: 'live' as const,
    lastUpdated: liveData.lastUpdated,
  } : mockBitcoinMarket;
  const isLive = !!(liveData?.ok);

  const fgIndex = bitcoinMarket.fearGreedIndex;
  const fgLabel = liveData?.ok ? liveData.fearGreedLabel : 'Angst';
  const fgIcon = fgIndex >= 75 ? '↑' : fgIndex >= 50 ? '→' : '↓';
  const fgSentimentText = fgIndex >= 75 ? 'Extreme hebzucht — voorzichtigheid geboden'
    : fgIndex >= 55 ? 'Hebzucht — markt is optimistisch'
    : fgIndex >= 45 ? 'Neutraal — wacht op bevestiging'
    : fgIndex >= 25 ? 'Angst — historisch potentieel koopmoment'
    : 'Extreme angst — mogelijk sterk koopmoment maar timing onzeker';

  const whySignals = [
    {
      icon: '↑',
      title: 'Ervaren houders verkopen niet',
      technical: 'LTH HODL Wave stabiel op 75,8%',
      plain:
        '75,8% van alle Bitcoin wordt vastgehouden door mensen die al meer dan 6 maanden bezitten. Die verkopen nu niet. Dit is een teken van langdurige overtuiging in de markt.',
      impact: 'Positief voor de prijs op termijn',
      colorText: 'text-emerald-400',
      bgClass: 'bg-emerald-500/10 border-emerald-500/20',
      impactBg: 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400',
    },
    {
      icon: '↓',
      title: 'Grote fondsen trekken zich terug',
      technical: 'ETF-uitstroom: −€832 mln in 7 dagen',
      plain:
        'In de afgelopen week hebben grote beleggers voor €832 miljoen aan Bitcoin-fondsen verkocht. Dit creëert verkoopdruk en zet de prijs op korte termijn onder druk.',
      impact: 'Negatief op korte termijn',
      colorText: 'text-red-400',
      bgClass: 'bg-red-500/10 border-red-500/20',
      impactBg: 'bg-red-500/15 border-red-500/25 text-red-400',
    },
    {
      icon: fgIcon,
      title: `Markt sentiment: ${fgLabel}`,
      technical: `Fear & Greed Index: ${fgIndex}${isLive ? ' (live)' : ''}`,
      plain:
        `De Fear & Greed-index meet of de markt hebzuchtig of bang is. Op ${fgIndex} is de stemming: ${fgLabel}. Historisch gezien koopt men het best als anderen bang zijn — maar timing blijft onzeker.`,
      impact: fgSentimentText,
      colorText: fgIndex >= 60 ? 'text-amber-400' : fgIndex >= 45 ? 'text-slate-300' : 'text-emerald-400',
      bgClass: fgIndex >= 60 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-slate-700/30 border-slate-600/40',
      impactBg: fgIndex >= 60 ? 'bg-amber-500/15 border-amber-500/25 text-amber-400' : 'bg-slate-700/50 border-slate-600 text-slate-400',
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 max-w-4xl space-y-8">

      {/* ── 1. HERO DECISION CARD ──────────────────────────────────────────────── */}
      <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl overflow-hidden">

        {/* Price + recommendation header */}
        <div className="px-5 pt-5 pb-5 border-b border-[#1e2d45]">
          <div className="flex items-start justify-between gap-4 flex-wrap">

            {/* Left: price block */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-lg text-amber-400 font-bold leading-none">₿</span>
                <span className="text-xs text-amber-500 font-semibold uppercase tracking-wider">Bitcoin</span>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-slate-100 tabular-nums font-mono leading-none">
                {fmtEur(bitcoinMarket.currentPrice)}
              </p>
              <div className="flex items-center gap-2.5 mt-2 flex-wrap">
                <span className="text-xs text-slate-500">24u</span>
                <ChangeIndicator value={bitcoinMarket.changePercent24h} />
                <span className="text-slate-700">·</span>
                <span className="text-xs text-slate-500">7d</span>
                <ChangeIndicator value={bitcoinMarket.changePercent7d} />
              </div>
              <p className="text-xs text-slate-600 mt-2 flex items-center gap-1.5">
                {isLive ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-600">Live koers via CoinGecko</span>
                  </>
                ) : (
                  `Koersdata: ${UPDATED_LABEL} (15 min vertraging)`
                )}
              </p>
            </div>

            {/* Right: recommendation + badges */}
            <div className="flex flex-col gap-2 items-start sm:items-end">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold ${reco.badgeBg}`}>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${reco.dotColor}`} />
                {reco.label}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded border text-xs font-medium ${reco.riskBg}`}>
                Risico: {reco.riskLabel}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500">Betrouwbaarheid:</span>
                <span className="text-xs font-bold text-slate-200">{btcSetup.confidenceScore}/10</span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-medium">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Geschikt voor beginners
              </span>
            </div>
          </div>

          {/* Summary */}
          <p className="text-sm text-slate-300 leading-relaxed mt-4 max-w-2xl">
            {reco.summary}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#1e2d45]">
          {(
            [
              { key: 'today', label: 'Vandaag' },
              { key: 'month', label: 'Deze maand' },
              { key: 'longterm', label: 'Lange termijn' },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 px-3 py-3 text-sm font-medium transition-colors border-b-2 ${
                tab === key
                  ? 'text-amber-400 border-amber-400'
                  : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="px-5 py-5">
          {/* ── Vandaag ── */}
          {tab === 'today' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Wat doe je vandaag?</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  {
                    label: 'Koopzone',
                    value: btcSetup.entryZone,
                    color: 'text-slate-200',
                    bg: 'bg-[#0f1623] border-[#1e2d45]',
                    note: 'Instapprijs',
                  },
                  {
                    label: 'Stop-loss',
                    value: btcSetup.stopLoss,
                    color: 'text-red-400',
                    bg: 'bg-red-500/5 border-red-500/20',
                    note: 'Maximaal verlies',
                  },
                  {
                    label: 'Eerste doel',
                    value: btcSetup.target1,
                    color: 'text-emerald-400',
                    bg: 'bg-emerald-500/5 border-emerald-500/20',
                    note: 'Winstdoelstelling',
                  },
                  {
                    label: 'R/R verhouding',
                    value: `${btcSetup.riskReward}×`,
                    color: 'text-amber-400',
                    bg: 'bg-amber-500/5 border-amber-500/20',
                    note: 'Risico vs. opbrengst',
                  },
                ].map(({ label, value, color, bg, note }) => (
                  <div key={label} className={`rounded-xl border px-3 py-3 flex flex-col gap-1 ${bg}`}>
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className={`text-sm font-bold font-mono leading-tight ${color}`}>{value}</p>
                    <p className="text-xs text-slate-600">{note}</p>
                  </div>
                ))}
              </div>
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3">
                <p className="text-xs text-amber-500 font-medium mb-1">Advies voor nu</p>
                <p className="text-sm text-slate-300 leading-relaxed">{reco.actionToday}</p>
              </div>
              {btcSetup.notes && (
                <p className="text-xs text-slate-600 italic leading-relaxed">{btcSetup.notes}</p>
              )}
            </div>
          )}

          {/* ── Deze maand ── */}
          {tab === 'month' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                Wat doe je deze maand ({CURRENT_MONTH})?
              </p>

              {/* Allocation bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-500">Aanbevolen allocatie van je maandelijkse inleg</span>
                  <span className="text-xl font-bold text-amber-400 tabular-nums">{btcAllocationPct}%</span>
                </div>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${Math.min(btcAllocationPct * 4, 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#0f1623] border border-[#1e2d45] rounded-xl px-4 py-3.5">
                  <p className="text-xs text-slate-500 mb-2">Bitcoin score deze maand</p>
                  <ScoreBar score={btcScore} label="Score" size="sm" />
                </div>
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3.5">
                  <p className="text-xs text-amber-500 font-medium mb-1">Maandadvies</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{reco.actionMonth}</p>
                </div>
              </div>

              <div className="bg-[#0f1623] border border-[#1e2d45] rounded-xl px-4 py-3.5">
                <p className="text-xs text-slate-500 mb-1.5">Wat is DCA?</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  DCA staat voor <span className="text-slate-300 font-medium">Dollar-Cost Averaging</span> — je koopt elke week of maand een vast bedrag, ongeacht de prijs. Zo koop je soms duur en soms goedkoop, maar vermijd je het risico van één slecht gekozen moment.
                </p>
              </div>
            </div>
          )}

          {/* ── Lange termijn ── */}
          {tab === 'longterm' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                Structurele kijk op lange termijn
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                Bitcoin bevindt zich in een bull-markt na de halvering van april 2024. Historisch bereiken markten een piek 12–18 maanden na een halvering. Institutionele instroom via spot-ETFs heeft de markt structureel veranderd.
              </p>

              <div className="space-y-2.5">
                {[
                  {
                    icon: '↑',
                    text: '75,8% van alle Bitcoin wordt vastgehouden door langetermijnbeleggers die niet verkopen',
                    color: 'text-emerald-400',
                  },
                  {
                    icon: '↑',
                    text: 'Elke halvering heeft historisch geleid tot hogere koersen op een horizon van 12–24 maanden',
                    color: 'text-emerald-400',
                  },
                  {
                    icon: '→',
                    text: 'ETF-adoptie door grote instituten verlaagt het beschikbare aanbod op beurzen — structureel positief',
                    color: 'text-slate-400',
                  },
                  {
                    icon: '↓',
                    text: "Risico's: regulering, macro-recessie, verlies van institutioneel vertrouwen — geen hiervan is momenteel acuut",
                    color: 'text-orange-400',
                  },
                ].map(({ icon, text, color }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className={`text-sm font-bold flex-shrink-0 mt-0.5 w-4 text-center ${color}`}>{icon}</span>
                    <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3.5">
                <p className="text-xs text-amber-500 font-medium mb-1">Halvering — wat betekent dat?</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Elke ~4 jaar wordt de hoeveelheid nieuwe Bitcoin die miners ontvangen gehalveerd. Minder aanbod bij gelijkblijvende of stijgende vraag leidt historisch tot hogere prijzen. De laatste halvering was april 2024.
                </p>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">{reco.actionLongTerm}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── 2. WAAROM DIT ADVIES? ──────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Waarom dit advies?</h2>
          <p className="text-xs text-slate-500 mt-0.5">3 signalen die deze aanbeveling onderbouwen</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {whySignals.map((sig) => (
            <div key={sig.title} className={`rounded-xl border px-4 py-4 flex flex-col gap-3 ${sig.bgClass}`}>
              <div className="flex items-center gap-2.5">
                <span className={`text-base font-bold leading-none ${sig.colorText}`}>{sig.icon}</span>
                <p className="text-sm font-semibold text-slate-200 leading-snug">{sig.title}</p>
              </div>
              <p className="text-xs text-slate-500 font-mono leading-tight">{sig.technical}</p>
              <p className="text-xs text-slate-400 leading-relaxed flex-1">{sig.plain}</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium w-fit ${sig.impactBg}`}>
                {sig.impact}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. SLEUTELNIVEAUS ──────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-100">Sleutelniveaus</h2>
            <p className="text-xs text-slate-500 mt-0.5">Op welke prijzen moet je letten?</p>
          </div>
          <div className="flex items-center gap-2 bg-[#0f1623] border border-[#1e2d45] rounded-lg px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
            <span className="text-xs text-slate-500">Huidige koers:</span>
            <span className="text-sm font-bold text-amber-400 font-mono tabular-nums">
              {fmtEur(bitcoinMarket.currentPrice)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {keyLevels.map((lvl) => (
            <div key={lvl.label} className={`rounded-xl border px-4 py-3.5 flex flex-col gap-2 ${lvl.colorBg}`}>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${lvl.dotColor}`} />
                <p className="text-xs text-slate-500">{lvl.label}</p>
              </div>
              <p className={`text-sm font-bold font-mono leading-tight ${lvl.colorText}`}>{lvl.value}</p>
              <p className="text-xs font-medium text-slate-300">{lvl.helper}</p>
              <p className="text-xs text-slate-500 leading-snug">{lvl.note}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#111827] border border-[#1e2d45] rounded-xl px-4 py-3 flex items-start gap-3">
          <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 mt-1" />
          <p className="text-xs text-slate-400 leading-relaxed">
            Huidige koers{' '}
            <span className="text-amber-400 font-bold font-mono">{fmtEur(bitcoinMarket.currentPrice)}</span>{' '}
            zit <span className="text-slate-200 font-medium">boven steun 1</span> maar{' '}
            <span className="text-slate-200 font-medium">onder weerstand 1</span> — een neutrale positie
            met ruimte naar boven én naar beneden. De eerste steunzone (€60k–€62k) is het kritieke level om in de gaten te houden.
          </p>
        </div>
      </div>

      {/* ── 4. SCENARIO'S ──────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Mogelijke scenario&apos;s</h2>
          <p className="text-xs text-slate-500 mt-0.5">Drie mogelijke uitkomsten voor de komende periode</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {btcScenarios.map((sc) => (
            <div key={sc.variant} className={`rounded-xl border px-4 py-4 flex flex-col gap-3 ${sc.colorBg}`}>
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-semibold ${sc.colorLabel}`}>{sc.label}</p>
                <span className={`flex-shrink-0 inline-flex items-center text-xs px-2 py-0.5 rounded border font-medium ${sc.probBg}`}>
                  {sc.probability}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">{sc.condition}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{sc.implication}</p>
              <div>
                <p className="text-xs text-slate-600 uppercase tracking-wide mb-1.5">Let op</p>
                <div className="flex flex-col gap-1">
                  {sc.watch.map((w, i) => (
                    <p key={i} className="text-xs text-slate-500 leading-snug flex items-start gap-1.5">
                      <span className="mt-1 w-1 h-1 rounded-full bg-slate-600 flex-shrink-0" />
                      {w}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. BITCOIN NIEUWS ──────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Bitcoin nieuws</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {btcNewsItems.length} recente items met directe impact op Bitcoin
          </p>
        </div>
        <NewsList
          items={btcNewsItems}
          defaultFilter="bitcoin"
          showFilterBar={false}
          title=""
        />
      </div>

      {/* ── 6. VERDIEPING — ON-CHAIN SIGNALEN ─────────────────────────────────── */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Verdieping — alle signalen</h2>
          <p className="text-xs text-slate-500 mt-0.5">Voor wie verder wil kijken dan het basisadvies</p>
        </div>
        <div className="bg-[#111827] border border-[#1e2d45] rounded-xl overflow-hidden">
          <div className="divide-y divide-[#1e2d45]">
            {bitcoinMarket.signals.map((sig) => {
              const sentColor =
                sig.sentiment === 'bullish'
                  ? 'text-emerald-400 bg-emerald-500/15'
                  : sig.sentiment === 'bearish'
                  ? 'text-red-400 bg-red-500/15'
                  : 'text-slate-400 bg-slate-700/50';
              const sentLabel =
                sig.sentiment === 'bullish' ? '↑ Positief' : sig.sentiment === 'bearish' ? '↓ Negatief' : '→ Neutraal';
              const valueColor =
                sig.sentiment === 'bullish'
                  ? 'text-emerald-400'
                  : sig.sentiment === 'bearish'
                  ? 'text-red-400'
                  : 'text-slate-300';
              const impLabel =
                sig.importance === 'hoog'
                  ? 'Hoge impact'
                  : sig.importance === 'gemiddeld'
                  ? 'Gemiddelde impact'
                  : 'Lage impact';

              return (
                <div key={sig.id} className="px-5 py-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-sm font-semibold text-slate-200">{sig.label}</p>
                        <span className="text-xs text-slate-600">·</span>
                        <span className="text-xs text-slate-500">{impLabel}</span>
                      </div>
                      <p className={`text-sm font-bold font-mono ${valueColor}`}>{sig.value}</p>
                    </div>
                    <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded font-medium ${sentColor}`}>
                      {sentLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {signalExplanations[sig.id] ?? sig.interpretation}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="px-5 py-4 bg-[#0f1623] border-t border-[#1e2d45]">
            <p className="text-xs text-slate-500 font-medium mb-1">Conclusie</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              De signalen zijn gemengd: de structurele fundamentals zijn gezond (lange termijn houders verkopen
              niet), maar de korte termijn staat onder druk door institutionele uitstroom. Dit is een typisch
              patroon in een correctiefase binnen een bredere opwaartse trend.
            </p>
          </div>
        </div>
      </div>

      {/* ── 7. DISCLAIMER ──────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-slate-800/30 border border-slate-700/40">
        <svg
          className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
        <p className="text-xs text-slate-600 leading-relaxed">
          Bitcoin kent significante prijsschommelingen. Correcties van 20–40% zijn normaal, ook in opwaartse
          trends. Investeer alleen geld dat je kunt missen, gebruik altijd een stop-loss, en beschouw dit
          dashboard als beslissingsondersteuning — niet als financieel advies.
        </p>
      </div>

    </div>
  );
}
