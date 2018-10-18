const SimpleModule = (function() {
  let sum = 0, // в замыкании
    goods = []; // в замыкании

  return {
    addProduct(product) {
      sum += product.price;
      goods.push(product);
    },
    printProducts() {
      for (let i = 0; i < goods.length; i++) {
        console.log(goods[i].name, goods[i].price);
      }
    }
  };
})();

const sault = {
  name: "Sault",
  price: "20"
};

// SimpleModule.addProduct(sault);
// SimpleModule.printProducts();

const Singleton = (function() {
  let _instance; // в замыкании

  return function() {
    if (!_instance) {
      _instance = this;
    } else {
      return _instance;
    }
  };
})();

let s1 = new Singleton();
let s2 = new Singleton();
console.log(s1 === s2); // true
