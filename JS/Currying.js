// https://learn.javascript.ru/bind

// function getBrickVolume(width, length, height) { // легкий пример
//     return width * length * height;
// }
//
// let BrickVolumeWidth = getBrickVolume.bind(null, 10);
// let BrickVolumeWidthLength = BrickVolumeWidth.bind(null, 20);
//
// let Volume1 = BrickVolumeWidthLength(8); // 1600
// let Volume2 = BrickVolumeWidthLength(12); // 2400
// let Volume3 = BrickVolumeWidthLength(15); // 3000

// let Volume1 = getBrickVolume(10, 20, 8); // 1600
// let Volume2 = getBrickVolume(10, 20, 12); // 2400
// let Volume3 = getBrickVolume(10, 20, 15); // 3000

// =======================================================================

// тут мясо
Function.prototype.myBind = function (context, ...args) {
  const callContext = this;
  return function (...restArgs) {
    return callContext.apply(context, args.concat(restArgs));
  };
};

function curry(func) {
  return function help(...args) {
    if (func.length !== args.length) {
      return help.myBind(null, ...args);
    }
    return func(...args);
  };
}

// =======================================================================

// работает также, как "мясо", но проще понять
function curry2(fn, ...args) {
  return function (arg) {
    const allArgs = args.concat(arg);
    if (allArgs.length === fn.length) {
      return fn(...allArgs);
    }
    return curry2(fn, ...allArgs);
  };
}

// =======================================================================

function target1(a, b, c, d) {
  return a + b + c + d;
}

function target2(a, b) {
  return a + b;
}

console.log(curry(target1)(1)(2)(3)(4)); // 10
console.log(curry(target2)(5)(8)); // 13
