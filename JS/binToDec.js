const a = parseInt('232').toString(2); // 11101000
const b = parseInt('11101000', 2).toString(10); // 232

// ============================================================================

const binToDec = (num) => {
  return num
    .split('')
    .reverse()
    .reduce((sum, curr, index) => (curr === '1' ? sum + Math.pow(2, index) : sum), 0);
};

console.log(binToDec('11101000')); // 232

// ============================================================================

const decToBin = (decNum) => {
  const stack = [];

  while(decNum > 0) {
    stack.push(decNum % 2);
    decNum = Math.floor(decNum / 2);
  }
  
  return +stack.reverse().join('');
};

console.log(decToBin(232)); // 11101000