import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Market Operator AI — Beslissingsplatform',
  description:
    'Professioneel marktintelligentieplatform voor Nederlandse beleggers. Uitsluitend informatief, geen beleggingsadvies.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
