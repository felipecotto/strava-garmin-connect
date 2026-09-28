import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  outputFileTracingIncludes: {
    "/\\[slug\\]/card": ["./assets/fonts/**/*"],
  },
};

export default nextConfig;
