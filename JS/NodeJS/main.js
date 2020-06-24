const operation = process.argv[2];
let loops = 11;
let delay = 10;
let start = process.hrtime();

const run = () => {
  loops--;
  for (let i = 0; i < 1e7; i++) {
    Math.pow(Math.random(), Math.random());
  }
  console.log('Hello, world!');
  if (loops > 0) {
    switch (operation) {
      case 'blocked':
        run();
        break;
      case 'nexttick':
        process.nextTick(run);
        break;
      case 'setimmediate':
        setImmediate(run);
        break;
    }
  }
};

setTimeout(() => {
  const [seconds, nanoSeconds] = process.hrtime(start);
  const msElapsed = seconds * 1000 + nanoSeconds / 1e6;
  console.log(`I took ${msElapsed}ms (Expected to take ${delay}ms)`);
}, delay);

run();

// Parametres to call this script
// time node main.js blocked
// time node main.js nexttick
// time node main.js setimmediate
