'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  accent?: string;
}

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 1.5L1.5 7V14.5H6V10H10V14.5H14.5V7L8 1.5Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
  </svg>
);

const ChartBarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.5" y="8" width="3" height="6.5" rx="0.5" stroke="currentColor" strokeWidth="1.25" />
    <rect x="6.5" y="4.5" width="3" height="10" rx="0.5" stroke="currentColor" strokeWidth="1.25" />
    <rect x="11.5" y="1.5" width="3" height="13" rx="0.5" stroke="currentColor" strokeWidth="1.25" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.5" y="3" width="13" height="11.5" rx="1" stroke="currentColor" strokeWidth="1.25" />
    <path d="M1.5 6.5H14.5" stroke="currentColor" strokeWidth="1.25" />
    <path d="M5 1.5V4.5M11 1.5V4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M13.5 8.5A5.5 5.5 0 017 2a5.5 5.5 0 100 12 5.5 5.5 0 006.5-5.5z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
  </svg>
);

const BitcoinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
    <path d="M6 5.5h3a1.5 1.5 0 010 3H6m0-3v3m0 0h3.5a1.5 1.5 0 010 3H6m0-3v3M7 5v1m0 5v1M9 5v1m0 5v1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

const NewsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.5" y="2" width="13" height="12" rx="1" stroke="currentColor" strokeWidth="1.25" />
    <path d="M4.5 5.5H11.5M4.5 8H11.5M4.5 10.5H8.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
  </svg>
);

const StrategyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 13L6 9L9 11L14 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="14" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.1" />
    <circle cx="2" cy="13" r="1.5" stroke="currentColor" strokeWidth="1.1" />
  </svg>
);

const ChatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 3.5C2 2.672 2.672 2 3.5 2h9C13.328 2 14 2.672 14 3.5v7c0 .828-.672 1.5-1.5 1.5H9.5L7 14.5 4.5 12H3.5C2.672 12 2 11.328 2 10.5v-7z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    <path d="M5.5 7h5M5.5 5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

const primaryNavItems: NavItem[] = [
  { href: '/marktwaarde', label: 'Overzicht', icon: <HomeIcon /> },
  { href: '/marktwaarde/daghandel', label: 'Daghandel', icon: <ChartBarIcon /> },
  { href: '/marktwaarde/maandelijks', label: 'Maandelijks', icon: <CalendarIcon /> },
  { href: '/marktwaarde/avondbriefing', label: 'Avondbriefing', icon: <MoonIcon /> },
  { href: '/marktwaarde/bitcoin', label: 'Bitcoin', icon: <BitcoinIcon /> },
];

const secondaryNavItems: NavItem[] = [
  { href: '/marktwaarde/nieuws', label: 'Nieuws', icon: <NewsIcon /> },
  { href: '/marktwaarde/strategie', label: 'Strategie', icon: <StrategyIcon /> },
];

const aiNavItem: NavItem = {
  href: '/marktwaarde/chat',
  label: 'AI Adviseur',
  icon: <ChatIcon />,
  accent: 'blue',
};

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const isAI = item.accent === 'blue';

  if (isAI) {
    return (
      <Link
        href={item.href}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 select-none border ${
          isActive
            ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
            : 'bg-blue-500/8 border-blue-500/20 text-blue-400 hover:bg-blue-500/15 hover:border-blue-500/35 hover:text-blue-300'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        <span className="flex-shrink-0">{item.icon}</span>
        <span className="truncate font-medium">{item.label}</span>
        {!isActive && (
          <span className="ml-auto text-[9px] font-semibold uppercase tracking-wider text-blue-500/70 bg-blue-500/10 px-1.5 py-0.5 rounded">
            AI
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 select-none ${
        isActive
          ? 'bg-white/8 text-slate-100 font-medium'
          : 'text-slate-400 hover:text-slate-200 hover:bg-white/4'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-slate-200' : 'text-slate-500'}`}>
        {item.icon}
      </span>
      <span className="truncate">{item.label}</span>
      {isActive && <span className="ml-auto w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />}
    </Link>
  );
}

export default function Navigation() {
  const pathname = usePathname();

  function isItemActive(item: NavItem): boolean {
    if (item.href === '/marktwaarde') return pathname === '/marktwaarde';
    return pathname === item.href || pathname.startsWith(item.href + '/');
  }

  const allMobileItems = [...primaryNavItems, aiNavItem, ...secondaryNavItems];

  return (
    <>
      {/* Desktop sidebar */}
      <nav
        className="fixed top-0 left-0 h-full w-[220px] flex flex-col z-30 bg-[#0d1420] border-r border-[#1a2640] hidden md:flex"
        aria-label="Hoofdnavigatie"
      >
        {/* Brand */}
        <div className="px-5 pt-5 pb-4 border-b border-[#1a2640]">
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-6 h-6 rounded bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 9L4 6L6 8L11 3" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xs font-bold tracking-wide text-slate-100 uppercase">
              Market Operator
            </span>
          </div>
          <p className="text-[10px] text-slate-600 tracking-wide pl-8">AI Investeringsplatform</p>
        </div>

        {/* Nav items */}
        <div className="flex-1 py-3 overflow-y-auto">
          <div className="px-3 space-y-0.5">
            {primaryNavItems.map((item) => (
              <NavLink key={item.href} item={item} isActive={isItemActive(item)} />
            ))}
          </div>

          <div className="px-3 pt-3 mt-3 border-t border-[#1a2640] space-y-0.5">
            {secondaryNavItems.map((item) => (
              <NavLink key={item.href} item={item} isActive={isItemActive(item)} />
            ))}
          </div>

          {/* AI Chat CTA */}
          <div className="px-3 pt-3 mt-3 border-t border-[#1a2640]">
            <NavLink item={aiNavItem} isActive={isItemActive(aiNavItem)} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#1a2640]">
          <p className="text-[10px] text-slate-700 leading-relaxed">
            Beslissingsondersteuning<br />Geen beleggingsadvies
          </p>
        </div>
      </nav>

      {/* Mobile bottom bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-[#0d1420] border-t border-[#1a2640]"
        aria-label="Mobiele navigatie"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <ul className="flex items-center justify-around h-16 px-2">
          {[...primaryNavItems.slice(0, 4), aiNavItem].map((item) => {
            const isActive = isItemActive(item);
            const isAI = item.accent === 'blue';
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1 py-2 min-h-[52px] w-full text-[10px] transition-colors duration-150 ${
                    isActive
                      ? isAI ? 'text-blue-400' : 'text-slate-100'
                      : isAI ? 'text-blue-500/70 active:text-blue-400' : 'text-slate-600 active:text-slate-300'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={`flex-shrink-0 ${isActive && !isAI ? 'text-slate-200' : ''}`}>
                    {item.icon}
                  </span>
                  {isActive && (
                    <span className="truncate text-center font-medium leading-none">
                      {item.label === 'Avondbriefing' ? 'Avond' : item.label === 'AI Adviseur' ? 'AI' : item.label}
                    </span>
                  )}
                  {!isActive && (
                    <span className="truncate text-center font-medium leading-none opacity-80">
                      {item.label === 'Avondbriefing' ? 'Avond' : item.label === 'AI Adviseur' ? 'AI' : item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
