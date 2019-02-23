function makeArmy() {
  let shooters = [];

  for (let i = 0; i < 10; i++) {
    // lex.env. для каждой функции одни и тот же - это внутренний scope makeArmy, где и будут
    // зарегистрированы переменные temp, i если они объявлены через var. Если их объявить через let,
    // то они будут регистрироваться в scope цикла for, который на каждый итерации будет новый -->
    // все будет в порядке.
    var temp = i;
    shooters.push(function () {
      console.log(temp);
    });

    // каждый раз создается новый lex.env. в который присваивается temp
    // (function () {
    //     var temp = i;
    //     shooters.push(function () {
    //         console.log(temp);
    //     });
    // }());
  }
  return shooters;
}

const shtsArmy = makeArmy();

shtsArmy[0](); // стрелок выводит 10, а должен 0
shtsArmy[5](); // стрелок выводит 10...
// .. все стрелки выводят 10 вместо 0,1,2...9
