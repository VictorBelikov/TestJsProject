// объект, который может иметь только один экземпляр.
const Singleton = (function() {
  let _instance = null; // в замыкании

  return function() {
    if (_instance === null) {
      _instance = this;
    }
    return _instance;
  };
})();

const s1 = new Singleton();
const s2 = new Singleton();
console.log(s1 === s2); // true

// function F() {
//   return F;
// }

// ======================================================================================

class Robot {
  constructor() {
    if (typeof Robot.instance === 'undefined') {
      Robot.instance = this;
    }
    return Robot.instance;
  }
}

const r1 = new Robot();
const r2 = new Robot();
console.log(r1 === r2); // true
