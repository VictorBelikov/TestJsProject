// =============================== Factory ====================================
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

// =============================== Module =====================================
const Module = (function() {
  const goods = []; // в замыкании
  let totalSum = 0; // в замыкании

  return {
    addProduct(product) {
      goods.push(product);
      totalSum += product.price;
    },

    printAllProducts() {
      goods.forEach((el) => {
        console.log(`${el.name} --> ${el.price}`);
      });
      console.log(`Total price: ${totalSum}`);
    },
  };
})();

const sault = {
  name: 'Sault',
  price: '20',
};

// Module.addProduct(sault);
// Module.printProducts();

// =============================== Singleton ==================================
// объект, который может иметь только один экземпляр.
const Singleton = (function() {
  let _instance = null; // в замыкании

  return function() {
    if (!_instance) _instance = this;
    return _instance;
  };
})();

const s1 = new Singleton();
const s2 = new Singleton();
console.log(s1 === s2); // true

// =========================== Fluent Interface ===============================
function Car() {}

Car.prototype.setMake = function(make) {
  this.make = make;
  return this;
};

Car.prototype.setModel = function(model) {
  this.model = model;
  return this;
};

Car.prototype.setYear = function(year) {
  this.year = year;
  return this;
};

Car.prototype.save = function() {
  console.log(`${this.make} ${this.model} ${this.year} was successfully saved`);
  return this;
};

const vw = new Car()
  .setMake('VW')
  .setModel('Passat')
  .setYear(2008)
  .save();
