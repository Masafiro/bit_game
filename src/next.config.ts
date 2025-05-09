import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/bit_game' : '', // 本番環境のみ basePath を適用
  assetPrefix: process.env.NODE_ENV === 'production' ? '/bit_game' : '', // 本番環境のみ assetPrefix を適用
};

export default nextConfig;