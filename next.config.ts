import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Root → main entry point (handled at Vercel edge, not via static page)
      { source: '/',             destination: '/marktwaarde',              permanent: false },
      // Backwards-compatibility: old flat routes → /marktwaarde/*
      { source: '/daghandel',    destination: '/marktwaarde/daghandel',    permanent: true },
      { source: '/maandelijks',  destination: '/marktwaarde/maandelijks',  permanent: true },
      { source: '/avondbriefing',destination: '/marktwaarde/avondbriefing',permanent: true },
      { source: '/bitcoin',      destination: '/marktwaarde/bitcoin',      permanent: true },
      { source: '/nieuws',       destination: '/marktwaarde/nieuws',       permanent: true },
    ];
  },
};

export default nextConfig;
