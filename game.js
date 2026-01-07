const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  r: 15,
  speed: 4,
  health: 100
};

let bullets = [];
let enemies = [];
let score = 0;

const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

canvas.addEventListener("click", e => {
  const angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
  bullets.push({
    x: player.x,
    y: player.y,
    vx: Math.cos(angle) * 8,
    vy: Math.sin(angle) * 8
  });
});

function spawnEnemy() {
  enemies.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 14,
    speed: 1.5
  });
}
setInterval(spawnEnemy, 1200);

function update() {
  // Player movement
  if (keys["w"]) player.y -= player.speed;
  if (keys["s"]) player.y += player.speed;
  if (keys["a"]) player.x -= player.speed;
  if (keys["d"]) player.x += player.speed;

  // Bullets
  bullets.forEach(b => {
    b.x += b.vx;
    b.y += b.vy;
  });

  // Enemies
  enemies.forEach(e => {
    const dx = player.x - e.x;
    const dy = player.y - e.y;
    const dist = Math.hypot(dx, dy);
    e.x += (dx / dist) * e.speed;
    e.y += (dy / dist) * e.speed;

    if (dist < player.r + e.r) {
      player.health -= 0.3;
    }
  });

  // Collisions
  bullets = bullets.filter(b => {
    let hit = false;
    enemies = enemies.filter(e => {
      const d = Math.hypot(b.x - e.x, b.y - e.y);
      if (d < e.r) {
        score++;
        hit = true;
        return false;
      }
      return true;
    });
    return !hit;
  });

  if (player.health <= 0) {
    submitScore();
    alert("Game Over! Score: " + score);
    location.reload();
  }

  document.getElementById("health").textContent = Math.max(0, player.health | 0);
  document.getElementById("score").textContent = score;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = "#4CAF50";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
  ctx.fill();

  // Bullets
  ctx.fillStyle = "#FFD54F";
  bullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Enemies
  ctx.fillStyle = "#E53935";
  enemies.forEach(e => {
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();

// ---------------- SERVERLESS SCORE ----------------
async function submitScore() {
  await fetch("/api/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score })
  });
}
