import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Wrong-domain links (e.g. refidao.github.io, Bing) point Local ReFi Toolkit paths
  // at this site. Send visitors to the closest in-house hub until upstream links are fixed.
  async redirects() {
    return [
      {
        source: "/local-refi-toolkit",
        destination: "/knowledge-garden/resources",
        permanent: false,
      },
      {
        source: "/local-refi-toolkit/:path*",
        destination: "/knowledge-garden/resources",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
