// ====================== Аналог interface в C# =========================================
function createCircle(radius = 10, location = { x: 14, y: 56 }) {
  return {
    radius,
    location,
    draw() {
      console.log(`circle: radius = ${radius}, x = ${location.x}, y = ${location.y}`);
    },
  };
}

const circle1 = createCircle();
circle1.draw();
console.log(circle1);

// ======================================================================================

class Robot {
  constructor(color, capacity) {
    this.color = color;
    this.capacity = capacity;
  }
}

class RobotFactory {
  createRobot(type) {
    switch (type) {
      case 'r100':
        return new Robot('red', 100);
      case 'r200':
        return new Robot('white', 1000);
    }
  }
}

const factory = new RobotFactory();
const r200 = factory.createRobot('r200');
