import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.wixmp.com",
        port: "",
        pathname: "/f/**",
      },
      {
        protocol: "https",
        hostname: "**.deviantart.net",
        port: "",
        pathname: "/**",
      },
    ],
    minimumCacheTTL: 900,
    maximumRedirects: 0,
  },
  agentRules: false,
  devIndicators: false,
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: { root: process.cwd() },
};

export default nextConfig;
