'use client';

import { dailyAdvice, dailySummary, tradeSetups, allNewsItems } from '@/lib/mockData';
import { getCurrentMarketSession } from '@/lib/utils';
import AdviceCard from '@/components/advice/AdviceCard';
import SetupList from '@/components/setup/SetupList';
import NewsList from '@/components/news/NewsList';
import SectionHeader from '@/components/common/SectionHeader';

// ── Market quality helper ──────────────────────────────────────────────────────

type MarketQuality = 'uitstekend' | 'goed' | 'matig' | 'slecht' | 'vermijden';

function getQualityStyle(q: MarketQuality) {
  switch (q) {
    case 'uitstekend':
      return {
        bg: 'bg-emerald-500/15',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        label: 'Uitstekend',
      };
    case 'goed':
      return {
        bg: 'bg-blue-500/15',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        label: 'Goed',
      };
    case 'matig':
      return {
        bg: 'bg-amber-500/15',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        label: 'Matig',
      };
    case 'slecht':
      return {
        bg: 'bg-orange-500/15',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
        label: 'Slecht',
      };
    case 'vermijden':
      return {
        bg: 'bg-red-500/15',
        border: 'border-red-500/30',
        text: 'text-red-400',
        label: 'Vermijden',
      };
  }
}

function getSessionStyle(isOpen: boolean) {
  return isOpen
    ? { bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' }
    : { bg: 'bg-slate-700/30', border: 'border-slate-600', text: 'text-slate-400', dot: 'bg-slate-500' };
}

const disciplineRules = [
  'VIX >22: positiegrootte halveren',
  'Stop-loss altijd instellen voor entry',
  'Max 1–2 setups per dag',
  'CPI/Fed-dagen: alleen bij zeer sterke setup',
  'Twijfel = niet handelen',
];

export default function DaghandelPage() {
  const session = getCurrentMarketSession();
  const quality = dailySummary.marketQuality;
  const qualityStyle = getQualityStyle(quality);
  const sessionStyle = getSessionStyle(session.isOpen);

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 max-w-7xl space-y-8">

      {/* ── 1. Page header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">Daghandel</h1>
          <p className="text-sm text-slate-400 mt-1">
            Wat is vandaag de kans, als die er al is?
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Session badge */}
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${sessionStyle.bg} ${sessionStyle.border} ${sessionStyle.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sessionStyle.dot} ${session.isOpen ? 'animate-pulse' : ''}`} />
            {session.label}
          </span>
          {/* Market quality badge */}
          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-bold ${qualityStyle.bg} ${qualityStyle.border} ${qualityStyle.text}`}>
            Kwaliteit: {qualityStyle.label}
          </span>
        </div>
      </div>

      {/* ── Guidance banner ───────────────────────────────────────────────────── */}
      <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl px-4 py-3.5 flex items-start gap-3">
        <span className="text-slate-500 text-base mt-0.5 flex-shrink-0">ℹ</span>
        <p className="text-sm text-slate-400 leading-relaxed">
          Daghandel is voor korte posities die je dezelfde dag of volgende sessie sluit.
          Je ziet hier de kwaliteit van de markt vandaag, concrete setups en discipline-regels.
          <span className="text-amber-400 font-medium"> Twijfel je? Dan is het signaal: niet handelen.</span>
        </p>
      </div>

      {/* ── 2. Daily summary strip ─────────────────────────────────────────────── */}
      <div className="bg-[#111827] border border-[#1e2d45] rounded-xl overflow-hidden">
        <div className="px-5 pt-5 pb-4 border-b border-[#1e2d45]">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">
            Dagelijkse samenvatting — {dailySummary.date}
          </p>
          <h2 className="text-base font-bold text-slate-100">{dailySummary.adviceTitle}</h2>
        </div>

        {/* Top opportunity + risk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#1e2d45]">
          <div className="px-5 py-4">
            <p className="text-xs text-emerald-500 uppercase tracking-wide font-medium mb-1.5">
              Beste kans vandaag
            </p>
            <p className="text-sm text-slate-200 leading-relaxed">{dailySummary.topOpportunity}</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs text-red-500 uppercase tracking-wide font-medium mb-1.5">
              Grootste risico vandaag
            </p>
            <p className="text-sm text-slate-200 leading-relaxed">{dailySummary.topRisk}</p>
          </div>
        </div>

        {/* No-trade condition */}
        {dailySummary.noTradeCondition && (
          <div className="px-5 py-3 border-t border-[#1e2d45]">
            <div className="bg-amber-500/8 border border-amber-500/25 rounded-lg px-4 py-3">
              <p className="text-xs text-amber-500 uppercase tracking-wide font-medium mb-1">
                Conditie: niet handelen
              </p>
              <p className="text-sm text-slate-200 leading-snug">{dailySummary.noTradeCondition}</p>
            </div>
          </div>
        )}

        {/* Discipline note */}
        <div className="px-5 py-3 border-t border-[#1e2d45]">
          <div className="border border-slate-700/60 rounded-lg px-4 py-3">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
              Discipline
            </p>
            <p className="text-sm text-slate-400 italic leading-snug">{dailySummary.disciplineNote}</p>
          </div>
        </div>
      </div>

      {/* ── 3. Advice voor vandaag ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHeader
          title="Advies voor vandaag"
          subtitle="Gebaseerd op huidige marktomstandigheden en actieve setups"
        />
        <AdviceCard advice={dailyAdvice} mode="daghandel" />
      </div>

      {/* ── 4. Setups van vandaag ──────────────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHeader
          title="Setups van vandaag"
          subtitle="Actieve handelskansen gesorteerd op tradeability"
        />
        <SetupList setups={tradeSetups} />
      </div>

      {/* ── 5. Relevant nieuws vandaag ─────────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHeader
          title="Relevante nieuwsitems vandaag"
          subtitle="Nieuws met directe invloed op de daghandel"
        />
        <div className="max-h-[600px] overflow-y-auto pr-1 space-y-0">
          <NewsList
            items={allNewsItems}
            defaultFilter="relevant"
            showFilterBar={true}
          />
        </div>
      </div>

      {/* ── 6. Market session status ───────────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHeader title="Sessie-informatie" />
        <div className="bg-[#111827] border border-[#1e2d45] rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#1e2d45]">
            <div className="px-5 py-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1.5">Sessie</p>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${sessionStyle.dot} ${session.isOpen ? 'animate-pulse' : ''}`} />
                <p className={`text-sm font-semibold ${sessionStyle.text}`}>{session.label}</p>
              </div>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1.5">Status</p>
              <p className={`text-sm font-semibold ${session.isOpen ? 'text-emerald-400' : 'text-slate-400'}`}>
                {session.isOpen ? 'Open voor handel' : 'Gesloten'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                NL-tijd: {session.localTime} | US: {session.usTime}
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1.5">Volgend event</p>
              <p className="text-sm text-slate-300">{session.nextEvent}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 7. Discipline & Risicobeheer ───────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHeader
          title="Discipline &amp; Risicobeheer"
          subtitle="Vaste regels — niet onderhandelbaar"
        />
        <div className="bg-[#111827] border border-slate-700/50 rounded-xl px-5 py-5">
          <ul className="space-y-3">
            {disciplineRules.map((rule, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-700/60 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-400 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-300 leading-snug">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}
