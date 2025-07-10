"use strict";

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

let box = 20;
let score = 0;
let snake = [];
let direction = "RIGHT";
let food = {};
let game;

// Spawn random food within canvas
function spawnFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
  };
}

// Draw snake and food
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = "#ff6b6b";
  ctx.fillRect(food.x, food.y, box, box);

  // Move snake
  let head = { ...snake[0] };

  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  // Game over: wall collision
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height ||
    collision(head, snake)
  ) {
    clearInterval(game);
    alert("💀 Game Over!");
    restartBtn.style.display = "inline-block";
    return;
  }

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = spawnFood();
    scoreDisplay.textContent = `Score: ${score}`;
  } else {
    snake.pop();
  }

  // Draw snake
  ctx.fillStyle = "#2c7a91";
  snake.forEach((segment) =>
    ctx.fillRect(segment.x, segment.y, box, box)
  );
}

// Collision detection
function collision(head, body) {
  return body.some(
    (segment, i) => i !== 0 && head.x === segment.x && head.y === segment.y
  );
}

// Handle direction keys
document.addEventListener("keydown", (e) => {
  const key = e.key;

  // Only block arrow keys to prevent scrolling
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(key)) {
    e.preventDefault(); // Stop default browswer scrolling
  }

  if (key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Reset logic
function resetGame() {
  clearInterval(game);
  score = 0;
  direction = "RIGHT";
  snake = [{ x: 200, y: 200 }];
  food = spawnFood();
  scoreDisplay.textContent = "Score: 0";
  game = setInterval(draw, 100);
}

// Start button logic
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  canvas.style.display = "block";
  scoreDisplay.style.display = "block";
  restartBtn.style.display = "none";
  resetGame();
});

// Restart button logic
restartBtn.addEventListener("click", () => {
  canvas.style.display = "none";
  scoreDisplay.style.display = "none";
  restartBtn.style.display = "none";
  startBtn.style.display = "inline-block";
});
