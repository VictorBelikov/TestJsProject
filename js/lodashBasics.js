import _ from 'lodash';


/** #0 Simple utilities */

_.noop(); // заглушка; ничего не делает всегда возвр. undefined
_.identity(3); // 3; заглушка - возвр. 1-ый арг., кот. принимает
_.round(460, -2); // 500; округляется 60 вверх

/** #1 Type/Value checks/Conversions */

const obj4 = { test: 1, message: 'hello' };
const obj5 = { test: 1, message: 'hello' };

_.isEqual(obj4, obj5); // true; deep comparison

_.isMatch(obj4, { message: 'hello' }); // true; partial deep comparison

// Преобразует путь в массив
_.toPath('a.b.c'); // ["a", "b", "c"]
_.toPath('a[0].b.c'); // ["a", "0", "b", "c"]


/** #2 Simple operations on Objects  */

const obj6 = { a: [{ b: { c: 3 } }] };

// Путь к св-ву объекта
_.get(obj6, 'a[0].b.c'); // 3
_.get(obj6, 'a.b.c'); // undefined
_.get(obj6, 'a.b.c', 'default'); // 'default'
_.get(obj6, ['a', '0', 'b', 'c']); // 3

// Создать объект по пути
_.set({}, 'a.b.c', 1); // {a:{b:{c:1}}}
_.set(
  { posts: [{ text: 'post1', comments: [] }] },
  'posts[0].comments[0].author', 'Den',
); // { posts: [{ text: 'post1', comments: [{ author: 'Den' }] }] }

// Проверяет OWN property объекта
_.has(obj6, 'a'); // true
_.has(obj6, 'a[0].b'); // true
_.has(obj6, 'toString'); // false; from prototype

// Из объекта сделать другой объект; Not mutate source object
const obj7 = { a: 1, b: '2', c: 3 };
_.pick(obj7, ['a', 'c']); // {a: 1, c: 3}
_.omit(obj7, ['a', 'c']); // {b: '2'}

// Достаем из объекта то, что запросили в виде массива
const obj8 = { a: [{ b: { c: 3 } }, 4] };
_.at(obj8, ['a[0].b.c', 'a[1]']); // [3, 4]

// Получить ключи/значения объекта
function Foo() {
  this.a = 1;
  this.b = 2;
}
_.keys(new Foo()); // ['a', 'b']
_.values(new Foo()); // [1, 2]
_.toPairs(new Foo()); // [['a', 1], ['b', 2]]
_.keys('hi'); // [1, 2]

// Удалить св-ва из объекта. Удаляет только configurable св-ва.
const obj9 = { foo: 'hello', bar: 'world' };
_.unset(obj9, 'foo'); // true

// Объединить объекты
// _.assign()
// _.defaultsDeep()
// _.merge()

/** #3 Simple operations on Arrays */

// Works with any collections, not only with arrays
const arr3 = [1, 23, 5, 8, 4];
_.max(arr3); // 23
_.min(arr3); // 1
_.sum(arr3); // 41
_.mean(arr3); // 8.2; average value
_.size(arr3); // 5
_.size({ message: 'hello', name: 'Victor' }); // 2

// range([start=0], end, [step=1])
_.range(4); // [0, 1, 2, 3]
_.range(-4); // [0, -1, -2, -3]
_.range(1, 5); // [1, 2, 3, 4]
_.range(0, 20, 5); // [0, 5, 10, 15]
_.range(0, -4, -1); // [0, -1, -2, -3]
_.range(1, 4, 0); // [1, 1, 1]
_.range(0); // []

// Getting Array Items
_.head(); // undefined
_.head([]); // undefined
_.head(_.range(5)); // 0
_.last(_.range(5)); // 4
_.nth(_.range(5), 42); // undefined
_.nth(_.range(5), 2); // 2 (second arg is position)
_.nth(_.range(5), -2); // 3 (second arg is position)

// Slicing Arrays
_.drop(); // []
_.drop(_.range(5), 2); // [2, 3, 4]; выкинуть все до 2-ой позиции
_.dropRight(_.range(5), 2); // [0, 1, 2]; выкинуть все до 2-ой позиции с конца
_.initial(); // []; берет все кроме последнего эл-та в массиве
_.initial(_.range(5)); // [0, 1, 2, 3]
_.slice(_.range(5), 1, 3); // [1, 2]
_.slice(_.range(5), -1, 1); // []
_.slice(_.range(5), 1, -1); // [1, 2, 3]
_.slice(_.range(5), -3, -1); // [2, 3]
_.tail(_.range(5)); // [1, 2, 3, 4]
_.take(_.range(5)); // [0]
_.take(_.range(5), 2); // [0, 1]
_.takeRight(_.range(5)); // [4]
_.takeRight(_.range(5), 2); // [3, 4]

// Removing Array Items
const arr1 = ['', 'a', 'b', 'c', null, 'a', 'b'];
_.compact(arr1); // [a', 'b', 'c', 'a', 'b']; убираем все что приводится к false; НЕ изм.arr1
_.pull(arr1, 'a', 'c'); // ['', 'b', null, 'b']; изменяет arr1
_.without(arr1, 'a', 'c'); // ['', 'b', null, 'b']; НЕ изменяет arr1

