import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/ecom/home",
        permanent: true, 
      },
    ];
  },
};

module.exports = nextConfig;
