const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "../out");
const targetDir = path.join(outDir, "bit_game");

// 必要なディレクトリを作成
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 移動対象のファイルとディレクトリ
const itemsToMove = ["_next", "favicon.ico", "index.html"];

// out 内の指定されたファイルやディレクトリを bit_game ディレクトリに移動
itemsToMove.forEach((item) => {
  const itemPath = path.join(outDir, item);
  const targetPath = path.join(targetDir, item);

  if (fs.existsSync(itemPath)) {
    fs.renameSync(itemPath, targetPath);
    console.log(`Moved ${item} to ${targetDir}`);
  } else {
    console.warn(`Warning: ${item} does not exist in ${outDir}`);
  }
});

console.log("Restructured out directory!");