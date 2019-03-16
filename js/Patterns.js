// =============================== Module =====================================
const Module = (function () {
  let sum = 0; // в замыкании
  const goods = []; // в замыкании

  return {
    addProduct(product) {
      sum += product.price;
      goods.push(product);
    },
    printProducts() {
      for (let i = 0; i < goods.length; i++) {
        console.log(goods[i].name, goods[i].price);
      }
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
const Singleton = (function () {
  let _instance = null; // в замыкании

  return function () {
    if (!_instance) _instance = this;
    return _instance;
  };
})();

const s1 = new Singleton();
const s2 = new Singleton();
console.log(s1 === s2); // true

// =============================== Interface ==================================
function Car() {}

Car.prototype.setMake = function (make) {
  this.make = make;
  return this;
};

Car.prototype.setModel = function (model) {
  this.model = model;
  return this;
};

Car.prototype.setYear = function (year) {
  this.year = year;
  return this;
};

Car.prototype.save = function () {
  console.log(`${this.make} ${this.model} ${this.year} was successfully saved`);
  return this;
};

const vw = new Car()
  .setMake('VW')
  .setModel('Passat')
  .setYear(2008)
  .save();
