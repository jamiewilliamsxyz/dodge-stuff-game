const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const plr = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 12,
  speed: 5
};

const keys = {
  w: false,
  a: false,
  s: false,
  d: false
};

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w':
      keys.w = true;
      break;
    case 'a':
      keys.a = true;
      break;
    case 's':
      keys.s = true;
      break;
    case 'd':
      keys.d = true;
      break;    
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'w':
      keys.w = false;
      break;
    case 'a':
      keys.a = false;
      break;
    case 's':
      keys.s = false;
      break;
    case 'd':
      keys.d = false;
      break;    
  }
});

function drawPlr() {
  ctx.beginPath();
  ctx.arc(plr.x, plr.y, plr.radius, 0, Math.PI * 2, false);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.closePath();
}

function movePlr() {
  if (keys.w && plr.y - plr.radius > 0) {
    plr.y -= plr.speed;
  }
  if (keys.a && plr.x - plr.radius > 0) {
    plr.x -= plr.speed;
  }
  if (keys.s && plr.y + plr.radius < canvas.height) {
    plr.y += plr.speed;
  }
  if (keys.d && plr.x + plr.radius < canvas.width) {
    plr.x += plr.speed;
  }
}

let stuff = [];
let score = 0;
const scoreHTML = document.getElementById('score');
const stuffSpeed = 4.5;
let gameOver = false;
let scoreInterval;

function spawnStuff() {
  if (!gameOver) {
    const x = Math.random() * (canvas.width - 30) + 15;
    const baseRadius = 15;
    const sizeVariation = Math.random() < 0.5 ? 0.9 : 1.5;
    const radius = baseRadius * sizeVariation;
    stuff.push({ x, y: 0, radius, speed: stuffSpeed });
    const interval = Math.random() * (1000 - 100) + 100;
    setTimeout(spawnStuff, interval);
  }
}

function updateScore() {
  score += 1;
  scoreHTML.innerHTML = 'Score: ' + score;
}

function checkCollision() {
  for (let i = 0; i < stuff.length; i++) {
    const dx = plr.x - stuff[i].x;
    const dy = plr.y - stuff[i].y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < plr.radius + stuff[i].radius) {
      gameOver = true;
      clearInterval(scoreInterval);
      return;
    }
  }
}

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlr();
  movePlr();
  
  for (let i = stuff.length - 1; i >= 0; i--) {
    stuff[i].y += stuff[i].speed;
    ctx.beginPath();
    ctx.arc(stuff[i].x, stuff[i].y, stuff[i].radius, 0, Math.PI * 2, false);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();

    if (stuff[i].y - stuff[i].radius > canvas.height) {
      stuff.splice(i, 1);
    }
  }

  checkCollision();
  requestAnimationFrame(update);
}

scoreInterval = setInterval(updateScore, 1000);
spawnStuff();
update();
