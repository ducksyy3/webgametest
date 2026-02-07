 // =====================
 // GAME STATE
 // =====================
 let gameState = "menu";
 let score = 0;

 // =====================
 // SETTINGS
 // =====================
 let settings = {
   speed: 0.4,
   friction: 0.9,
   smoothMovement: true,
   invertControls: false
 };

 // =====================
 // DOM
 // =====================
 const canvas = document.getElementById("gameCanvas");
 const ctx = canvas.getContext("2d");

 const mainMenu = document.getElementById("mainMenu");
 const settingsMenu = document.getElementById("settingsMenu");

 const playBtn = document.getElementById("playBtn");
 const settingsBtn = document.getElementById("settingsBtn");
 const backBtn = document.getElementById("backBtn");

 const speedSlider = document.getElementById("speedSlider");
 const glideSlider = document.getElementById("glideSlider");
 const smoothToggle = document.getElementById("smoothToggle");
 const invertToggle = document.getElementById("invertToggle");

 const scoreText = document.getElementById("scoreText");

 // =====================
 // PLAYER
 // =====================
 let x = 100;
 let y = 100;
 let vx = 0;
 let vy = 0;
 const size = 30;

 // =====================
 // COINS
 // =====================
 let coins = [];

 function spawnCoins(amount = 5) {
   coins = [];
   for (let i = 0; i < amount; i++) {
     coins.push({
       x: Math.random() * (canvas.width - 20),
       y: Math.random() * (canvas.height - 20),
       size: 15
     });
   }
 }

 // =====================
 // INPUT
 // =====================
 let keys = {};

 window.addEventListener("keydown", e => {
   keys[e.key.toLowerCase()] = true;

   if (e.key === "Escape" && gameState === "game") {
     gameState = "menu";
     canvas.style.display = "none";
     mainMenu.style.display = "block";
   }
 });

 window.addEventListener("keyup", e => {
   keys[e.key.toLowerCase()] = false;
 });

 // =====================
 // MENU BUTTONS
 // =====================
 playBtn.onclick = () => {
   gameState = "game";
   mainMenu.style.display = "none";
   canvas.style.display = "block";
   spawnCoins();
   requestAnimationFrame(gameLoop);
 };

 settingsBtn.onclick = () => {
   gameState = "settings";
   mainMenu.style.display = "none";
   settingsMenu.style.display = "block";
 };

 backBtn.onclick = () => {
   gameState = "menu";
   settingsMenu.style.display = "none";
   mainMenu.style.display = "block";
 };

 // =====================
 // SETTINGS CONTROLS
 // =====================
 speedSlider.value = settings.speed;
 glideSlider.value = settings.friction;
 smoothToggle.checked = settings.smoothMovement;
 invertToggle.checked = settings.invertControls;

 speedSlider.oninput = () => {
   settings.speed = parseFloat(speedSlider.value);
 };

 glideSlider.oninput = () => {
   settings.friction = parseFloat(glideSlider.value);
 };

 smoothToggle.onchange = () => {
   settings.smoothMovement = smoothToggle.checked;
 };

 invertToggle.onchange = () => {
   settings.invertControls = invertToggle.checked;
 };

 // =====================
 // GAME LOOP
 // =====================
 function gameLoop() {
   if (gameState !== "game") return;

   // INPUT
   let dx = 0;
   let dy = 0;

   if (keys["a"] || keys["arrowleft"]) dx--;
   if (keys["d"] || keys["arrowright"]) dx++;
   if (keys["w"] || keys["arrowup"]) dy--;
   if (keys["s"] || keys["arrowdown"]) dy++;

   if (settings.invertControls) {
     dx *= -1;
     dy *= -1;
   }

   vx += dx * settings.speed;
   vy += dy * settings.speed;

   // MOVE
   x += vx;
   y += vy;

   // SMOOTH / NO SMOOTH
   if (settings.smoothMovement) {
     vx *= settings.friction;
     vy *= settings.friction;
   } else {
     if (!dx) vx = 0;
     if (!dy) vy = 0;
   }

   // WALLS
   x = Math.max(0, Math.min(canvas.width - size, x));
   y = Math.max(0, Math.min(canvas.height - size, y));

   // DRAW
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   // PLAYER
   ctx.fillStyle = "green";
   ctx.fillRect(x, y, size, size);

   // COINS
   ctx.fillStyle = "gold";
   for (let i = coins.length - 1; i >= 0; i--) {
     const c = coins[i];

     ctx.beginPath();
     ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
     ctx.fill();

     if (
       x < c.x + c.size &&
       x + size > c.x &&
       y < c.y + c.size &&
       y + size > c.y
     ) {
       coins.splice(i, 1);
       score++;
       scoreText.textContent = "Score: " + score;
     }
   }

   // RESPAWN COINS
   if (coins.length === 0) {
     spawnCoins();
   }

   requestAnimationFrame(gameLoop);
 }
