// thunk(fn, ...args) - это функция, которая получает функцию fn и, возможно, некоторые аргументы, передаваемые функции, и возвращает функцию. Когда эта возвращаемая функция вызывается, она возвращает результат выполнения функции fn. thunk является отложенным выражением (функцией). Его оценка откладывается до тех пор, пока это не понадобится.
function thunk(fn, ...args) {
  return function () {
    return fn(...args);
  };
}

// trampoline(thunk) - это функция, которая повторно вызывает аргумент thunk, пока он не вернет non function value. Затем возвращается это последнее значение.
function trampoline(thunk) {
  while (thunk && typeof thunk === 'function') {
    thunk = thunk();
  }
  return thunk;
}

function trmpSum(n) {
  function _sum(n, ac) {
    if (n === 0) return ac;
    return thunk(_sum, n - 1, ac + n);
  }
  return trampoline(thunk(_sum, n, 0));
}

// function _isEven(n) {
//   return n === 0 ? true : thunk(_isOdd, n - 1);
// }

// function _isOdd(n) {
//   return n === 0 ? false : thunk(_isEven, n - 1);
// }

// function isEven(n) {
//   // return n === 0 ? true : isOdd(n - 1);
//   return trampoline(thunk(_isEven, n));
// }

// function isOdd(n) {
//   // return n === 0 ? false : isEven(n - 1);
//   return trampoline(thunk(_isOdd, n));
// }

// console.log(isEven(10)); // true
// console.log(isOdd(10)); // false
// console.log(isOdd(99999)); // Max. call stack size ex.

console.log(trmpSum(10)); // 55
console.log(trmpSum(99999)); // 4999950000; нет переполнения стека
