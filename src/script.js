var currentBits;  // 2進数文字列として扱う
var problem;

function cyclicShiftRight(bits) {
  return bits[problem.bit_length - 1] + bits.slice(0, problem.bit_length - 1);
}

function cyclicShiftLeft(bits) {
  return bits.slice(1) + bits[0];
}

function andBits(bits, mask) {
  let result = "";
  for (let i = 0; i < problem.bit_length; i++) {
    result += (bits[i] === "1" && mask[i] === "1") ? "1" : "0";
  }
  return result;
}

function orBits(bits, maskStr) {
  let result = "";
  for (let i = 0; i < problem.bit_length; i++) {
    result += (bits[i] === "1" || maskStr[i] === "1") ? "1" : "0";
  }
  return result;
}

function notBits(bits) {
  let result = "";
  for (let i = 0; i < problem.bit_length; i++) {
    result += (bits[i] === "1") ? "0" : "1";
  }
  return result;
}

function nandBits(bits, maskStr) {
  let result = "";
  for (let i = 0; i < problem.bit_length; i++) {
    result += (bits[i] === "1" && maskStr[i] === "1") ? "0" : "1";
  }
  return result;
}

function norBits(bits, maskStr) {
  let result = "";
  for (let i = 0; i < problem.bit_length; i++) {
    result += (bits[i] === "1" || maskStr[i] === "1") ? "0" : "1";
  }
  return result;
}

function xnorBits(bits, maskStr) {
  let result = "";
  for (let i = 0; i < problem.bit_length; i++) {
    result += (bits[i] === maskStr[i]) ? "1" : "0";
  }
  return result;
}

function xorBits(bits, maskStr) {
  let result = "";
  for (let i = 0; i < problem.bit_length; i++) {
    result += (bits[i] !== maskStr[i]) ? "1" : "0";
  }
  return result;
}

function getOperationResult(bits, operation){
  let operationType = operation.operation_type;
  switch (operationType) {
    case "cyclic-lshift":
      return cyclicShiftLeft(bits);
    case "cyclic-rshift":
      return cyclicShiftRight(bits);
    case "and":
      return andBits(bits, operation.parameter);
    case "or":
      return orBits(bits, operation.parameter);
    case "not":
      return notBits(bits);
    case "nand":
      return nandBits(bits, operation.parameter);
    case "nor":
      return norBits(bits, operation.parameter);
    case "xnor":
      return xnorBits(bits, operation.parameter);
    case "xor":
      return xorBits(bits, operation.parameter);
  }
}

function updateBitDisplay() {
  document.getElementById("bitDisplay").textContent = currentBits;
}

function operate(operationId) {
  currentBits = getOperationResult(currentBits, problem.operations[operationId]);
  updateBitDisplay();
}

function getOperationText(operation) {
  let operationType = operation.operation_type;
  switch (operationType) {
    case "cyclic-lshift":
      return "左シフト"
    case "cyclic-rshift":
      return "右シフト"
    case "and":
      return "AND " + operation.parameter;
    case "or":
      return "OR " + operation.parameter;
    case "not":
      return "NOT";
    case "nand":
      return "NAND " + operation.parameter;
    case "nor":
      return "NOR " + operation.parameter;
    case "xnor":
      return "XNOR " + operation.parameter;
    case "xor":
      return "XOR " + operation.parameter;
  }
}

function loadProblem() {
  fetch("../problems/problem1.json")
    .then(response => response.json())
    .then(data => {
      problem = data.problem;
      console.log(problem);
      console.log(problem.operations[0]);

      currentBits = problem.start;

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