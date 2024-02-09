// "name": "Return the sum of positive values",
function f1(arr) {
  return arr.filter((el) => el > 0).reduce((acc, el) => acc + el, 0);
}

// console.log(f1([1, -2, -6, 3, 7])); // 11
// console.log(f1([1, -2, -6, 3, -7])); // 4

// Return original array concatenated with its mirror
function f3(arr) {
  // return [...arr].concat(arr.reverse());
  return arr.concat(arr.slice().reverse());
}
// console.log(f3([10, 25, 35, 50])); // [10, 25, 35, 50, 50, 35, 25, 10]
// console.log(f3([10, 25, 35, 50, 60])); // [10, 25, 35, 50, 60, 60, 50, 35, 25, 10]

// Take every 3rd element of array
function f4(arr) {
  return arr.filter((el, i) => !(i % 3));
}
// console.log(f4([3, 2, 1, 33, 44, 55, 66, 55, 33])); // [3, 33, 66]
// console.log(f4([3, 2, 1, 33, 44, 55, 66, 55, 33, 101])); // [3, 33, 66, 101]

// Convert array to decimal number
function f5(arr) {
  return +arr.join('');
}
// console.log(f5([2, 1, 2, 3])); // 2123
// console.log(f5([3, 1, 3, 3, 7])); // 31337

// Move the first two elements to the end of the array
function f6(arr) {
  return arr.concat(arr.splice(0, 2));
}
// console.log(f6(['a', 'b', 'c', 'd', 'e'])); // ['c', 'd', 'e', 'a', 'b']
// console.log(f6(['a', 'b', 'c', 'd', 'e', 'j'])); // ['c', 'd', 'e', 'j', 'a', 'b']

// Convert array of string to abbreviation
function f7(str) {
  return str.match(/[A-Z]/g).join('');
}
// console.log(f7('Union of Soviet Socialist Republics')); // 'USSR'
// console.log(f7('United States of America')); // 'USA'

// Sum of the five biggest numbers
function f9(arr) {
  return arr
    .sort((a, b) => a - b)
    .slice(-5)
    .reduce((acc, el) => acc + el, 0);
}
// console.log(f9([2, -3, -5, 10, 14, -20, -50, 100, -200, 42, -11, 200, 142, 19])); // 503
// console.log(f9([2, -3, -5, 10, 14, -20, -50, 1, -200, 42, -11])); // 69

// Check for Palindrome
function f10(str) {
  str = str.toLowerCase().match(/[\w]/g);
  return str.join('') === str.reverse().join('');
}
// console.log(f10('A man, a plan, a canal. Panama')); // true
// console.log(f10('race car')); // true
// console.log(f10('A man, a plan, a canal. Panama wrong')); // false
// console.log(f10('kayak')); // true

// Check if parentheses are balanced
function f11(str) {
  const stack = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '(') stack.push(str[i]);
    else if (str[i] === ')') stack.pop();
  }
  return !stack.length;
}
// console.log(f11('arg.reduce((xs, x) => 10 * xs + x)')); // true
// console.log(f11('arg.reduce((xs, x) => 10 * xs + x)(')); // false
// console.log(f11('(())')); // true
// console.log(f11('")("')); // false
// console.log(f11('")()("')); // false

// Remove duplicates for array with primitive
const numbers = [3, 3, 35657, 8, 9, 0, 5, 9, 7, 3, 7, 8, 45, 88, 35657];
const words = ['spray', 'limit', 'elite', 'limit', 'exuberant', 'spray', 'destruction', 'present'];

const result = [...new Set(words)];
const result2 = numbers.filter((el, i, self) => self.indexOf(el) === i);
