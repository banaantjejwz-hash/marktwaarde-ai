import Navigation from '@/components/layout/Navigation';
import MarketStatusBar from '@/components/layout/MarketStatusBar';

export default function MarktWaardeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <MarketStatusBar />
      <main
        className="min-h-screen pt-12 md:ml-[220px] pb-24 md:pb-0 bg-[#0a0e1a]"
        id="main-content"
      >
        {children}
      </main>
    </>
  );
}
