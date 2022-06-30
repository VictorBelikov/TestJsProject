class Robot {
  executeTask() {
    return 'executing the task';
  }
}

// RobotProxy принимает power-модуль и решает создавать робота или нет.
class RobotProxy {
  constructor(power) {
    this.power = power;
  }

  executeRobot() {
    return this.power < 1 ? 'will stop executing the task soon' : new Robot().executeTask();
  }
}

const robot1 = new RobotProxy(45).executeRobot(); // robot1 - a real robot
const robot2 = new RobotProxy(0.745).executeRobot(); // robot2 - not a real robot, it's only a message

console.log(robot1); // executing the task
console.log(robot2); // will stop executing the task soon

// ======================================================================================

const person = {
  name: 'Max',
  age: '29',
};

// new Proxy(target, handler);
const proxy1 = new Proxy(person, {
  get: (target, key) => target[key] || `[${key}]`,

  set(target, key, value) {
    console.log(`set property '${key}' to '${value}'`);
    target[key] = value;
  },
});

console.log(proxy1.name); // Max
console.log(proxy1.unknown); // [unknown]
proxy1.job = 'programmer'; // set property 'job' to 'programmer'
console.log(person.job); // programmer
