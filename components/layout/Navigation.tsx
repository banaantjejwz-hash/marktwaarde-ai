'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M8 1.5L1.5 7V14.5H6V10H10V14.5H14.5V7L8 1.5Z"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinejoin="round"
      fill="none"
    />
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
    <path d="M5 1.5V4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    <path d="M11 1.5V4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M13.5 8.5A5.5 5.5 0 017 2a5.5 5.5 0 100 12 5.5 5.5 0 006.5-5.5z"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinejoin="round"
    />
  </svg>
);

const BitcoinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
    <path
      d="M6 5.5h3a1.5 1.5 0 010 3H6m0-3v3m0 0h3.5a1.5 1.5 0 010 3H6m0-3v3M7 5v1m0 5v1M9 5v1m0 5v1"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    />
  </svg>
);

const NewsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.5" y="2" width="13" height="12" rx="1" stroke="currentColor" strokeWidth="1.25" />
    <path d="M4.5 5.5H11.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    <path d="M4.5 8H11.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    <path d="M4.5 10.5H8.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
  </svg>
);

const StrategyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 13L6 9L9 11L14 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="14" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.1" />
    <circle cx="2" cy="13" r="1.5" stroke="currentColor" strokeWidth="1.1" />
  </svg>
);

const navItems: NavItem[] = [
  { href: '/marktwaarde', label: 'Overzicht', icon: <HomeIcon /> },
  { href: '/marktwaarde/daghandel', label: 'Daghandel', icon: <ChartBarIcon /> },
  { href: '/marktwaarde/maandelijks', label: 'Maandelijks', icon: <CalendarIcon /> },
  { href: '/marktwaarde/avondbriefing', label: 'Avondbriefing', icon: <MoonIcon /> },
  { href: '/marktwaarde/bitcoin', label: 'Bitcoin', icon: <BitcoinIcon /> },
  { href: '/marktwaarde/nieuws', label: 'Nieuws', icon: <NewsIcon /> },
  { href: '/marktwaarde/strategie', label: 'Strategie', icon: <StrategyIcon /> },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <nav
        className="fixed top-0 left-0 h-full w-[220px] flex flex-col z-30
                   bg-[#111827] border-r border-[#1e2d45]
                   hidden md:flex"
        aria-label="Hoofdnavigatie"
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-5 border-b border-[#1e2d45]">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-100 leading-tight">
            Market Operator AI
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 tracking-wide">
            Beslissingsplatform
          </p>
        </div>

        {/* Nav items */}
        <div className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-0.5 px-3">
            {navItems.map((item) => {
              const isActive =
                item.href === '/marktwaarde'
                  ? pathname === '/marktwaarde'
                  : pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded text-sm
                      transition-colors duration-150 select-none
                      ${
                        isActive
                          ? 'bg-blue-500/10 text-blue-400 border-l-2 border-blue-500 pl-[10px]'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border-l-2 border-transparent pl-[10px]'
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="px-5 py-4 border-t border-[#1e2d45]">
          <p className="text-[10px] text-slate-600 leading-snug">
            Geen beleggingsadvies.
            <br />
            Uitsluitend informatief.
          </p>
        </div>
      </nav>

      {/* Mobile bottom bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 md:hidden
                   bg-[#111827] border-t border-[#1e2d45]"
        aria-label="Mobiele navigatie"
      >
        <ul className="flex items-center justify-around h-14 px-2">
          {navItems.map((item) => {
            const isActive =
              item.href === '/marktwaarde'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex flex-col items-center gap-1 px-2 py-1.5 rounded
                    text-[10px] transition-colors duration-150
                    ${isActive ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{item.icon}</span>
                  <span className="truncate max-w-[48px] text-center">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
