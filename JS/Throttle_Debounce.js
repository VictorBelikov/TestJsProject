function throttle(fn, delay) {
  // Отнимает delay, чтобы 1-ый вызов был без ожидания.
  let lastExecution = Date.now() - delay;
  // Остальные вызовы раз в delay сек.
  return function () {
    if (lastExecution + delay <= Date.now()) {
      lastExecution = Date.now();
      fn.apply(this, arguments);
    }
  };
}

// let th1 = throttle(() => {
//   console.log('Hello, world!');
// }, 5000);

// th1();

function debounce(fn, delay) {
  let timeout;

  return function () {
    const that = this;
    const args = arguments;

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(that, args);
    }, delay);
  };
}

const db1 = debounce((message) => {
  console.log(message);
}, 2000);

db1('hello');
