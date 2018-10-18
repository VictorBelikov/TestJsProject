// https://www.youtube.com/watch?v=Z-5vORQcUYs
let fac = function factorial(n) {
  return n > 1 ? n * factorial(n - 1) : 1;
};

function logResultDecorator(fn, fnName) {
  return function() {
    const result = fn.apply(this, arguments);
    console.log(`Result ${fnName}: ${result}.`);
    return result;
  };
}

function callCountDecorator(fn, fnName) {
  let count = 0;
  return function() {
    count++;
    console.log(`Function ${fnName} was called ${count} times.`);
    return fn.apply(this, arguments);
  };
}

function timeDecorator(fn, fnName) {
  return function() {
    const startTime = performance.now();
    const result = fn.apply(this, arguments);
    const resultTime = (performance.now() - startTime).toFixed(1);
    console.log(`Function ${fnName} executed for ${resultTime} ms.`);
    return result;
  };
}

fac = logResultDecorator(fac, "factorial");
fac = callCountDecorator(fac, "factorial");
fac = timeDecorator(fac, "factorial");
fac(5);
