'use client';

import { useState } from 'react';
import { socialsData } from '@/lib/mockData';
import type { SocialPost, SocialCategory, TrendingTopic } from '@/lib/types';
import { MOCK_REFERENCE_NOW } from '@/lib/mockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMockRelativeTime(timestamp: string): string {
  const ref = new Date(MOCK_REFERENCE_NOW).getTime();
  const ts = new Date(timestamp).getTime();
  const diffMs = ref - ts;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m geleden`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}u geleden`;
  return `${Math.floor(diffH / 24)}d geleden`;
}

type Filter = 'alles' | SocialCategory | 'bullish' | 'bearish';

const filterLabels: { key: Filter; label: string }[] = [
  { key: 'alles', label: 'Alles' },
  { key: 'aandelen', label: 'Aandelen' },
  { key: 'etfs', label: 'ETFs' },
  { key: 'crypto', label: 'Crypto' },
  { key: 'macro', label: 'Macro' },
  { key: 'bullish', label: 'Bullish' },
  { key: 'bearish', label: 'Bearish' },
];

const sourceConfig: Record<string, { label: string; color: string }> = {
  twitter: { label: 'X / Twitter', color: 'text-slate-400 bg-slate-800 border-slate-700' },
  linkedin: { label: 'LinkedIn', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  substack: { label: 'Substack', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  youtube: { label: 'YouTube', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

const sentimentConfig = {
  bullish: { label: 'Bullish', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' },
  bearish: { label: 'Bearish', color: 'text-red-400 bg-red-500/10 border-red-500/25' },
  neutraal: { label: 'Neutraal', color: 'text-slate-400 bg-slate-700/40 border-slate-600' },
};

const importanceConfig = {
  hoog: { label: 'Belangrijk', color: 'text-blue-400 bg-blue-500/15 border-blue-500/25' },
  gemiddeld: { label: 'Relevant', color: 'text-slate-400 bg-slate-700/40 border-slate-600' },
  laag: { label: 'Achtergrond', color: 'text-slate-500 bg-slate-800 border-slate-700' },
};

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({ post }: { post: SocialPost }) {
  const [expanded, setExpanded] = useState(false);
  const src = sourceConfig[post.source];
  const sent = sentimentConfig[post.sentiment];
  const imp = importanceConfig[post.importance];
  const timeLabel = getMockRelativeTime(post.timestamp);

  return (
    <div className="bg-[#111827] border border-[#1e2d45] rounded-xl overflow-hidden hover:border-[#2a3f60] transition-colors duration-150">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div
            className={`flex-shrink-0 w-9 h-9 rounded-full border flex items-center justify-center text-xs font-bold ${post.author.avatarColor}`}
          >
            {post.author.initials}
          </div>

          {/* Author + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-semibold text-slate-100">{post.author.name}</span>
              {post.author.verified && (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="text-blue-400 flex-shrink-0">
                  <circle cx="6.5" cy="6.5" r="6" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="0.8" />
                  <path d="M4 6.5L6 8.5L9.5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <span className="text-xs text-slate-500">{post.author.handle}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{post.author.role}</p>
          </div>

          {/* Source badge */}
          <span className={`flex-shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded border ${src.color}`}>
            {src.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-slate-300 leading-relaxed">{post.content}</p>
      </div>

      {/* Ticker tags */}
      {post.tickers.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
          {post.tickers.map((t) => (
            <span
              key={t}
              className="inline-flex text-xs font-mono font-medium px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300"
            >
              ${t}
            </span>
          ))}
        </div>
      )}

      {/* Badges row */}
      <div className="px-4 pb-3 flex items-center gap-2 flex-wrap">
        <span className={`inline-flex text-xs px-1.5 py-0.5 rounded border font-medium ${sent.color}`}>
          {sent.label}
        </span>
        <span className={`inline-flex text-xs px-1.5 py-0.5 rounded border font-medium ${imp.color}`}>
          {imp.label}
        </span>
        <span className="text-xs text-slate-600 ml-auto">{timeLabel}</span>
      </div>

      {/* Why it matters — expandable */}
      <div className="border-t border-[#1e2d45]">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-white/[0.01] transition-colors"
          aria-expanded={expanded}
        >
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Waarom dit belangrijk is
          </span>
          <svg
            className={`w-3.5 h-3.5 text-slate-600 transition-transform duration-150 ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expanded && (
          <div className="px-4 pb-3">
            <p className="text-xs text-slate-400 leading-relaxed">{post.whyItMatters}</p>
          </div>
        )}
      </div>

      {/* Footer — engagement */}
      <div className="px-4 py-2.5 border-t border-[#1e2d45] flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-xs text-slate-600">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M8 14S2 10 2 5.5A3.5 3.5 0 018 3.5 3.5 3.5 0 0114 5.5C14 10 8 14 8 14z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
          {post.likes.toLocaleString('nl-NL')}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-600">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h8a2 2 0 012 2v4a2 2 0 01-2 2H6l-3 2.5V12H4a2 2 0 01-2-2V4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
          {post.reposts.toLocaleString('nl-NL')}
        </span>
      </div>
    </div>
  );
}

// ─── Trending Sidebar ─────────────────────────────────────────────────────────

function TrendingSidebar({ trending }: { trending: TrendingTopic[] }) {
  return (
    <div className="bg-[#111827] border border-[#1e2d45] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1e2d45]">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Trending nu</h2>
      </div>
      <div className="divide-y divide-[#1e2d45]">
        {trending.map((item, i) => {
          const sent = sentimentConfig[item.sentiment];
          const hasChange = item.changePercent !== undefined;
          const isPos = (item.changePercent ?? 0) >= 0;
          return (
            <div key={item.ticker} className="px-4 py-3 flex items-center gap-3">
              <span className="text-xs text-slate-600 tabular-nums w-4 flex-shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold font-mono text-slate-100">{item.ticker}</span>
                  <span className={`inline-flex text-[10px] px-1 py-0.5 rounded border ${sent.color}`}>
                    {sent.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">{item.name}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                {hasChange && (
                  <span className={`text-xs font-semibold tabular-nums ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPos ? '+' : ''}{item.changePercent!.toFixed(1)}%
                  </span>
                )}
                <p className="text-[10px] text-slate-600">{item.mentions} posts</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SocialsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('alles');
  const { posts, trending, lastUpdated } = socialsData;

  const filtered = posts.filter((p) => {
    if (activeFilter === 'alles') return true;
    if (activeFilter === 'bullish') return p.sentiment === 'bullish';
    if (activeFilter === 'bearish') return p.sentiment === 'bearish';
    return p.category === activeFilter;
  });

  const highImportance = posts.filter((p) => p.importance === 'hoog').length;
  const bullishCount = posts.filter((p) => p.sentiment === 'bullish').length;
  const bearishCount = posts.filter((p) => p.sentiment === 'bearish').length;
  const overallSentiment = bullishCount > bearishCount ? 'bullish' : bearishCount > bullishCount ? 'bearish' : 'gemengd';
  const timeLabel = getMockRelativeTime(lastUpdated);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

      {/* ── Hero header ── */}
      <div className="bg-[#111827] border border-[#1e2d45] rounded-xl px-5 py-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-500">Live · Markt Stemming</span>
            </div>
            <h1 className="text-xl font-bold text-slate-100">Sociale Markt Intelligentie</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Posts en analyses van toonaangevende namen in finance, macro en markten
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <div className="px-3 py-1.5 rounded-lg border bg-blue-500/10 border-blue-500/25 text-center">
                <p className="text-[10px] text-slate-500">Signalen</p>
                <p className="text-lg font-bold text-blue-400 tabular-nums">{highImportance}</p>
              </div>
              <div className={`px-3 py-1.5 rounded-lg border text-center ${
                overallSentiment === 'bullish'
                  ? 'bg-emerald-500/10 border-emerald-500/25'
                  : overallSentiment === 'bearish'
                  ? 'bg-red-500/10 border-red-500/25'
                  : 'bg-slate-700/30 border-slate-600'
              }`}>
                <p className="text-[10px] text-slate-500">Stemming</p>
                <p className={`text-sm font-bold capitalize ${
                  overallSentiment === 'bullish' ? 'text-emerald-400' : overallSentiment === 'bearish' ? 'text-red-400' : 'text-slate-400'
                }`}>
                  {overallSentiment === 'bullish' ? 'Bullish' : overallSentiment === 'bearish' ? 'Bearish' : 'Gemengd'}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-slate-600">Bijgewerkt {timeLabel}</p>
          </div>
        </div>

        {/* Sentiment bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
            <span>Bearish ({bearishCount})</span>
            <span>Neutraal ({posts.length - bullishCount - bearishCount})</span>
            <span>Bullish ({bullishCount})</span>
          </div>
          <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5">
            <div
              className="bg-red-500/70 rounded-full"
              style={{ width: `${(bearishCount / posts.length) * 100}%` }}
            />
            <div
              className="bg-slate-600 rounded-full"
              style={{ width: `${((posts.length - bullishCount - bearishCount) / posts.length) * 100}%` }}
            />
            <div
              className="bg-emerald-500/70 rounded-full"
              style={{ width: `${(bullishCount / posts.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filterLabels.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors duration-150 ${
              activeFilter === key
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                : 'bg-[#111827] border-[#1e2d45] text-slate-400 hover:text-slate-200 hover:border-[#2a3f60]'
            }`}
          >
            {label}
            {key !== 'alles' && key !== 'bullish' && key !== 'bearish' && (
              <span className="ml-1.5 text-[10px] text-slate-600">
                {posts.filter((p) => p.category === key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Main layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">

        {/* Post feed */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-[#111827] border border-[#1e2d45] rounded-xl px-5 py-10 text-center">
              <p className="text-slate-500 text-sm">Geen posts voor dit filter.</p>
            </div>
          ) : (
            filtered.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <TrendingSidebar trending={trending} />

          {/* Disclaimer */}
          <div className="bg-[#0f1623] border border-[#1e2d45] rounded-xl px-4 py-3">
            <p className="text-[10px] text-slate-600 leading-relaxed">
              Posts zijn illustratief en bedoeld als marktintelligentie. Geen beleggingsadvies.
              Doe altijd eigen onderzoek voor financiële beslissingen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
