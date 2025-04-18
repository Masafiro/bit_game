let bits = 0b10101;  // 初期値を設定（5ビットで始める）
const bitLength = 5; // 5ビットで扱う

// 画面の表示を更新する
function updateDisplay() {
  const display = bits.toString(2).padStart(bitLength, '0');
  document.getElementById("bitDisplay").textContent = display;
}

// NOT演算（ビット反転）
function notBits() {
  bits = ~bits & ((1 << bitLength) - 1);  // 反転し、桁数制限
  updateDisplay();
}

// 他の操作（右シフト、左シフト、and、xor など）も同様に実装可能

// 右シフト
function cyclicShiftRight() {
  const lsb = bits & 1;
  bits = (bits >> 1) | (lsb << (bitLength - 1));
  bits &= (1 << bitLength) - 1;
  updateDisplay();
}

// 循環左シフト
function cyclicShiftLeft() {
  const msb = (bits >> (bitLength - 1)) & 1;
  bits = ((bits << 1) | msb) & ((1 << bitLength) - 1);
  updateDisplay();
}

// AND演算
function andBits(mask) {
  const maskValue = parseInt(mask, 2);
  bits = bits & maskValue;  // AND演算
  updateDisplay();
}

// XOR演算
function xorBits(mask) {
  const maskValue = parseInt(mask, 2);
  bits = bits ^ maskValue;  // XOR演算
  updateDisplay();
}

// 初期表示
updateDisplay();
