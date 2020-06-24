/**
 * реализовать фукнцию `fizzBuzz`
 * которая выводит числа от 1 до 100.
 * Если число кратно 3 - вместо числа вывести `Fizz`.
 * Если кратно 5 - вывести вместо числа `Buzz`.
 * Если число кратно и 3 и 5 - вывести вместо числа `FizzBuzz`.
 */
function fizzBuzz() {
  let a;
  for (let i = 1; i <= 100; i++) {
    a = i;
    !(i % 3) && (a = 'Fizz');
    !(i % 5) && (a = 'Buzz');
    !(i % 3) && !(i % 5) && (a = 'fizzBuzz');
    console.log(a);
  }
}

/**
 * deep object copy
 */
function deepCopy(obj) {
  if (typeof obj !== 'object') return obj;
  const copy = {};
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      copy[key] = deepCopy(obj[key]);
    } else {
      copy[key] = obj[key];
    }
  }
  return copy;
}

/**
 * Реализовать метод .myBind для всех функций,
 * который работает так же как оригинальный .bind но не использует его внутри
 * (можно использовать фукнцию выше)
 */
Function.prototype.myBind = function (context, ...args) {
  const callContext = this;
  return function (...restArgs) {
    return callContext.apply(context, args.concat(restArgs));
  };
};

/**
 * создать объект с волшебным свойством,
 * чтобы при присвоении ему значения, в консоль выводилась текущая дата и значение, которое присваиваем.
 * А при чтении всегда выводилось число на 1 больше предыдущего
 * o.magicProperty = 5; // 'Sat Mar 24 2018 13:48:47 GMT+0300 (+03) -- 5'
 * console.log(o.magicProperty); // 6
 * console.log(o.magicProperty); // 7
 * console.log(o.magicProperty); // 8
 */
function MagicProp() {
  let _values = 0;
  Object.defineProperty(this, 'magicProperty', {
    set: (v) => {
      _values = v;
      console.log(`${new Date()} -- ${v}`);
    },
    get: () => ++_values,
  });
}

/**
 * Написать фукнцию сумматор, которая будет работать
 * const s = sum();
 * console.log(+s); // 0
 * console.log(+s(1)); // 1
 * console.log(+s(1)(2)); // 3
 * console.log(+s(3)(4)(5)); // 12
 * Число вызовов может быть неограниченым
 */
function sum(a) {
  let result = a || 0;

  function summator(b) {
    return sum(result + (b || 0));
  }
  summator.valueOf = function () {
    return result;
  };
  return summator;
}

/**
 Написать функцию getCounter и покрыть ее тестами, так, чтобы работал следующий код
 const c = getCounter(5);
 c
 .log() // 5
 .add(4)
 .log() // 9
 .add(3)
 .log() // 12
 .reset()
 .log() // 0
 .add(8)
 .log(); // 8
 */
function getCounter(n) {
  return {
    num: n,
    log() {
      console.log(this.num);
      return this;
    },
    add(val) {
      this.num += val;
      return this;
    },
    reset() {
      this.num = 0;
      return this;
    },
  };
}

// Создать синхронную функцию sleep(seconds) так, чтобы работал код
// console.log(new Date()); // Sun Oct 08 2017 10:44:34 GMT+0300 (+03)
// sleep(9);
// console.log(new Date()); // Sun Oct 08 2017 10:44:43 GMT+0300 (+03)
function sleep(secs) {
  // const currDate = new Date();
  // while (new Date() - currDate < secs * 1000) {}

  const currDate = Date.now();
  while (currDate + secs * 1000 > Date.now()) {}
}

// ========================== End main section ================================

/**
 * Написать функцию `isDeepEqual`
 * которая принимает на вход двe переменных
 * и проверяет идентичны ли они по содержимому. Например
 * @param {*} objA
 * @param {*} objB
 * @return {boolean} идентичны ли параметры по содержимому
 */
function isDeepEqual(objA, objB) {
  if (typeof objA === typeof objB) {
    if (typeof objA === 'number' && typeof objB === 'number' && isNaN(objA) && isNaN(objB)) {
      return true;
    }
    if (typeof objA === 'object' && typeof objB === 'object') {
      if (objA.length !== objB.length) return false;

      for (const key in objA) {
        if (objA[key] === objA && objB[key] === objB) return true; // рекурс. ссылки
        if (!isDeepEqual(objA[key], objB[key])) return false;
      }
      return true;
    }
    return objA === objB;
  }
  return false;
}

/**
 * Функция фиксации контекста
 * @param {*} func Функция для которой нужно зафиксировать контекст
 * @param {*} context значение для this
 * @return {function} функция с зафиксированным контекстом
 */
function bind(func, context) {
  return function () {
    return func.apply(context, arguments);
  };
}

/**
 * Написать фукнцию-калькулятор, которая работает следующим образом
 * calculate('+')(1)(2); // 3
 * calculate('*')(2)(3); // 6
 * Допустимые операции : + - * /
 */
function calculate(operator) {
  return function (a) {
    return function (b) {
      // switch (operator) {
      //     case '*':
      //         return a * b;
      //     case '+':
      //         return a + b;
      //     case '/':
      //         return a / b;
      //     case '-':
      //         return a - b;
      //     default:
      //         return 'incorrect operator';
      // }
      return eval(a + '' + operator + b);
    };
  };
}

/**
 * Создайте функцию ForceConstructor
 * которая работает как конструктор независимо от того,
 * вызвана она с new или без
 * и сохраняет параметры в создаваемый объект с именами параметров
 */
function ForceContructor(a, b, c) {
  if (this instanceof ForceContructor) {
    // если через new
    this.a = a;
    this.b = b;
    this.c = c;
  } else {
    return new ForceContructor(a, b, c); // recursion
  }
}

/*
Написать код, который для объекта созданного с помощью конструктора будет показывать,
что объект является экземпляром двух классов
*/
// Решение 1.
// class PreUser extends Array { }
// class User extends PreUser { }

// Решение 2.
function PreUser() {}
function User() {}

PreUser.prototype = [];
Object.defineProperty(PreUser.prototype, 'constructor', {
  enumerable: false, // не перечислять в for-in
  value: PreUser,
  writable: false,
});

User.prototype = new PreUser();
Object.defineProperty(User.prototype, 'constructor', {
  enumerable: false, // не перечислять в for-in
  value: User,
  writable: false,
});
// User === PreUser; // false
// u instanceof User; // true
// u instanceof Array; // true
// u instanceof PreUser; // true

/**
 * создать функцию, которая не может работать как конструктор (работать с `new`), и покрыть ее тестами
 * https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/new.target
 * */
function NotConstructor() {
  if (new.target) {
    throw new TypeError('Cannot be called with "new". Isn\'t a constructor.');
  }
}

// Написать реализацию метода .myCall, который будет работать аналогично системному .call и покрыть реализацию тестами
Function.prototype.myCall = function (context) {
  let args = []; // помещаем сюда все аргументы, кроме 1го, который context
  for (let i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return this.apply(context, args);
};
