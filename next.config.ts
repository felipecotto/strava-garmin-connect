import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  outputFileTracingIncludes: {
    "/\\[slug\\]/card": ["./assets/fonts/**/*"],
  },
  async redirects() {
    return [
      { source: "/dashboard", destination: "/", permanent: true },
      { source: "/dashboard/:path+", destination: "/perfil", permanent: true },
    ];
  },
};

export default nextConfig;
