let bits = 0b10101;  // 2進数で 21

const BIT_WIDTH = 5;

function updateDisplay() {
  const bitStr = bits.toString(2).padStart(BIT_WIDTH, "0");
  document.getElementById("bitDisplay").textContent = bitStr;
}

function cyclicShiftRight() {
  const lsb = bits & 1;
  bits = (bits >> 1) | (lsb << (BIT_WIDTH - 1));
  bits &= (1 << BIT_WIDTH) - 1;
  updateDisplay();
}

function cyclicShiftLeft() {
  const msb = (bits >> (BIT_WIDTH - 1)) & 1;
  bits = ((bits << 1) | msb) & ((1 << BIT_WIDTH) - 1);
  updateDisplay();
}

function andBits(maskStr) {
  const mask = parseInt(maskStr, 2);
  bits &= mask;
  updateDisplay();
}

function xorBits(maskStr) {
  const mask = parseInt(maskStr, 2);
  bits ^= mask;
  updateDisplay();
}

function loadAndUpdateBit() {
  fetch("example.json")  // `bit.json` というファイル名だと仮定
    .then(response => response.json())
    .then(data => {
      bits = data.bit;  // `bit` の値を取得
      console.log("読み込んだビット:", data.bit);
      console.log(bits)
      updateDisplay();  // 表示を更新
    })
    .catch(error => {
      console.error("ビットの読み込みに失敗しました:", error);
    });
}

// function loadProblem() {
//   fetch("../problems/problem.json")
//     .then(response => response.json())
//     .then(data => {
//       const problem = data.problem;
//       const bitLength = problem.bit_length;
//       let bits = problem.start;

//       // 問題に基づいた操作を実行
//       problem.operations.forEach(op => {
//         switch (op.operation_type) {
//           case "xor":
//             xorBits(bits, op.parameter);
//             break;
//           case "or":
//             orBits(bits, op.parameter);
//             break;
//           case "cyclic-lshift":
//             cyclicShiftLeft(bits);
//             break;
//           case "cyclic-rshift":
//             cyclicShiftRight(bits);
//             break;
//         }
//       });

//       // 目標状態の表示
//       console.log(`最終的な状態: ${bits}`);
//     })
//     .catch(error => {
//       console.error("問題の読み込みに失敗しました:", error);
//     });
// }
