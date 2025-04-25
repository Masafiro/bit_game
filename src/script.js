let bits = "10101";  // 2進数文字列として扱う
var problem;

const BIT_WIDTH = 5;

function updateDisplay() {
  document.getElementById("bitDisplay").textContent = bits;
}

function cyclicShiftRight() {
  bits = bits[bits.length - 1] + bits.slice(0, bits.length - 1);
  updateDisplay();
}

function cyclicShiftLeft() {
  bits = bits.slice(1) + bits[0];
  updateDisplay();
}

function andBits(maskStr) {
  let result = "";
  for (let i = 0; i < BIT_WIDTH; i++) {
    result += (bits[i] === "1" && maskStr[i] === "1") ? "1" : "0";
  }
  bits = result;
  updateDisplay();
}

function xorBits(maskStr) {
  let result = "";
  for (let i = 0; i < BIT_WIDTH; i++) {
    result += (bits[i] !== maskStr[i]) ? "1" : "0";
  }
  bits = result;
  updateDisplay();
}

function operate(operationId) {
  console.log(problem.operations);
  let operation = problem.operations[operationId];
  let operationType = operation.operation_type;
  console.log(operation);
  switch (operationType) {
    case "xor":
      xorBits(operation.parameter);
      break;
    case "or":
      orBits(operation.parameter);
      break;
    case "cyclic-lshift":
      cyclicShiftLeft();
      break;
    case "cyclic-rshift":
      cyclicShiftRight();
      break;
  }
}
function loadProblem() {
  fetch("../problems/example_problem.json")
    .then(response => response.json())
    .then(data => {
      problem = data.problem;
      console.log("長さ:", problem.bit_length)
      bits = problem.start;
      console.log("読み込んだビット:", problem.start);
      console.log("現在の bits（文字列）:", bits);
      console.log(problem);
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