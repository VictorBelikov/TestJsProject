// https://gist.github.com/dzmitry-varabei/479c9007603f2a31053cd5fec10a37f5

// "name": "Return the sum of positive values",
function f1(arr) {
  return arr.filter(el => el > 0).reduce((el, acc) => acc + el);
}

// Return values that are greater than 42
function f2(arr) {
  return arr.filter(el => el > 42);
}

// Return original array concatenated with its mirror
function f3(arr) {
  return arr.concat(arr.slice().reverse());
}

// Take every 3rd element of array
function f4(arr) {
  return arr.filter((el, i) => !(i % 3));
}

// Convert array to decimal number
function f5(arr) {
  return +arr.join('');
}

// Move the first two elements to the end of the array
function f6(arr) {
  return arr.concat(arr.splice(0, 2));
}

// Convert array of string to abbreviation
function f7(str) {
  return str.match(/[A-Z]/g).join('');
}

// Sum of other elements
function f8(arr) {
  return arr.map(el => arr.filter(item => item !== el).reduce((acc, e) => acc + e, 0));
}

// Sum of the five biggest numbers
function f9(arr) {
  return arr
    .sort((a, b) => a - b)
    .slice(-5)
    .reduce((acc, el) => acc + el, 0);
}

// Check for Palindrome
function f10(str) {
  str = str
    .match(/[\w]/g)
    .join('')
    .toLowerCase();
  return (
    str ===
    str
      .split('')
      .reverse()
      .join('')
  );
}

// Check if parentheses are balanced
function f11(str) {
  const stack = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '(') stack.push(str[i]);
    if (str[i] === ')') stack.pop();
  }
  return !stack.length;
}

console.log(f11('arg.reduce((xs, x) => 10 * xs + x)')); // true
console.log(f11('arg.reduce((xs, x) => 10 * xs + x)(')); // false
console.log(f11('(())')); // true
console.log(f11('")("')); // false
console.log(f11('")()("')); // false
