'use client';

import { useState, useMemo } from 'react';
import type { TradeSetup, AssetCategory } from '@/lib/types';
import SetupCard from './SetupCard';

interface SetupListProps {
  setups: TradeSetup[];
  filterCategory?: AssetCategory;
}

type Tab = 'aandelen' | 'etfs' | 'bitcoin';

const tabToCategory: Record<Tab, AssetCategory> = {
  aandelen: 'aandeel',
  etfs: 'etf',
  bitcoin: 'bitcoin',
};

const tabColorActive: Record<Tab, string> = {
  aandelen: 'bg-blue-500/20 border-blue-500/40 text-blue-400',
  etfs: 'bg-violet-500/20 border-violet-500/40 text-violet-400',
  bitcoin: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
};

export default function SetupList({ setups, filterCategory }: SetupListProps) {
  const initialTab: Tab =
    filterCategory === 'etf'
      ? 'etfs'
      : filterCategory === 'bitcoin'
        ? 'bitcoin'
        : 'aandelen';

  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'aandelen', label: 'Aandelen' },
    { key: 'etfs', label: 'ETFs' },
    { key: 'bitcoin', label: 'Bitcoin' },
  ];

  const activeCategory = tabToCategory[activeTab];

  const categorySetups = useMemo(
    () => setups.filter((s) => s.category === activeCategory),
    [setups, activeCategory]
  );

  const actionable = useMemo(
    () =>
      categorySetups.filter(
        (s) => s.tradeabilityState !== 'vermijden' && s.tradeabilityState !== 'alleen-observeren'
      ),
    [categorySetups]
  );

  const observeren = useMemo(
    () => categorySetups.filter((s) => s.tradeabilityState === 'alleen-observeren'),
    [categorySetups]
  );

  const vermijden = useMemo(
    () => categorySetups.filter((s) => s.tradeabilityState === 'vermijden'),
    [categorySetups]
  );

  const countForTab = (tab: Tab) => {
    const cat = tabToCategory[tab];
    return setups.filter((s) => s.category === cat).length;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 bg-[#0f1623] border border-[#1e2d45] rounded-lg p-1 w-fit">
        {tabs.map(({ key, label }) => {
          const count = countForTab(key);
          return (
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
                <span className={`text-xs tabular-nums ${activeTab === key ? '' : 'text-slate-600'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Actionable setups ── */}
      {actionable.length > 0 ? (
        <div className="flex flex-col gap-3">
          {actionable.map((setup) => (
            <SetupCard key={setup.id} setup={setup} collapsed={false} />
          ))}
        </div>
      ) : (
        <div className="bg-[#111827] border border-[#1e2d45] rounded-lg px-6 py-8 text-center">
          <p className="text-sm text-slate-500">
            Geen actieve setups voor{' '}
            {activeTab === 'aandelen' ? 'aandelen' : activeTab === 'etfs' ? 'ETFs' : 'Bitcoin'} op
            dit moment.
          </p>
        </div>
      )}

      {/* ── Alleen observeren ── */}
      {observeren.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-[#1e2d45]" />
            <span className="text-xs text-slate-500 uppercase tracking-wide px-2">
              Alleen observeren
            </span>
            <div className="h-px flex-1 bg-[#1e2d45]" />
          </div>
          <div className="flex flex-col gap-2">
            {observeren.map((setup) => (
              <SetupCard key={setup.id} setup={setup} collapsed={true} />
            ))}
          </div>
        </div>
      )}

      {/* ── Vermijden ── */}
      {vermijden.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-[#1e2d45]" />
            <span className="text-xs text-red-500/70 uppercase tracking-wide px-2">Vermijden</span>
            <div className="h-px flex-1 bg-[#1e2d45]" />
          </div>
          <div className="flex flex-col gap-2">
            {vermijden.map((setup) => (
              <SetupCard key={setup.id} setup={setup} collapsed={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
