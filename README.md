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


