import { NextResponse } from 'next/server';
import type { SocialPost, TrendingTopic, SocialsData, Sentiment, SocialCategory } from '@/lib/types';

export const dynamic = 'force-dynamic';

const SUBREDDITS = [
  { name: 'investing', category: 'aandelen' as SocialCategory },
  { name: 'stocks', category: 'aandelen' as SocialCategory },
  { name: 'Bitcoin', category: 'crypto' as SocialCategory },
  { name: 'wallstreetbets', category: 'aandelen' as SocialCategory },
];

// Color palette for avatars
const AVATAR_COLORS = ['#2563eb', '#7c3aed', '#dc2626', '#059669', '#d97706', '#0891b2', '#be185d', '#65a30d'];

const BULLISH_KW = ['bull', 'long', 'buy', 'calls', 'moon', 'ath', 'growth', 'gains', 'surge', 'rally', 'strong', 'upgrade', 'beat'];
const BEARISH_KW = ['bear', 'short', 'sell', 'puts', 'crash', 'drop', 'fall', 'recession', 'decline', 'concern', 'weak', 'downgrade', 'miss'];

function detectSentiment(text: string): Sentiment {
  const lower = text.toLowerCase();
  const bull = BULLISH_KW.filter(kw => lower.includes(kw)).length;
  const bear = BEARISH_KW.filter(kw => lower.includes(kw)).length;
  if (bull > bear + 1) return 'bullish';
  if (bear > bull + 1) return 'bearish';
  return 'neutraal';
}

const TICKER_PATTERN = /\b([A-Z]{2,5})\b/g;
const KNOWN_TICKERS = new Set(['NVDA', 'AAPL', 'MSFT', 'META', 'AMZN', 'TSLA', 'GOOGL', 'SPY', 'QQQ', 'BTC', 'ETH', 'AMD', 'NFLX', 'BABA', 'JPM', 'GS']);

function extractTickers(text: string): string[] {
  const matches = text.match(TICKER_PATTERN) ?? [];
  return [...new Set(matches.filter(t => KNOWN_TICKERS.has(t)))].slice(0, 3);
}

interface RedditPost {
  data: {
    id: string;
    author: string;
    title: string;
    selftext: string;
    score: number;
    num_comments: number;
    created_utc: number;
    url: string;
    subreddit: string;
  };
}

async function fetchSubreddit(subreddit: string): Promise<RedditPost[]> {
  try {
    const res = await fetch(
      `https://www.reddit.com/r/${subreddit}/top.json?t=day&limit=6`,
      {
        headers: {
          'User-Agent': 'market-operator-ai/1.0 (financial news aggregator)',
          Accept: 'application/json',
        },
        next: { revalidate: 600 },
      }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.children ?? [];
  } catch {
    return [];
  }
}

function mapPostToSocial(post: RedditPost, category: SocialCategory, index: number): SocialPost {
  const { data } = post;
  const text = `${data.title} ${data.selftext ?? ''}`.slice(0, 500);
  const sentiment = detectSentiment(text);
  const tickers = extractTickers(`${data.title} ${data.selftext ?? ''}`);
  const initials = data.author.slice(0, 2).toUpperCase();
  const colorIndex = data.author.charCodeAt(0) % AVATAR_COLORS.length;

  return {
    id: `reddit-${data.id}`,
    author: {
      name: `u/${data.author}`,
      handle: data.author,
      initials,
      role: `r/${data.subreddit}`,
      avatarColor: AVATAR_COLORS[colorIndex],
      verified: false,
    },
    timestamp: new Date(data.created_utc * 1000).toISOString(),
    source: 'twitter', // maps to generic community icon in UI
    content: data.title.slice(0, 280),
    tickers,
    sentiment,
    category,
    importance: data.score > 500 ? 'hoog' : data.score > 100 ? 'gemiddeld' : 'laag',
    whyItMatters: `${data.score.toLocaleString('nl-NL')} upvotes · ${data.num_comments} reacties`,
    likes: data.score,
    reposts: data.num_comments,
  };
}

function buildTrending(posts: SocialPost[]): TrendingTopic[] {
  const tickerMap = new Map<string, { mentions: number; sentiment: { bull: number; bear: number } }>();

  for (const post of posts) {
    for (const ticker of post.tickers) {
      const existing = tickerMap.get(ticker) ?? { mentions: 0, sentiment: { bull: 0, bear: 0 } };
      existing.mentions++;
      if (post.sentiment === 'bullish') existing.sentiment.bull++;
      if (post.sentiment === 'bearish') existing.sentiment.bear++;
      tickerMap.set(ticker, existing);
    }
  }

  const TICKER_NAMES: Record<string, string> = {
    NVDA: 'Nvidia', AAPL: 'Apple', MSFT: 'Microsoft', META: 'Meta', AMZN: 'Amazon',
    TSLA: 'Tesla', GOOGL: 'Alphabet', SPY: 'S&P 500 ETF', QQQ: 'Nasdaq ETF',
    BTC: 'Bitcoin', ETH: 'Ethereum', AMD: 'AMD', NFLX: 'Netflix',
  };

  return [...tickerMap.entries()]
    .map(([ticker, data]) => ({
      ticker,
      name: TICKER_NAMES[ticker] ?? ticker,
      mentions: data.mentions,
      sentiment: data.sentiment.bull > data.sentiment.bear ? 'bullish'
        : data.sentiment.bear > data.sentiment.bull ? 'bearish'
        : 'neutraal' as Sentiment,
    }))
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 6);
}

export async function GET() {
  const subResults = await Promise.allSettled(
    SUBREDDITS.map(({ name, category }) =>
      fetchSubreddit(name).then(posts =>
        posts.map((p, i) => mapPostToSocial(p, category, i))
      )
    )
  );

  const allPosts: SocialPost[] = [];
  for (const r of subResults) {
    if (r.status === 'fulfilled') allPosts.push(...r.value);
  }

  // Sort by importance then likes
  allPosts.sort((a, b) => {
    const imp = { hoog: 3, gemiddeld: 2, laag: 1 };
    const impDiff = imp[b.importance] - imp[a.importance];
    if (impDiff !== 0) return impDiff;
    return b.likes - a.likes;
  });

  const trending = buildTrending(allPosts);

  const result: SocialsData = {
    posts: allPosts.slice(0, 15),
    trending,
    lastUpdated: new Date().toISOString(),
    dataStatus: 'live',
  };

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200' },
  });
}
