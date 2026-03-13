'use client';

import { useState, useMemo } from 'react';
import type { NewsItem, AssetCategory } from '@/lib/types';
import NewsCard from './NewsCard';

type FilterType = 'all' | 'relevant' | 'aandelen' | 'etf' | 'bitcoin' | 'macro';

interface NewsListProps {
  items: NewsItem[];
  defaultFilter?: FilterType;
  showFilterBar?: boolean;
  title?: string;
}

const categoryFilters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Alle' },
  { key: 'macro', label: 'Macro' },
  { key: 'aandelen', label: 'Aandelen' },
  { key: 'etf', label: 'ETFs' },
  { key: 'bitcoin', label: 'Bitcoin' },
];

function matchesFilter(item: NewsItem, filter: FilterType): boolean {
  if (filter === 'all') return true;
  if (filter === 'relevant') return item.isRelevant;
  if (filter === 'macro') return item.categoryTags.includes('macro');
  if (filter === 'aandelen') return item.affectedCategories.includes('aandeel');
  if (filter === 'etf') return item.affectedCategories.includes('etf');
  if (filter === 'bitcoin') return item.affectedCategories.includes('bitcoin');
  return true;
}

export default function NewsList({
  items,
  defaultFilter = 'all',
  showFilterBar = true,
  title,
}: NewsListProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'relevant'>('all');
  const [categoryFilter, setCategoryFilter] = useState<FilterType>(
    defaultFilter === 'relevant' ? 'all' : defaultFilter
  );

  const relevantCount = useMemo(() => items.filter((n) => n.isRelevant).length, [items]);

  const sorted = useMemo(
    () => [...items].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [items]
  );

  const filtered = useMemo(() => {
    let base = sorted;

    // Apply tab filter first
    if (activeTab === 'relevant') {
      base = base.filter((n) => n.isRelevant);
    }

    // Apply category filter (only when on "all" tab)
    if (activeTab === 'all' && categoryFilter !== 'all' && categoryFilter !== 'relevant') {
      base = base.filter((n) => matchesFilter(n, categoryFilter));
    }

    return base;
  }, [sorted, activeTab, categoryFilter]);

  return (
    <div className="flex flex-col gap-4">
      {title && (
        <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
      )}

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 bg-[#0f1623] border border-[#1e2d45] rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-slate-700 text-slate-100'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Alle nieuwsitems
        </button>
        <button
          onClick={() => setActiveTab('relevant')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-medium transition-colors ${
            activeTab === 'relevant'
              ? 'bg-slate-700 text-slate-100'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Relevante items
          {relevantCount > 0 && (
            <span
              className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                activeTab === 'relevant'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-500/20 text-blue-400'
              }`}
            >
              {relevantCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Category filter chips (only on "all" tab) ── */}
      {showFilterBar && activeTab === 'all' && (
        <div className="flex flex-wrap gap-1.5">
          {categoryFilters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setCategoryFilter(key)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                categoryFilter === key
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                  : 'bg-[#0f1623] border-[#1e2d45] text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── List ── */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="bg-[#111827] border border-[#1e2d45] rounded-lg px-6 py-10 flex flex-col items-center gap-2 text-center">
            <svg
              className="w-8 h-8 text-slate-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <p className="text-sm text-slate-500">Geen nieuwsitems gevonden</p>
            <p className="text-xs text-slate-600">
              Pas het filter aan om meer resultaten te zien.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              variant={activeTab === 'relevant' && item.isRelevant ? 'full' : 'compact'}
            />
          ))
        )}
      </div>

      {/* ── Count ── */}
      {filtered.length > 0 && (
        <p className="text-xs text-slate-600 text-right">
          {filtered.length} item{filtered.length !== 1 ? 's' : ''} weergegeven
        </p>
      )}
    </div>
  );
}
