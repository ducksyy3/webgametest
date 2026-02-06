const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let x = 50;
let y = 50;

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "lime";
  ctx.fillRect(x, y, 40, 40);
  requestAnimationFrame(loop);
}

loop();

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") x += 5;
  if (e.key === "ArrowLeft") x -= 5;
  if (e.key === "ArrowUp") y -= 5;
  if (e.key === "ArrowDown") y += 5;
});
