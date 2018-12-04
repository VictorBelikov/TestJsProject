function sum(a) {
  const result = a || 0;

  function summator(b) {
    return sum(result + (b || 0));
  }

  summator.valueOf = function () {
    return result;
  };
  return summator;
}

const s = sum();
console.log(s); // 0
console.log(s(1)); // 1
console.log(s(1)(2)); // 3
console.log(s(3)(4)(5)); // 12
