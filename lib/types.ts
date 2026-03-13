// ─── Core Domain Types ─────────────────────────────────────────────────────

export type AssetCategory = 'aandeel' | 'etf' | 'bitcoin';

export type MarketSession =
  | 'pre-market'
  | 'open'
  | 'after-hours'
  | 'gesloten'
  | 'weekend';

export type DataStatus = 'live' | 'vertraagd' | 'eod' | 'verouderd' | 'mock';

export type TimeHorizon =
  | 'intraday'
  | 'volgende-sessie'
  | 'swing'
  | 'lange-termijn';

export type TradeabilityState =
  | 'actionable'
  | 'bevestiging-nodig'
  | 'vermijden'
  | 'alleen-observeren';

export type Sentiment = 'bullish' | 'bearish' | 'neutraal';

export type Direction = 'long' | 'short';

// ─── Market Session ─────────────────────────────────────────────────────────

export interface MarketSessionInfo {
  session: MarketSession;
  label: string;
  isOpen: boolean;
  nextEvent: string;
  localTime: string;
  usTime: string;
}

// ─── News ────────────────────────────────────────────────────────────────────

export interface NewsItem {
  id: string;
  timestamp: string;
  source: string;
  headline: string;
  summary: string;
  categoryTags: string[];
  assetTags: string[];
  relevanceScore: number; // 0–10
  marketImpactScore: number; // 0–10
  sentiment: Sentiment;
  timeHorizon: TimeHorizon;
  isRelevant: boolean;
  whyItMatters?: string;
  affectedCategories: AssetCategory[];
  affectedInstruments?: string[];
  scenarioImplication?: string;
  eventType?:
    | 'macro'
    | 'earnings'
    | 'geopolitiek'
    | 'regelgeving'
    | 'technisch'
    | 'bitcoin'
    | 'sectornieuws'
    | 'algemeen';
  watchNext?: string;
  invalidationNote?: string;
}

// ─── Trade Setup ─────────────────────────────────────────────────────────────

export interface TradeSetup {
  id: string;
  ticker: string;
  name: string;
  category: AssetCategory;
  direction: Direction;
  setupType: string;
  currentPrice: string;
  entryZone: string;
  stopLoss: string;
  target1: string;
  target2?: string;
  riskReward: number;
  confidenceScore: number; // 0–10
  catalyst: string;
  volumeContext: string;
  invalidationCondition: string;
  tradeabilityState: TradeabilityState;
  lastUpdated: string;
  sessionRelevance: MarketSession[];
  notes?: string;
}

// ─── Ranking ──────────────────────────────────────────────────────────────────

export interface RankingItem {
  rank: number;
  ticker: string;
  name: string;
  category: AssetCategory;
  score: number; // 0–10
  changePercent: number;
  rationale: string;
  mainDrivers: string[];
  risks: string;
  timeHorizon: TimeHorizon;
  tradeabilityState: TradeabilityState;
  sentiment: Sentiment;
  monthlyAllocationSuitable?: boolean;
}

// ─── Scenario ─────────────────────────────────────────────────────────────────

export interface Scenario {
  label: string;
  description: string;
  probability: 'laag' | 'gemiddeld' | 'hoog';
  implication: string;
  watchTriggers: string[];
  invalidation?: string;
}

// ─── Advice Block ─────────────────────────────────────────────────────────────

export interface AdviceBlock {
  title: string;
  subtitle?: string;
  summary: string;
  mainDrivers: string[];
  risks: string[];
  counterArguments: string[];
  scenarios: {
    bullish: Scenario;
    bearish: Scenario;
    neutral: Scenario;
  };
  conclusion: string;
  actionPoints: string[];
  whatToAvoid: string[];
  defensiveAlternative: string;
  offensiveAlternative: string;
  doNothingLogic?: string;
  lastUpdated: string;
  dataStatus: DataStatus;
  confidenceLevel: number; // 0–10
  timeHorizon: TimeHorizon;
}

// ─── Category Comparison ──────────────────────────────────────────────────────

export interface CategoryComparison {
  winner: AssetCategory;
  rationale: string;
  scores: {
    aandelen: number;
    etfs: number;
    bitcoin: number;
  };
  sampleAllocation: {
    aandelen: number;
    etfs: number;
    bitcoin: number;
    cash: number;
  };
  avoidThisMonth: string[];
  lastUpdated: string;
}

// ─── Asset Price ──────────────────────────────────────────────────────────────

export interface AssetPrice {
  ticker: string;
  name: string;
  category: AssetCategory;
  price: number;
  currency: string;
  changePercent: number;
  changeAbsolute: number;
  volume?: string;
  dataStatus: DataStatus;
  lastUpdated: string;
}

// ─── Market Summary ───────────────────────────────────────────────────────────

export interface MarketSummary {
  regime: 'bull' | 'bear' | 'sideways' | 'volatile';
  regimeLabel: string;
  topSignal: string;
  biggestRisk: string;
  whatToWatchNext: string;
  sentiment: Sentiment;
  lastUpdated: string;
  dataStatus: DataStatus;
  indexPrices: AssetPrice[];
}

// ─── Bitcoin Signals ──────────────────────────────────────────────────────────

export interface BitcoinSignal {
  id: string;
  label: string;
  value: string;
  interpretation: string;
  sentiment: Sentiment;
  importance: 'hoog' | 'gemiddeld' | 'laag';
}

export interface BitcoinMarket {
  currentPrice: number;
  currency: string;
  changePercent24h: number;
  changePercent7d: number;
  dominance: number;
  fearGreedIndex: number;
  fearGreedLabel: string;
  keyLevels: {
    support1: string;
    support2: string;
    resistance1: string;
    resistance2: string;
  };
  signals: BitcoinSignal[];
  dataStatus: DataStatus;
  lastUpdated: string;
}

// ─── Evening Brief ────────────────────────────────────────────────────────────

export interface EveningBriefItem {
  category: AssetCategory | 'macro';
  title: string;
  todayObservation: string;
  tomorrowImplication: string;
  keyLevelsToCheck: string[];
  eventRisk?: string;
}

// ─── Daily Summary ────────────────────────────────────────────────────────────

export interface DailySummary {
  date: string;
  adviceTitle: string;
  marketQuality: 'uitstekend' | 'goed' | 'matig' | 'slecht' | 'vermijden';
  topOpportunity: string;
  topRisk: string;
  noTradeCondition?: string;
  disciplineNote: string;
  sessionStatus: MarketSession;
  lastUpdated: string;
}
