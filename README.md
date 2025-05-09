# bit_game

## URL
```
https://masafiro.github.io/bit_game/src/index.html
```

## local での実行の仕方
```
python3 -m http.server 8000    
```
でサーバーを建てた後に
```
http://localhost:8000
```
にアクセス

## github 操作メモ
###  変更を保存・反映する基本コマンド
0. 最新のリモートをローカルに反映
```
git pull origin your-branch-name
```
1. ブランチを作って移動
```
git checkout -b your-branch-name # your-branch-name は適宜変更
```
2. 変更をステージ・コミット
```
git add .                        # すべての変更をステージに追加
git commit -m "作業内容の説明"     # ローカルにコミット
```
3. リモートに反映
```
git push origin your-branch-name
```
4. 変更を GitHub 上で main に反映したいとき
GitHub の画面から「Pull Request」を作成して、main にマージ（取り込み）する

-------------

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
