import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/jkurn-profile",
  images: { unoptimized: true },
};

export default nextConfig;
