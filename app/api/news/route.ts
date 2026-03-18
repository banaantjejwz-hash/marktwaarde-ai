import { NextResponse } from 'next/server';
import type { NewsItem, AssetCategory, Sentiment } from '@/lib/types';

export const dynamic = 'force-dynamic';

// ── RSS Sources ───────────────────────────────────────────────────────────────
const RSS_SOURCES = [
  { url: 'https://feeds.marketwatch.com/marketwatch/topstories/', name: 'MarketWatch' },
  { url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', name: 'CNBC' },
  { url: 'https://finance.yahoo.com/news/rssindex', name: 'Yahoo Finance' },
];

// ── XML Parsing ───────────────────────────────────────────────────────────────
function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(
    `<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`,
    'i'
  );
  const match = xml.match(regex);
  if (!match) return '';
  return match[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

function parseRSSItems(xml: string, source: string) {
  const items: Array<{ title: string; description: string; link: string; pubDate: string; source: string }> = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  let count = 0;
  while ((match = itemRegex.exec(xml)) !== null && count < 8) {
    const itemXml = match[1];
    const title = extractTag(itemXml, 'title');
    const description = extractTag(itemXml, 'description');
    const link = extractTag(itemXml, 'link') || extractTag(itemXml, 'guid');
    const pubDate = extractTag(itemXml, 'pubDate');
    if (title) {
      items.push({ title, description: description.slice(0, 300), link, pubDate, source });
      count++;
    }
  }
  return items;
}

// ── Keyword Scoring ───────────────────────────────────────────────────────────
const BITCOIN_KW = ['bitcoin', 'btc', 'crypto', 'blockchain', 'cryptocurrency', 'ethereum', 'digital asset', 'halving', 'satoshi'];
const MACRO_KW = ['fed', 'federal reserve', 'interest rate', 'inflation', 'cpi', 'pce', 'fomc', 'powell', 'treasury', 'yield', 'gdp', 'recession', 'tariff', 'trade war', 'ecb', 'draghi', 'rate cut', 'rate hike'];
const EQUITY_KW = ['stock', 'shares', 'nasdaq', 's&p', 'dow', 'equity', 'earnings', 'nvda', 'nvidia', 'aapl', 'apple', 'microsoft', 'msft', 'alphabet', 'google', 'meta', 'amazon', 'amzn', 'tesla', 'tsla', 'spy', 'qqq', 'etf'];
const BULLISH_KW = ['rally', 'surge', 'gains', 'rises', 'climbs', 'record', 'soars', 'jumps', 'bullish', 'growth', 'beats', 'outperforms', 'upgrade', 'buy', 'strong'];
const BEARISH_KW = ['falls', 'drops', 'plunges', 'crash', 'declines', 'sell-off', 'bearish', 'recession', 'loss', 'misses', 'downgrade', 'sell', 'weak', 'concern', 'warns', 'slump'];
const HIGH_IMPACT_KW = ['emergency', 'halt', 'ban', 'approval', 'collapse', 'historic', 'unprecedented', 'crisis'];

function scoreItem(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();

  const btcScore = BITCOIN_KW.filter(kw => text.includes(kw)).length;
  const macroScore = MACRO_KW.filter(kw => text.includes(kw)).length;
  const equityScore = EQUITY_KW.filter(kw => text.includes(kw)).length;
  const highImpact = HIGH_IMPACT_KW.some(kw => text.includes(kw)) ? 1.5 : 1;

  const rawRelevance = (btcScore * 2.5 + equityScore * 1.5 + macroScore * 1.5) * highImpact;
  const rawImpact = (macroScore * 2.5 + equityScore * 1.2 + btcScore * 0.8) * highImpact;

  const relevanceScore = Math.min(10, Math.round(rawRelevance * 10) / 10);
  const marketImpactScore = Math.min(10, Math.round(rawImpact * 10) / 10);

  const bullish = BULLISH_KW.filter(kw => text.includes(kw)).length;
  const bearish = BEARISH_KW.filter(kw => text.includes(kw)).length;
  let sentiment: Sentiment = 'neutraal';
  if (bullish > bearish + 1) sentiment = 'bullish';
  else if (bearish > bullish + 1) sentiment = 'bearish';

  const affectedCategories: AssetCategory[] = [];
  if (btcScore > 0) affectedCategories.push('bitcoin');
  if (equityScore > 0) affectedCategories.push('aandeel');
  if (text.includes('etf')) affectedCategories.push('etf');

  const categoryTags: string[] = [];
  if (macroScore > 0) categoryTags.push('macro');
  if (btcScore > 0) categoryTags.push('crypto');
  if (equityScore > 0) categoryTags.push('aandelen');
  if (categoryTags.length === 0) categoryTags.push('algemeen');

  const eventType = macroScore >= 2 ? 'macro'
    : btcScore >= 2 ? 'bitcoin'
    : equityScore >= 2 ? 'earnings'
    : 'algemeen';

  return {
    relevanceScore,
    marketImpactScore,
    sentiment,
    affectedCategories,
    categoryTags,
    isRelevant: relevanceScore >= 3 || marketImpactScore >= 3,
    eventType,
  };
}

// ── Build NewsItem ─────────────────────────────────────────────────────────────
let idCounter = 0;

function buildNewsItem(raw: { title: string; description: string; link: string; pubDate: string; source: string }): NewsItem {
  const scores = scoreItem(raw.title, raw.description);
  const timestamp = raw.pubDate ? new Date(raw.pubDate).toISOString() : new Date().toISOString();
  idCounter++;

  return {
    id: `live-${Date.now()}-${idCounter}`,
    timestamp,
    source: raw.source,
    headline: raw.title,
    summary: raw.description || raw.title,
    categoryTags: scores.categoryTags,
    assetTags: [],
    relevanceScore: scores.relevanceScore,
    marketImpactScore: scores.marketImpactScore,
    sentiment: scores.sentiment,
    timeHorizon: 'intraday',
    isRelevant: scores.isRelevant,
    affectedCategories: scores.affectedCategories,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eventType: scores.eventType as any,
  };
}

// ── API Handler ───────────────────────────────────────────────────────────────
export async function GET() {
  idCounter = 0;

  const results = await Promise.allSettled(
    RSS_SOURCES.map(async ({ url, name }) => {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'market-operator-ai/1.0' },
        next: { revalidate: 300 },
      });
      if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
      const xml = await res.text();
      return parseRSSItems(xml, name);
    })
  );

  const allRaw: Array<{ title: string; description: string; link: string; pubDate: string; source: string }> = [];
  for (const r of results) {
    if (r.status === 'fulfilled') allRaw.push(...r.value);
  }

  // Deduplicate by headline similarity
  const seen = new Set<string>();
  const deduped = allRaw.filter(item => {
    const key = item.title.toLowerCase().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const newsItems: NewsItem[] = deduped.map(buildNewsItem);

  // Sort: most relevant first, then most recent
  newsItems.sort((a, b) => {
    const scoreDiff = (b.relevanceScore + b.marketImpactScore) - (a.relevanceScore + a.marketImpactScore);
    if (Math.abs(scoreDiff) > 1) return scoreDiff;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return NextResponse.json(newsItems.slice(0, 20), {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
