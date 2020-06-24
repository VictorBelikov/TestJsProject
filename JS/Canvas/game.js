// https://developer.mozilla.org/ru/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/%D0%9F%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D1%81%D1%82%D0%B8%D1%82%D1%8C_%D0%BC%D1%8F%D1%87
const canvas = document.createElement('canvas');
canvas.width = 480;
canvas.height = 320;
canvas.style.background = '#eee';
canvas.style.display = 'block';
canvas.style.margin = 'auto';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const ballRadius = 10;
let score = 0;

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 4;
let dy = -4;

// Параметры ракетки
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2; // начальная точка
let rightPressed = false;
let leftPressed = false;

// Параметры кирпичей
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const bricks = [];

for (let i = 0; i < brickColumnCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickRowCount; j++) {
    bricks[i][j] = { x: 0, y: 0, status: 1 };
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') rightPressed = true;
  else if (e.key === 'ArrowLeft') leftPressed = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowRight') rightPressed = false;
  else if (e.key === 'ArrowLeft') leftPressed = false;
});

document.addEventListener('mousemove', (e) => {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
});

const drawBall = () => {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
};

const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
};

const drawBricks = () => {
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      if (bricks[i][j].status === 1) {
        const brickX = (i * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (j * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[i][j].x = brickX;
        bricks[i][j].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
};

const collisionDetection = () => {
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      const brick = bricks[i][j];
      if (brick.status === 1) {
        // меняем направление при столкновении
        if (x > brick.x && x < brick.x + brickWidth && y > brick.y && y < brick.y + brickHeight) {
          dy = -dy;
          brick.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert('YOU WIN, CONGRATULATIONS!');
            document.location.reload();
          }
        }
      }
    }
  }
};

const drawScore = () => {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Score: ${score}`, 8, 20);
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection();

  // отскок от стены
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;

  if (y + dy < ballRadius) dy = -dy;
  else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) dy = -dy; // удар в пределах ракетки
    else {
      alert('GAME OVER');
      document.location.reload();
    }
  }

  // перемещение ракетки
  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
  if (leftPressed && paddleX > 0) paddleX -= 7;

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
};

// setInterval(draw, 10);
draw();
