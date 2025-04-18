let bits = "10101";

function updateDisplay() {
  document.getElementById("bitDisplay").textContent = bits;
}

function cyclicShiftRight() {
  bits = bits.slice(-1) + bits.slice(0, -1);
  updateDisplay();
}

function cyclicShiftLeft() {
  bits = bits.slice(1) + bits[0];
  updateDisplay();
}
