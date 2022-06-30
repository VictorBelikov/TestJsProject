/*
 * Здесь в замыкании находится переменная i, но замыкание динамическое, поэтому по
 * окончании цикла она у всех будет 10.
 * Варианты исправления:
 * 1. var --> let
 * 2. создать еще один scope в др. фукнции (не обязательно самовызывающейся)
 * */

function makeArmy() {
  const shooters = [];

  for (var i = 0; i < 10; i++) {
    shooters.push(function () {
      console.log(i);
    });

    // (function () {
    //   var num = i;
    //   shooters.push(function () {
    //     console.log(num);
    //   });
    // }());
  }
  return shooters;
}

const army = makeArmy();
army[0](); // 10
army[5](); // 10
