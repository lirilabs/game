const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

async function getToken() {
  const r = await fetch("/api/auth");
  return r.json();
}

const id = Math.random().toString(36).slice(2);
const players = {};
players[id] = { id, x: 200, y: 200 };

(async () => {
  const token = await getToken();

  const ably = new Ably.Realtime({
    authCallback: (_, cb) => cb(null, token)
  });

  const channel = ably.channels.get("room-1");

  setInterval(() => {
    channel.publish("state", players[id]);
  }, 50);

  channel.subscribe("state", msg => {
    players[msg.data.id] = msg.data;
  });

  requestAnimationFrame(loop);
})();

function loop() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for (const k in players) {
    const p = players[k];
    ctx.beginPath();
    ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(loop);
}
