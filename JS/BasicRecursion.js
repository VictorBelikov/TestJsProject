// Решение с циклом
// function fibonacci(n) {
//   let f = 0,
//     a = 0,
//     b = 1;
//   for (let i = 2; i <= n; i++) {
//     f = a + b;
//     a = b;
//     b = f;
//   }
//   return f;
// }

// Решение с рекурсией
// function fibonacci(num) {
// return n <= 2 ? 1 : fibonacci(n - 1) + fibonacci(n - 2);
// }

// Решение с кэшированием(мемоизацией). Очень сильно увелич. скорость: n=50
// (40млрд. выз.), а с кэшир.всего 99выз. Но дает больший расход памяти.
const memo = [];

function fibonacci(n) {
  if (memo[n]) return memo[n]; // если есть в массиве, то высчитывать не будем
  let fib = 0;
  let next = 1;

  for (let i = 0; i < n; i++) {
    memo[i] = fib;
    [fib, next] = [next, fib + next]; // swap
  }
  return fib;
}

// console.log(fibonacci(2)); // 1
// console.log(fibonacci(10)); // 55
// console.log(fibonacci(20)); // 6765


// ======================= Basic recursion ====================================
const pow = (x, n) => {
  return n === 1 ? x : x * pow(x, n - 1);
};

const sum = (n) => {
  return n === 1 ? n : n + sum(n - 1);
};

const factorial = (n) => {
  return n === 1 ? n : n * factorial(n - 1);
};
