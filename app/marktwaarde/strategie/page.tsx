'use client';

import { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

type TimeHorizon = 'kort' | 'middellang' | 'lang';
type RiskProfile = 'laag' | 'gemiddeld' | 'hoog';
type Goal = 'vermogen' | 'pensioen' | 'aankoop' | 'inkomen' | 'anders';
type Experience = 'beginner' | 'gemiddeld' | 'ervaren';
type BtcInterest = 'geen' | 'klein' | 'normaal';

interface UserProfile {
  monthlyAmount: string;
  horizon: TimeHorizon;
  risk: RiskProfile;
  goal: Goal;
  experience: Experience;
  btcInterest: BtcInterest;
}

interface Tactic {
  title: string;
  description: string;
  allocation: { label: string; percent: number; color: string; bar: string }[];
  examples: string[];
  tip: string;
  accentColor: string;
  borderColor: string;
}

// ── Tactic engine ─────────────────────────────────────────────────────────────

function buildTactics(p: UserProfile): { short: Tactic; medium: Tactic; long: Tactic } {
  const amount = parseFloat(p.monthlyAmount.replace(',', '.')) || 0;
  const isConservative = p.risk === 'laag';
  const isAggressive = p.risk === 'hoog';
  const hasBtc = p.btcInterest !== 'geen';
  const btcPct = p.btcInterest === 'klein' ? 5 : p.btcInterest === 'normaal' ? 15 : 0;
  const isLongHorizon = p.horizon === 'lang';
  const isBeginner = p.experience === 'beginner';

  // Short-term tactic (next 3 months)
  const short: Tactic = {
    title: 'Komende 3 maanden',
    description: isConservative
      ? 'Bouw je cashbuffer op en kijk rustig hoe markten bewegen voordat je belegt.'
      : isBeginner
      ? 'Start klein en leer hoe markten werken. Investeer pas als je begrijpt wat je koopt.'
      : 'Gebruik marktvolatiliteit om gespreid in te stappen op dips.',
    allocation: isConservative
      ? [
          { label: 'Spaarbuffer', percent: 70, color: 'text-slate-400', bar: 'bg-slate-500' },
          { label: "Brede ETF's", percent: 30, color: 'text-blue-400', bar: 'bg-blue-500' },
        ]
      : [
          { label: "Brede ETF's", percent: hasBtc ? 55 : 70, color: 'text-blue-400', bar: 'bg-blue-500' },
          { label: 'Cash reserve', percent: hasBtc ? 35 : 30, color: 'text-slate-400', bar: 'bg-slate-500' },
          ...(hasBtc
            ? [{ label: 'Bitcoin', percent: 10, color: 'text-amber-400', bar: 'bg-amber-500' }]
            : []),
        ],
    examples: isConservative
      ? ['VWRL (Vanguard World ETF)', 'IMAE (iShares Core MSCI World)', 'Hoog-rente spaarrekening']
      : ['VWRL of IWDA als basisposities', 'DCA: elke maand zelfde bedrag', 'Geen individuele aandelen in jaar 1'],
    tip: isConservative
      ? 'Een cashbuffer van 3–6 maanden vaste lasten geeft je rust om ook tijdens dalingen belegd te blijven.'
      : amount > 0
      ? `Bij €${amount.toLocaleString('nl-NL')} per maand: begin met 50% automatisch inleggen en houd 50% achter voor dips.`
      : 'Begin met een vast bedrag per maand — zelfde dag, geen timing.',
    accentColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
  };

  // Medium-term tactic (3–12 months)
  const etfPct = isConservative ? 50 : isAggressive ? 40 : 50;
  const stockPct = isConservative ? 10 : isAggressive ? 30 : 20;
  const cashPct = 100 - etfPct - stockPct - (hasBtc ? btcPct : 0);

  const medium: Tactic = {
    title: 'Komende 3–12 maanden',
    description:
      p.goal === 'aankoop'
        ? 'Houd een groot deel cash of obligaties aan — je hebt dit geld binnenkort nodig.'
        : isLongHorizon
        ? 'Bouw gestaag je positie op. Spreid over meerdere sectoren om risico te beperken.'
        : 'Verbreed je spreiding met meerdere ETF-categorieen en eventueel losse aandelen.',
    allocation: [
      { label: "Brede ETF's", percent: etfPct, color: 'text-blue-400', bar: 'bg-blue-500' },
      { label: 'Sector-ETF of aandelen', percent: stockPct, color: 'text-violet-400', bar: 'bg-violet-500' },
      ...(hasBtc
        ? [{ label: 'Bitcoin', percent: btcPct, color: 'text-amber-400', bar: 'bg-amber-500' }]
        : []),
      { label: 'Cash / buffer', percent: Math.max(cashPct, 10), color: 'text-slate-400', bar: 'bg-slate-500' },
    ],
    examples: [
      'IWDA + EMIM voor wereld + opkomende markten',
      p.goal === 'inkomen' ? 'VHYL (dividend-ETF) voor passief inkomen' : 'IUFS of AAPL/MSFT voor groeiaandelen',
      hasBtc ? `Bitcoin: max ${btcPct}% van portfolio` : 'Herweeg elk kwartaal',
    ],
    tip:
      p.goal === 'aankoop'
        ? 'Geld dat je binnen 1–2 jaar nodig hebt hoort niet in aandelen. Gebruik een spaardeposito of obligatie-ETF.'
        : 'Automatische herbalancering elk kwartaal voorkomt dat één positie te groot wordt.',
    accentColor: 'text-violet-400',
    borderColor: 'border-violet-500/30',
  };

  // Long-term tactic (1+ years)
  const longEtfPct = isConservative ? 65 : isAggressive ? 45 : 55;
  const longStockPct = isConservative ? 5 : isAggressive ? 25 : 15;
  const longBtcPct = hasBtc ? (isAggressive ? btcPct + 5 : btcPct) : 0;
  const longCashPct = 100 - longEtfPct - longStockPct - longBtcPct;

  const long: Tactic = {
    title: 'Lange termijn (1+ jaar)',
    description:
      p.goal === 'pensioen'
        ? 'Compound rente werkt het beste met tijd. Elke maand automatisch inleggen, ook in slecht marktklimaat.'
        : 'Zet je vermogen aan het werk met een kern-satellietstelsel: brede basis + gerichte speculatie.',
    allocation: [
      { label: "Kern-ETF's (wereldwijd)", percent: longEtfPct, color: 'text-blue-400', bar: 'bg-blue-500' },
      { label: 'Kwaliteitsaandelen', percent: longStockPct, color: 'text-violet-400', bar: 'bg-violet-500' },
      ...(hasBtc
        ? [{ label: 'Bitcoin', percent: longBtcPct, color: 'text-amber-400', bar: 'bg-amber-500' }]
        : []),
      { label: 'Cash (dry powder)', percent: Math.max(longCashPct, 5), color: 'text-slate-400', bar: 'bg-slate-500' },
    ],
    examples: [
      'VWRL als core (60–70% van portefeuille)',
      'AAPL, MSFT, NVDA of ASML als kwaliteitsaandelen',
      hasBtc
        ? 'Bitcoin kopen via DCA: zelfde bedrag elke week/maand'
        : 'Dividend herinvesteren vergroot compound effect',
      p.goal === 'pensioen' ? 'Overweeg een box 3-rekening of lijfrenteverzekering' : 'Jaarlijks herbalanceren',
    ],
    tip:
      p.goal === 'pensioen'
        ? 'Iemand die 30 jaar maandelijks €200 inlegt bij 7% gemiddeld rendement bouwt ~€240.000 op. Start vroeg.'
        : 'Verlaag je risico naarmate je dichter bij je doel komt: verschuif van aandelen naar obligaties.',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
  };

  return { short, medium, long };
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function TacticCard({ tactic }: { tactic: Tactic }) {
  const total = tactic.allocation.reduce((s, a) => s + a.percent, 0);
  const normalised = tactic.allocation.map((a) => ({
    ...a,
    pct: Math.round((a.percent / total) * 100),
  }));

  return (
    <div className={`bg-[#111827] border ${tactic.borderColor} rounded-xl overflow-hidden`}>
      <div className={`px-5 pt-5 pb-4 border-b border-[#1e2d45]`}>
        <p className={`text-xs uppercase tracking-wide font-semibold mb-0.5 ${tactic.accentColor}`}>
          {tactic.title}
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">{tactic.description}</p>
      </div>

      {/* Allocation bar */}
      <div className="px-5 pt-4 pb-3">
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Verdeling</p>
        <div className="flex rounded-full overflow-hidden h-3 gap-px mb-3">
          {normalised.map((a) => (
            <div key={a.label} className={`${a.bar} opacity-80`} style={{ width: `${a.pct}%` }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {normalised.map((a) => (
            <div key={a.label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${a.bar}`} />
              <span className={`text-xs ${a.color}`}>
                {a.label}: <span className="font-bold">{a.pct}%</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Examples */}
      <div className="px-5 pb-3">
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Voorbeelden</p>
        <ul className="space-y-1.5">
          {tactic.examples.map((ex, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className={`flex-shrink-0 mt-0.5 ${tactic.accentColor} text-xs`}>→</span>
              <span className="text-sm text-slate-300 leading-snug">{ex}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tip */}
      <div className="px-5 pb-5">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2.5">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1 font-medium">Tip</p>
          <p className="text-sm text-slate-300 leading-snug">{tactic.tip}</p>
        </div>
      </div>
    </div>
  );
}

// ── Select helper ──────────────────────────────────────────────────────────────

function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 rounded-lg border text-sm transition-colors duration-150 ${
              value === opt.value
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 font-medium'
                : 'bg-[#111827] border-[#1e2d45] text-slate-400 hover:border-slate-500 hover:text-slate-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

const defaultProfile: UserProfile = {
  monthlyAmount: '200',
  horizon: 'lang',
  risk: 'gemiddeld',
  goal: 'vermogen',
  experience: 'beginner',
  btcInterest: 'geen',
};

export default function StrategiePage() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [generated, setGenerated] = useState(false);

  function set<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
    setGenerated(false);
  }

  const tactics = generated ? buildTactics(profile) : null;

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 max-w-4xl space-y-8">

      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">Strategie</h1>
        <p className="text-sm text-slate-400 mt-1">Persoonlijk beleggingsplan op basis van jouw situatie</p>
      </div>

      {/* ── Guidance banner ───────────────────────────────────────────────────── */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl px-5 py-4">
        <p className="text-xs text-blue-400 uppercase tracking-wide font-semibold mb-1.5">
          Wat doet deze pagina?
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          Vul hieronder in hoeveel je maandelijks kunt inleggen, wat je doel is en hoeveel risico je aandurft.
          Je krijgt drie concrete tactieken: één voor de komende maanden, één voor het komende jaar, en één voor de lange termijn.
          Geen advies — wel een concreet startpunt om over na te denken.
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Geen beleggingsadvies. Uitsluitend informatief. Raadpleeg een financieel adviseur voor persoonlijk advies.
        </p>
      </div>

      {/* ── Profile form ──────────────────────────────────────────────────────── */}
      <div className="bg-[#111827] border border-[#1e2d45] rounded-xl px-5 py-5 space-y-6">
        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Jouw situatie</p>

        {/* Monthly amount */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="amount" className="text-xs text-slate-400 font-medium uppercase tracking-wide">
            Maandelijks inlegbedrag (€)
          </label>
          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-sm">€</span>
            <input
              id="amount"
              type="number"
              min={0}
              step={50}
              value={profile.monthlyAmount}
              onChange={(e) => set('monthlyAmount', e.target.value)}
              className="w-36 bg-[#0d1520] border border-[#1e2d45] rounded-lg px-3 py-2 text-sm text-slate-100
                         focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30
                         tabular-nums"
              placeholder="200"
            />
            <span className="text-xs text-slate-500">per maand</span>
          </div>
        </div>

        <SelectField<TimeHorizon>
          label="Beleggingshorizon"
          value={profile.horizon}
          onChange={(v) => set('horizon', v)}
          options={[
            { value: 'kort', label: 'Kort (< 1 jaar)' },
            { value: 'middellang', label: 'Middellang (1–5 jaar)' },
            { value: 'lang', label: 'Lang (5+ jaar)' },
          ]}
        />

        <SelectField<RiskProfile>
          label="Risicotolerantie"
          value={profile.risk}
          onChange={(v) => set('risk', v)}
          options={[
            { value: 'laag', label: 'Laag — ik slaap liever rustig' },
            { value: 'gemiddeld', label: 'Gemiddeld — ik kan schommelingen hebben' },
            { value: 'hoog', label: 'Hoog — ik wil maximaal groeien' },
          ]}
        />

        <SelectField<Goal>
          label="Doel"
          value={profile.goal}
          onChange={(v) => set('goal', v)}
          options={[
            { value: 'vermogen', label: 'Vermogen opbouwen' },
            { value: 'pensioen', label: 'Aanvullend pensioen' },
            { value: 'aankoop', label: 'Grote aankoop (huis, auto)' },
            { value: 'inkomen', label: 'Passief inkomen' },
            { value: 'anders', label: 'Anders / weet nog niet' },
          ]}
        />

        <SelectField<Experience>
          label="Ervaring met beleggen"
          value={profile.experience}
          onChange={(v) => set('experience', v)}
          options={[
            { value: 'beginner', label: 'Beginner — net begonnen' },
            { value: 'gemiddeld', label: 'Gemiddeld — paar jaar ervaring' },
            { value: 'ervaren', label: 'Ervaren — weet wat ik doe' },
          ]}
        />

        <SelectField<BtcInterest>
          label="Bitcoin in je portfolio?"
          value={profile.btcInterest}
          onChange={(v) => set('btcInterest', v)}
          options={[
            { value: 'geen', label: 'Geen Bitcoin' },
            { value: 'klein', label: 'Klein deel (±5%)' },
            { value: 'normaal', label: 'Normaal deel (±15%)' },
          ]}
        />

        {/* Generate button */}
        <button
          type="button"
          onClick={() => setGenerated(true)}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500
                     text-sm font-semibold text-white transition-colors duration-150
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          Genereer mijn tactieken
        </button>
      </div>

      {/* ── Tactics output ────────────────────────────────────────────────────── */}
      {tactics && (
        <div className="space-y-6">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
              Jouw persoonlijke tactieken
            </p>
            <p className="text-sm text-slate-400">
              Op basis van: €{parseFloat(profile.monthlyAmount || '0').toLocaleString('nl-NL')}/maand ·{' '}
              {profile.horizon === 'kort' ? 'korte horizon' : profile.horizon === 'middellang' ? 'middellange horizon' : 'lange horizon'} ·{' '}
              {profile.risk === 'laag' ? 'laag risico' : profile.risk === 'gemiddeld' ? 'gemiddeld risico' : 'hoog risico'} ·{' '}
              {profile.goal === 'vermogen' ? 'vermogen opbouwen' : profile.goal === 'pensioen' ? 'pensioen' : profile.goal === 'aankoop' ? 'grote aankoop' : profile.goal === 'inkomen' ? 'passief inkomen' : 'vrij doel'}
            </p>
          </div>

          <TacticCard tactic={tactics.short} />
          <TacticCard tactic={tactics.medium} />
          <TacticCard tactic={tactics.long} />

          {/* Disclaimer */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl px-5 py-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              <span className="font-semibold text-slate-400">Disclaimer:</span> Deze tactieken zijn automatisch gegenereerd op basis van je invoer en zijn uitsluitend informatief.
              Ze vormen geen persoonlijk beleggingsadvies. Beleggen brengt risico&apos;s met zich mee — je kunt (een deel van) je inleg verliezen.
              Raadpleeg een gecertificeerd financieel adviseur voor advies dat past bij jouw persoonlijke situatie.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
