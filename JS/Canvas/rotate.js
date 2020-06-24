const canvas = document.createElement('canvas');
canvas.width = 480;
canvas.height = 320;
canvas.style.background = '#eee';
canvas.style.display = 'block';
canvas.style.margin = 'auto';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

let angle = 0;

const image = new Image();
image.src = 'img/poet-1.jpg';

const drawRotateFigure = () => {
  ctx.beginPath();
  ctx.rect(40, 40, 60, 60);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.closePath();
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(70, 70);
  ctx.rotate(angle * Math.PI / 180);
  ctx.translate(-70, -70);
  // drawRotateFigure();
  ctx.drawImage(image, 40, 40, 60, 60);
  ctx.restore();
  angle++;
  requestAnimationFrame(draw);
};

draw();
