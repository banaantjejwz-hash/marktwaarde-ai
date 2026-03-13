'use client';

import { useState } from 'react';
import type { RankingItem } from '@/lib/types';
import RankingCard from './RankingCard';

interface RankingListProps {
  stockRankings: RankingItem[];
  etfRankings: RankingItem[];
  title?: string;
  showBitcoin?: boolean;
}

type Tab = 'aandelen' | 'etfs' | 'bitcoin';

export default function RankingList({
  stockRankings,
  etfRankings,
  title,
  showBitcoin = false,
}: RankingListProps) {
  const [activeTab, setActiveTab] = useState<Tab>('aandelen');

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'aandelen', label: 'Aandelen', count: stockRankings.length },
    { key: 'etfs', label: 'ETFs', count: etfRankings.length },
    ...(showBitcoin ? [{ key: 'bitcoin' as Tab, label: 'Bitcoin', count: 1 }] : []),
  ];

  const activeItems: RankingItem[] =
    activeTab === 'aandelen'
      ? stockRankings
      : activeTab === 'etfs'
        ? etfRankings
        : [];

  const tabColorActive: Record<Tab, string> = {
    aandelen: 'bg-blue-500/20 border-blue-500/40 text-blue-400',
    etfs: 'bg-violet-500/20 border-violet-500/40 text-violet-400',
    bitcoin: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
  };

  return (
    <div className="flex flex-col gap-4">
      {title && (
        <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
      )}

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 bg-[#0f1623] border border-[#1e2d45] rounded-lg p-1 w-fit">
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-medium border transition-colors ${
              activeTab === key
                ? tabColorActive[key]
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            {label}
            {count > 0 && (
              <span
                className={`text-xs tabular-nums ${
                  activeTab === key ? '' : 'text-slate-600'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Items ── */}
      {activeTab === 'bitcoin' ? (
        <div className="bg-[#111827] border border-amber-500/20 rounded-lg px-4 py-4">
          <p className="text-sm text-amber-400 font-medium">Bitcoin</p>
          <p className="text-sm text-slate-400 mt-1">
            Zie de Bitcoin marktanalyse sectie voor gedetailleerde signalen en niveaus.
          </p>
        </div>
      ) : activeItems.length === 0 ? (
        <div className="bg-[#111827] border border-[#1e2d45] rounded-lg px-6 py-10 text-center">
          <p className="text-sm text-slate-500">Geen rankingdata beschikbaar.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {activeItems
            .slice()
            .sort((a, b) => a.rank - b.rank)
            .map((item) => (
              <RankingCard key={item.ticker} item={item} showFullDetail={true} />
            ))}
        </div>
      )}
    </div>
  );
}
