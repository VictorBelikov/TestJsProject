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
