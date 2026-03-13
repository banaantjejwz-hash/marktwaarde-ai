import {
  MarketSession,
  MarketSessionInfo,
  DataStatus,
  AssetCategory,
  Sentiment,
  TradeabilityState,
  TimeHorizon,
} from './types';

// ─── Market Session Logic ─────────────────────────────────────────────────────

export function getCurrentMarketSession(): MarketSessionInfo {
  const now = new Date();
  const utcHour = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const utcTotal = utcHour * 60 + utcMinutes;
  const dayOfWeek = now.getUTCDay(); // 0=Sun, 6=Sat

  // US Eastern Time offset (UTC-5 EST, UTC-4 EDT)
  // Approximate: March–November EDT (UTC-4), otherwise EST (UTC-5)
  const month = now.getUTCMonth(); // 0-indexed
  const isDST = month >= 2 && month <= 10; // rough DST
  const etOffset = isDST ? -4 : -5;
  const etHour = ((utcHour + etOffset + 24) % 24);
  const etTotal = etHour * 60 + utcMinutes;

  const localTime = now.toLocaleTimeString('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const etTimeStr = `${String(etHour).padStart(2, '0')}:${String(utcMinutes).padStart(2, '0')} ET`;

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      session: 'weekend',
      label: 'Weekend — Markten gesloten',
      isOpen: false,
      nextEvent: 'Pre-market opent maandag 09:00 ET',
      localTime,
      usTime: etTimeStr,
    };
  }

  // Pre-market: 04:00–09:30 ET
  if (etTotal >= 240 && etTotal < 570) {
    return {
      session: 'pre-market',
      label: 'Pre-market',
      isOpen: false,
      nextEvent: `Reguliere sessie opent om 09:30 ET`,
      localTime,
      usTime: etTimeStr,
    };
  }

  // Regular session: 09:30–16:00 ET
  if (etTotal >= 570 && etTotal < 960) {
    return {
      session: 'open',
      label: 'Reguliere sessie open',
      isOpen: true,
      nextEvent: `Sluit om 16:00 ET`,
      localTime,
      usTime: etTimeStr,
    };
  }

  // After-hours: 16:00–20:00 ET
  if (etTotal >= 960 && etTotal < 1200) {
    return {
      session: 'after-hours',
      label: 'After-hours',
      isOpen: false,
      nextEvent: `Pre-market opent morgen 09:00 ET`,
      localTime,
      usTime: etTimeStr,
    };
  }

  return {
    session: 'gesloten',
    label: 'Markten gesloten',
    isOpen: false,
    nextEvent: `Pre-market opent 09:00 ET`,
    localTime,
    usTime: etTimeStr,
  };
}

// ─── Formatting ───────────────────────────────────────────────────────────────

export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('nl-NL', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatChangePercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

// ─── Mock-safe relative time ──────────────────────────────────────────────────
// Uses a fixed reference "now" so relative ages stay correct regardless of
// when the user visits. E.g. MINUS_1H always shows as "1 uur geleden".
// When real live data is connected, pass referenceNow = undefined to use
// the real Date.now().

export const MOCK_REFERENCE_NOW = '2026-03-13T15:00:00.000Z';

export function getMockRelativeTime(
  isoString: string,
  referenceNow: string = MOCK_REFERENCE_NOW
): string {
  try {
    const refMs = new Date(referenceNow).getTime();
    const itemMs = new Date(isoString).getTime();
    const diffMs = Math.max(0, refMs - itemMs);

    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Zojuist';
    if (diffMin < 60) return `${diffMin} min geleden`;
    if (diffHour < 24) return `${diffHour} uur geleden`;
    return `${diffDay} dag${diffDay === 1 ? '' : 'en'} geleden`;
  } catch {
    return '—';
  }
}

// Compact variant used in news cards: "15m", "2u", "1d"
export function getMockRelativeTimeShort(
  isoString: string,
  referenceNow: string = MOCK_REFERENCE_NOW
): string {
  try {
    const refMs = new Date(referenceNow).getTime();
    const itemMs = new Date(isoString).getTime();
    const diffMs = Math.max(0, refMs - itemMs);

    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 2) return 'Zojuist';
    if (diffMin < 60) return `${diffMin}m geleden`;
    if (diffHour < 24) return `${diffHour}u geleden`;
    return `${diffDay}d geleden`;
  } catch {
    return '—';
  }
}

export function formatPrice(value: number, currency = 'USD'): string {
  const fractionDigits = value > 1000 ? 0 : 2;
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

// ─── Label Helpers ────────────────────────────────────────────────────────────

export function getCategoryLabel(cat: AssetCategory): string {
  const map: Record<AssetCategory, string> = {
    aandeel: 'Aandeel',
    etf: 'ETF',
    bitcoin: 'Bitcoin',
  };
  return map[cat];
}

export function getTimeHorizonLabel(horizon: TimeHorizon): string {
  const map: Record<TimeHorizon, string> = {
    intraday: 'Intraday',
    'volgende-sessie': 'Volgende sessie',
    swing: 'Swing (1–2 weken)',
    'lange-termijn': 'Lange termijn',
  };
  return map[horizon];
}

export function getTradeabilityLabel(state: TradeabilityState): string {
  const map: Record<TradeabilityState, string> = {
    actionable: 'Uitvoerbaar',
    'bevestiging-nodig': 'Bevestiging nodig',
    vermijden: 'Vermijden',
    'alleen-observeren': 'Alleen observeren',
  };
  return map[state];
}

export function getDataStatusLabel(status: DataStatus): string {
  const map: Record<DataStatus, string> = {
    live: 'Live',
    vertraagd: 'Vertraagd',
    eod: 'Slotkoers',
    verouderd: 'Verouderd',
    mock: 'Voorbeelddata',
  };
  return map[status];
}

export function getSentimentLabel(sentiment: Sentiment): string {
  const map: Record<Sentiment, string> = {
    bullish: 'Bullish',
    bearish: 'Bearish',
    neutraal: 'Neutraal',
  };
  return map[sentiment];
}

// ─── Score Interpretation ─────────────────────────────────────────────────────

export function getScoreInterpretation(score: number): {
  label: string;
  tier: 'high' | 'medium' | 'low';
} {
  if (score >= 7.5) return { label: 'Hoog', tier: 'high' };
  if (score >= 5) return { label: 'Gemiddeld', tier: 'medium' };
  return { label: 'Laag', tier: 'low' };
}

export function getConfidenceLabel(score: number): string {
  if (score >= 8) return 'Hoge zekerheid';
  if (score >= 6) return 'Redelijke zekerheid';
  if (score >= 4) return 'Lage zekerheid';
  return 'Onzeker';
}
