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
