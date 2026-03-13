import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Backwards-compatibility redirects: old flat routes → /marktwaarde/*
    return [
      { source: '/daghandel',    destination: '/marktwaarde/daghandel',    permanent: true },
      { source: '/maandelijks',  destination: '/marktwaarde/maandelijks',  permanent: true },
      { source: '/avondbriefing',destination: '/marktwaarde/avondbriefing',permanent: true },
      { source: '/bitcoin',      destination: '/marktwaarde/bitcoin',      permanent: true },
      { source: '/nieuws',       destination: '/marktwaarde/nieuws',       permanent: true },
    ];
  },
};

export default nextConfig;
