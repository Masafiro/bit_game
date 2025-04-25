const clickSound = new Audio('click_sound.mp3');

// 操作時に音を鳴らす関数
function playClickSound() {
  clickSound.currentTime = 0; // 巻き戻してから再生（連続クリック対応）
  clickSound.play();
}

let bits = 0b10101;  // 初期値を設定（5ビットで始める）
const bitLength = 5; // 5ビットで扱う

// 画面の表示を更新する
function updateDisplay() {
  const display = bits.toString(2).padStart(bitLength, '0');
  document.getElementById("bitDisplay").textContent = display;
}

// NOT演算（ビット反転）
function notBits() {
  playClickSound();
  bits = ~bits & ((1 << bitLength) - 1);  // 反転し、桁数制限
  updateDisplay();
}

// 他の操作（右シフト、左シフト、and、xor など）も同様に実装可能

// 右シフト
function cyclicShiftRight() {
  playClickSound();
  const lsb = bits & 1;
  bits = (bits >> 1) | (lsb << (bitLength - 1));
  bits &= (1 << bitLength) - 1;
  updateDisplay();
}

// 循環左シフト
function cyclicShiftLeft() {
  playClickSound();
  const msb = (bits >> (bitLength - 1)) & 1;
  bits = ((bits << 1) | msb) & ((1 << bitLength) - 1);
  updateDisplay();
}

// AND演算
function andBits(mask) {
  playClickSound();
  const maskValue = parseInt(mask, 2);
  bits = bits & maskValue;  // AND演算
  updateDisplay();
}

// XOR演算
function xorBits(mask) {
  playClickSound();
  const maskValue = parseInt(mask, 2);
  bits = bits ^ maskValue;  // XOR演算
  updateDisplay();
}

// 初期表示
updateDisplay();
