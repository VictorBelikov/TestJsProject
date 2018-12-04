if (typeof Object.create !== 'function') {
  Object.create = function (o, props) {
    function F() { }
    F.prototype = o;
    const obj = new F();

    if (typeof (props) === 'object') {
      for (const prop in props) {
        if (props.hasOwnProperty((prop))) {
          obj[prop] = props[prop].value;
        }
      }
    }
    return obj;
  };
}

const myObj = Object.create(null, { message: { value: 'hello' }, message2: { value: 'hello2' } });
console.log(myObj); // {message: "hello", message2: "hello2"}
