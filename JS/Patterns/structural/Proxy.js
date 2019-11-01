class Robot {
  executeTask() {
    return 'executing the task';
  }
}

class RobotProxy {
  constructor(power) {
    this.power = power;
  }

  executeTask() {
    return this.power.percentage < 1 ? 'will stop executing the task soon' : new Robot().executeTask();
  }
}

class RobotPOWER {
  constructor(percentage) {
    this.percentage = percentage;
  }
}

const robot1 = new RobotProxy(new RobotPOWER(45)).executeTask(); // robot1 - a real robot
const robot2 = new RobotProxy(new RobotPOWER(0.745)).executeTask(); // robot2 - not a real robot, it's only a message

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

  set(target, p, value) {
    console.log(`set property '${p}' to '${value}'`);
    target[p] = value;
  },
});

console.log(proxy1.name); // Max
console.log(proxy1.unknown); // [unknown]
proxy1.job = 'programmer'; // set property 'job' to 'programmer'
console.log(person.job); // programmer
