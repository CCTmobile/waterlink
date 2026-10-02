import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/invoice",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
