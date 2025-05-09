import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/bit_game', // GitHub Pages のリポジトリ名を指定
  assetPrefix: '/bit_game', // 静的ファイルのパスを修正
};

export default nextConfig;