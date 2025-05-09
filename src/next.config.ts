import type { NextConfig } from "next";

/* 公開時のサブディレクトリ */
const SUB_DIRECTORY = "/bit_game";

/* 本番環境と開発環境の分岐用のフラグ */
const isProd = process.env.NODE_ENV == "production"

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? SUB_DIRECTORY : "",
  assetPrefix: isProd ? SUB_DIRECTORY : "",
};

export default nextConfig;