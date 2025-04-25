var bits;  // 2進数文字列として扱う
var problem;

function updateDisplay() {
  document.getElementById("bitDisplay").textContent = bits;
}

function cyclicShiftRight() {
  bits = bits[problem.bit_length - 1] + bits.slice(0, problem.bit_length - 1);
  updateDisplay();
}

function cyclicShiftLeft() {
  bits = bits.slice(1) + bits[0];
  updateDisplay();
}

function andBits(maskStr) {
  let result = "";
  for (let i = 0; i < problem.bit_length; i++) {
    result += (bits[i] === "1" && maskStr[i] === "1") ? "1" : "0";
  }
  bits = result;
  updateDisplay();
}

function orBits(maskStr) {
  let result = "";
  for (let i = 0; i < problem.bit_length; i++) {
    result += (bits[i] === "1" || maskStr[i] === "1") ? "1" : "0";
  }
  bits = result;
  updateDisplay();
}

function notBits() {
  let result = "";
  for (let i = 0; i < problem.bit_length; i++) {
    result += (bits[i] === "1") ? "0" : "1";
  }
  bits = result;
  updateDisplay();
}

function nandBits(maskStr) {
  let result = "";
  for (let i = 0; i < problem.bit_length; i++) {
    result += (bits[i] === "1" && maskStr[i] === "1") ? "0" : "1";
  }
  bits = result;
  updateDisplay();
}

function norBits(maskStr) {
  let result = "";
  for (let i = 0; i < problem.bit_length; i++) {
    result += (bits[i] === "1" || maskStr[i] === "1") ? "0" : "1";
  }
  bits = result;
  updateDisplay();
}

function xnorBits(maskStr) {
  let result = "";
  for (let i = 0; i < problem.bit_length; i++) {
    result += (bits[i] === maskStr[i]) ? "1" : "0";
  }
  bits = result;
  updateDisplay();
}

function xorBits(maskStr) {
  let result = "";
  for (let i = 0; i < problem.bit_length; i++) {
    result += (bits[i] !== maskStr[i]) ? "1" : "0";
  }
  bits = result;
  updateDisplay();
}

function operate(operationId) {
  let operation = problem.operations[operationId];
  console.log(operation);
  let operationType = operation.operation_type;
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

function getOperationText(operation){
  let operationType = operation.operation_type;
  switch (operationType) {
    case "xor":
      return "xor" + operation.parameter;
    case "and":
      return "and" + operation.parameter;
    case "or":
      return "or" + operation.parameter;
    case "cyclic-lshift":
      return "左シフト"
    case "cyclic-rshift":
      return "右シフト"
  }
}
function loadProblem() {
  fetch("../problems/example_problem1.json")
    .then(response => response.json())
    .then(data => {
      problem = data.problem;
      console.log(problem);
      console.log(problem.operations[0]);

      bits = problem.start;
      //表示を更新
      document.getElementById("bitDisplay").textContent = problem.start;
      document.getElementById("operation1").textContent = getOperationText(problem.operations[0]);
      document.getElementById("operation2").textContent = getOperationText(problem.operations[1]);
      document.getElementById("operation3").textContent = getOperationText(problem.operations[2]);
      document.getElementById("operation4").textContent = getOperationText(problem.operations[3]);
    })
    .catch(error => {
      console.error("ビットの読み込みに失敗しました:", error);
    });  
}