// Flattening Nested Arrays
const arr2 = [1, [2, [3, [4]], 5]];
_.flatten(arr2); // [1, 2, [3, [4]], 5]; на 1 уровень
_.flattenDeep(arr2); // [1, 2, 3, 4, 5]; на всю глубину
_.flatten(arr2, 1); // [1, 2, [3, [4]], 5]; на зад. уровень
_.flatten(arr2, 2); // [1, 2, 3, [4], 5]; на зад. уровень

// Combining Arrays
_.concat([1], 2, [3], [[4]]); // [1, 2, 3, [4]]
_.difference([2, 1], [2, 3]); // [1]; 2-ой арг. - значения, кот. искл.
_.intersection([2, 1], [2, 3]); // [2]
_.union([2], [1, 2]); // [2, 1]; уникальные значения из обоих


/** #4 Going Functional */

const some1 = _.constant(42); // создает фукнц., кот. вовзр. указ. зн.
some1(); // 42

const obj1 = { a: [{ b: { c: 3 } }] };
_.update(obj1, 'a[0].b.c', n => n * n); // {a : [{ b: { c: 9 } }] }
_.update(obj1, 'x[0].y.z', n => (n ? n + 1 : 0)); // {a:[{ b: { c: 9 }}], x:[{ y: { z: 0 }}] }

// _.assignInWith(object, sources, [customizer]);
// In - работает с унаслед. св-вами;
// With - есть customizer
const def1 = _.partialRight(
  _.assignInWith,
  (objValue, srcValue) => (_.isUndefined(objValue) ? srcValue : objValue),
);
def1({ a: 1 }, { b: 2 }, { a: 3 }); // { a: 1, b: 2 }

// _.mergeWith(object, sources, [customizer]);
_.mergeWith(
  { a: [1], b: [2] },
  { a: [3], b: [4] },
  (objValue, srcValue) => (_.isArray(objValue) ? objValue.concat(srcValue) : srcValue),
); // { a: [1, 3], b: [2, 4] }

// _.property(path)
const getPopulation = _.property('population');
const getName = _.property('name');
const cities = [{ name: 'Minsk', population: '~2M' }, { name: 'Brest', population: '~350K' }];
getName(cities[0]); // Minsk
getPopulation(cities[1]); // ~350K

// setter Functions
const setter = path => (obj, value) => _.set(obj, path, value);
const setName = setter('name');
setName({}, 'Den'); // { name: 'Den' }

// Currying
const obj2 = {};
const curriedSet = _.curry(_.set);
const setObjProp = curriedSet(obj2);
const setObjId = setObjProp('id');
const setObjName = setObjProp('name');
setObjId(1); // { id: 1 }
setObjName('test'); // { id: 1, name: 'test' }

// _.pickBy(obj, [predicate=_.identity]); если predicate не передан, то будут выбраны, только
// те значения, кот. при приведении дадут true
const obj3 = { a: 1, b: '2', c: 3 };
_.pickBy(obj3, _.isNumber); // { a: 1, c: 3 }


/** #5 Operators on Collections */

// filter
const users1 = [
  { user: 'barney', age: 36, active: true },
  { user: 'fred', age: 40, active: false },
];
_.filter(users1, user => !user.active); // [{ user: 'fred', age: 40, active: false }]
_.filter(users1, { age: 36, active: true }); // [{ user: 'barney', age: 36, active: true }]
_.filter(users1, ['active', false]); // [{ user: 'fred', age: 40, active: false }]
_.filter(users1, 'active'); // [{ user: 'barney', age: 36, active: true }]

// _.matches(source)
const post2 = { active: true, text: 'Hi!', comments: [{ text: 'Hello' }] };
const isActive = _.matches({ active: true });
const hasNoComments = _.matches({ comments: { length: 0 } });
isActive(post2); // true
hasNoComments(post2); // false

// _.negate(predicate)
const post1 = { active: true, text: 'Hi!', comments: [{ text: 'Hello' }] };
const hasComments = _.negate(_.matches({ comments: { length: 0 } }));
hasComments(post1); // true

// _.matchesProperty(path, srcValue); Может сравнивать лишь одно св-во
const post3 = {
  active: true,
  author: { name: 'Den', skills: ['JS', 'Lodash'] },
  text: 'Hi!',
};
const isMyPost = _.matchesProperty('author.name', 'Den');
isMyPost(post3); // true

// map
const square = n => n ** 2;
_.map([4, 8], square); // [16, 64]
_.map({ a: 4, b: 8 }, square); // [16, 64]; порядок не гарантируется
_.map(users1, 'user'); // ['barney', 'fred']

// _.reduce(coll, [iteratee=_.identity], [accum])
_.reduce([1, 2, 3], (acc, el) => acc + el, 0); // 6
_.reduce(
  { a: 1, b: 2, c: 1 },
  (res, val, key) => {
    (res[val] || (res[val] = [])).push(key);
    return res;
  },
  {},
); // { '1': ['a', 'c'], '2': ['b'] }

// orderBy
const users2 = [
  { user: 'fred', age: 48 }, // 3
  { user: 'barney', age: 34 }, // 2
  { user: 'fred', age: 40 }, // 4
  { user: 'barney', age: 36 }, // 1
];
_.orderBy(users2, ['user', 'age'], ['asc', 'desc']); // name - возрастание; age - убывание
