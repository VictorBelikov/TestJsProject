// https://millermedeiros.github.io/mdoc/examples/node_api/doc/cluster.html
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

// Первый запущенный - основной master процесс. Процессы на ядрах - slave.
if (cluster.isMaster) {
  console.log(`CPUs: ${numCPUs}`);
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork(); // инициируем slave процессы, запуская этот же файл.
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000, () => console.log('server is running...'));

  console.log(`Worker ${process.pid} started`);
}

/**
 * В каждом slave процессе будет запущен сервер, кот. слушает port:8000.
 * Master единственный слушает порт:8000 и broadcast-ит все что приходит на каждый из своих slave.
 *
 * На каком тогда ядре запущен сам master процесс?
 * И чем master процесс слушает порт:8000?
 */
