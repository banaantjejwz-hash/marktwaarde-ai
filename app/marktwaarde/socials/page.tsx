'use client';

import { useState } from 'react';
import { socialsData, MOCK_REFERENCE_NOW } from '@/lib/mockData';
import type { SocialPost, SocialCategory, TrendingTopic } from '@/lib/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMockRelativeTime(timestamp: string): string {
  const ref = new Date(MOCK_REFERENCE_NOW).getTime();
  const ts = new Date(timestamp).getTime();
  const diffMs = ref - ts;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}u`;
  return `${Math.floor(diffH / 24)}d`;
}

type Filter = 'alles' | SocialCategory | 'bullish' | 'bearish';

const filters: { key: Filter; label: string }[] = [
  { key: 'alles', label: 'Alles' },
  { key: 'macro', label: 'Macro' },
  { key: 'aandelen', label: 'Aandelen' },
  { key: 'etfs', label: 'ETFs' },
  { key: 'crypto', label: 'Crypto' },
  { key: 'bullish', label: '▲ Bullish' },
  { key: 'bearish', label: '▼ Bearish' },
];

// ─── Source icons ─────────────────────────────────────────────────────────────

function SourceIcon({ source }: { source: string }) {
  if (source === 'twitter') return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-slate-400">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
  if (source === 'linkedin') return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
  if (source === 'substack') return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-orange-400">
      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
    </svg>
  );
  return null;
}

// ─── Sentiment stripe ─────────────────────────────────────────────────────────

const sentimentStripe = {
  bullish: 'border-l-emerald-500',
  bearish: 'border-l-red-500',
  neutraal: 'border-l-slate-600',
};

const sentimentBadge = {
  bullish: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  bearish: 'text-red-400 bg-red-500/10 border-red-500/30',
  neutraal: 'text-slate-400 bg-slate-700/40 border-slate-600',
};

const sentimentLabel = { bullish: 'Bullish', bearish: 'Bearish', neutraal: 'Neutraal' };

const importanceBadge = {
  hoog: { style: 'text-blue-300 bg-blue-500/15 border-blue-500/30', label: '🔥 Belangrijk' },
  gemiddeld: { style: 'text-slate-400 bg-slate-700/30 border-slate-600/50', label: 'Relevant' },
  laag: { style: 'text-slate-500 bg-slate-800/50 border-slate-700/50', label: 'Achtergrond' },
};

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({ post }: { post: SocialPost }) {
  const [expanded, setExpanded] = useState(false);
  const timeLabel = getMockRelativeTime(post.timestamp);
  const stripe = sentimentStripe[post.sentiment];
  const sbadge = sentimentBadge[post.sentiment];
  const slabel = sentimentLabel[post.sentiment];
  const imp = importanceBadge[post.importance];

  return (
    <article
      className={`group relative bg-[#0f1623] border border-[#1e2d45] border-l-2 ${stripe} rounded-xl overflow-hidden transition-all duration-200 hover:border-[#2d4a6e] hover:shadow-lg hover:shadow-black/30`}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-start gap-3">
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold leading-none ${post.author.avatarColor}`}
        >
          {post.author.initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-slate-100 text-sm">{post.author.name}</span>
            {post.author.verified && (
              <span title="Geverifieerd" className="inline-flex">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-blue-400">
                  <circle cx="7" cy="7" r="6.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="0.75"/>
                  <path d="M4.5 7L6.5 9L9.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            )}
            <span className="text-xs text-slate-500">{post.author.handle}</span>
          </div>
          <p className="text-xs text-slate-500 truncate">{post.author.role}</p>
        </div>

        {/* Top-right meta */}
        <div className="flex-shrink-0 flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 text-slate-500">
            <SourceIcon source={post.source} />
            <span className="text-[10px]">{timeLabel}</span>
          </div>
          {post.importance === 'hoog' && (
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${imp.style}`}>
              {imp.label}
            </span>
          )}
        </div>
      </div>

      {/* Quote content */}
      <div className="px-4 pb-3">
        <p className="text-[15px] text-slate-200 leading-relaxed">{post.content}</p>
      </div>

      {/* Ticker chips */}
      {post.tickers.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
          {post.tickers.map((t) => (
            <span
              key={t}
              className="inline-flex items-center text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:border-slate-500 transition-colors"
            >
              ${t}
            </span>
          ))}
        </div>
      )}

      {/* Badges + engagement row */}
      <div className="px-4 pb-3 flex items-center gap-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${sbadge}`}>
          {slabel}
        </span>
        {post.importance !== 'hoog' && (
          <span className={`text-xs px-2 py-0.5 rounded-full border ${imp.style}`}>
            {imp.label}
          </span>
        )}
        <div className="ml-auto flex items-center gap-3 text-slate-600">
          <span className="flex items-center gap-1 text-xs">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 14S2 10 2 5.5A3.5 3.5 0 018 3.5 3.5 3.5 0 0114 5.5C14 10 8 14 8 14z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
            </svg>
            {post.likes >= 1000 ? `${(post.likes / 1000).toFixed(1)}K` : post.likes}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M3 5l4-3.5L11 5M7 1.5V10M5 11.5h6M8 10l3 3.5-3 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {post.reposts >= 1000 ? `${(post.reposts / 1000).toFixed(1)}K` : post.reposts}
          </span>
        </div>
      </div>

      {/* Expandable: Why it matters */}
      <div className="border-t border-[#1e2d45]">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-left group/btn hover:bg-white/[0.02] transition-colors"
          aria-expanded={expanded}
        >
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-600 group-hover/btn:text-slate-500 transition-colors">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            Waarom dit ertoe doet
          </span>
          <svg
            className={`w-3.5 h-3.5 text-slate-600 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        {expanded && (
          <div className="px-4 pb-4 pt-1 bg-blue-500/[0.03]">
            <p className="text-xs text-slate-400 leading-relaxed border-l-2 border-blue-500/30 pl-3">
              {post.whyItMatters}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

// ─── Trending Sidebar ─────────────────────────────────────────────────────────

function TrendingSidebar({ trending }: { trending: TrendingTopic[] }) {
  const maxMentions = Math.max(...trending.map((t) => t.mentions));
  return (
    <div className="bg-[#0f1623] border border-[#1e2d45] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1e2d45] flex items-center gap-2">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="text-orange-400">
          <path d="M8 1L10 6H15L11 9.5L12.5 15L8 12L3.5 15L5 9.5L1 6H6L8 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        </svg>
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Trending</h2>
      </div>
      <div className="divide-y divide-[#1e2d45]">
        {trending.map((item, i) => {
          const isPos = (item.changePercent ?? 0) >= 0;
          const barWidth = Math.round((item.mentions / maxMentions) * 100);
          const sentColor = item.sentiment === 'bullish' ? 'bg-emerald-500/30' : item.sentiment === 'bearish' ? 'bg-red-500/30' : 'bg-slate-600/30';
          return (
            <div key={item.ticker} className="px-4 py-3 relative overflow-hidden">
              {/* Background bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 ${sentColor} transition-all duration-500`}
                style={{ width: `${barWidth}%` }}
              />
              <div className="relative flex items-center gap-3">
                <span className="text-[10px] text-slate-600 tabular-nums w-4 flex-shrink-0 font-bold">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold font-mono text-slate-100">{item.ticker}</span>
                    {item.changePercent !== undefined && (
                      <span className={`text-xs font-semibold tabular-nums ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPos ? '+' : ''}{item.changePercent.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">{item.name}</p>
                </div>
                <span className="text-[10px] text-slate-500 flex-shrink-0">{item.mentions} posts</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Who to follow cards ──────────────────────────────────────────────────────

function WhoToFollow({ posts }: { posts: SocialPost[] }) {
  const top = posts.slice(0, 4);
  return (
    <div className="bg-[#0f1623] border border-[#1e2d45] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1e2d45]">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Wie te volgen</h2>
      </div>
      <div className="divide-y divide-[#1e2d45]">
        {top.map((post) => (
          <div key={post.id} className="px-4 py-3 flex items-center gap-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold ${post.author.avatarColor}`}>
              {post.author.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{post.author.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{post.author.role.split(' · ')[1] ?? post.author.role}</p>
            </div>
            {post.author.verified && (
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="text-blue-400 flex-shrink-0">
                <circle cx="7" cy="7" r="6.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="0.75"/>
                <path d="M4.5 7L6.5 9L9.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        ))}
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

  const bullishCount = posts.filter((p) => p.sentiment === 'bullish').length;
  const bearishCount = posts.filter((p) => p.sentiment === 'bearish').length;
  const neutralCount = posts.length - bullishCount - bearishCount;
  const overallSentiment = bullishCount > bearishCount ? 'bullish' : bearishCount > bullishCount ? 'bearish' : 'gemengd';
  const timeLabel = getMockRelativeTime(lastUpdated);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">

      {/* ── Hero ── */}
      <div className="relative bg-[#0f1623] border border-[#1e2d45] rounded-xl px-5 py-5 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.04] via-transparent to-purple-500/[0.03] pointer-events-none" />

        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-500">Live · Markt Stemming</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Markt Intelligentie</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-sm">
              Visies van de beste beleggers ter wereld — vertaald en samengebracht
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Sentiment stats */}
            <div className="flex items-stretch gap-1.5">
              <div className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center min-w-[52px]">
                <p className="text-lg font-bold text-emerald-400 tabular-nums leading-tight">{bullishCount}</p>
                <p className="text-[10px] text-emerald-600 font-medium">Bullish</p>
              </div>
              <div className="px-3 py-2 rounded-lg bg-slate-700/30 border border-slate-600/30 text-center min-w-[52px]">
                <p className="text-lg font-bold text-slate-400 tabular-nums leading-tight">{neutralCount}</p>
                <p className="text-[10px] text-slate-600 font-medium">Neutraal</p>
              </div>
              <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-center min-w-[52px]">
                <p className="text-lg font-bold text-red-400 tabular-nums leading-tight">{bearishCount}</p>
                <p className="text-[10px] text-red-600 font-medium">Bearish</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment bar */}
        <div className="relative mt-4 space-y-1.5">
          <div className="flex h-2 rounded-full overflow-hidden bg-slate-800">
            <div className="bg-emerald-500/70 transition-all duration-700" style={{ width: `${(bullishCount / posts.length) * 100}%` }} />
            <div className="bg-slate-600/50 transition-all duration-700" style={{ width: `${(neutralCount / posts.length) * 100}%` }} />
            <div className="bg-red-500/70 transition-all duration-700" style={{ width: `${(bearishCount / posts.length) * 100}%` }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-600">
              Stemming:{' '}
              <span className={overallSentiment === 'bullish' ? 'text-emerald-500' : overallSentiment === 'bearish' ? 'text-red-500' : 'text-slate-400'}>
                {overallSentiment === 'bullish' ? 'Overwegend Bullish' : overallSentiment === 'bearish' ? 'Overwegend Bearish' : 'Gemengd'}
              </span>
            </span>
            <span className="text-[10px] text-slate-600">Bijgewerkt {timeLabel} geleden</span>
          </div>
        </div>
      </div>

      {/* ── Filter pills ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
        {filters.map(({ key, label }) => {
          const count = key === 'alles' ? posts.length
            : key === 'bullish' ? bullishCount
            : key === 'bearish' ? bearishCount
            : posts.filter((p) => p.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`flex-shrink-0 flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full border font-medium transition-all duration-150 ${
                activeFilter === key
                  ? key === 'bullish'
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : key === 'bearish'
                    ? 'bg-red-500/20 border-red-500/40 text-red-300'
                    : 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                  : 'bg-[#0f1623] border-[#1e2d45] text-slate-400 hover:text-slate-200 hover:border-[#2d4a6e]'
              }`}
            >
              {label}
              <span className={`text-[10px] tabular-nums ${activeFilter === key ? 'opacity-70' : 'text-slate-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Main layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_268px] gap-5">

        {/* Feed */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-[#0f1623] border border-[#1e2d45] rounded-xl px-5 py-12 text-center">
              <p className="text-slate-500 text-sm">Geen berichten voor dit filter.</p>
            </div>
          ) : (
            filtered.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <TrendingSidebar trending={trending} />
          <WhoToFollow posts={posts} />
          <div className="px-4 py-3 bg-[#0f1623] border border-[#1e2d45] rounded-xl">
            <p className="text-[10px] text-slate-600 leading-relaxed">
              Berichten zijn illustratief en vertaald voor educatieve doeleinden.
              Geen beleggingsadvies. Doe altijd eigen onderzoek.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
