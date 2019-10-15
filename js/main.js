var a = { field1: 1 };
var b = { ...a } // { field: 1 }, a !== b

a.field2 = 2; a.field3 = 3;


// Распределяем объект 'а' на две переменные 'cdd' & 'c'
var { field2: cdd, ...c } = a; // cdd === 2; c: { field1: 1, field3: 3 }
