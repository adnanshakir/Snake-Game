const board = document.querySelector(".board");
const blockWidth = 50;
const blockHeight = 50;
const strtBtn = document.querySelector(".start-btn");
const modal = document.querySelector(".modal");
const startWindow = document.querySelector(".start-win");
const gameOver = document.querySelector(".game-over");
const restartBtn = document.querySelector(".btn-restart");

const highScore = document.querySelector("#high-score");
const scoreDisplay = document.querySelector("#score-display");
const timeDisplay = document.querySelector("#time-display");

let score = 0;
let highScoreVal = localStorage.getItem("highScore") || 0;
highScore.innerText = highScoreVal;
let time = `00-00`;

highScore.innerText = highScoreVal;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let intervalId = null;
let timerIntervalId = null;

const blocks = [];
let snake = [
  { x: 1, y: 3 },
  { x: 1, y: 4 },
];
let direction = "down";
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");

    board.appendChild(block);
    // block.textContent = `${row} - ${col}`;
    blocks[`${row}-${col}`] = block;
  }
}

function render() {
  let head = null;

  blocks[`${food.x}-${food.y}`].classList.add("food");

  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }

  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervalId);
    modal.style.display = "flex";
    startWindow.style.display = "none";
    gameOver.style.display = "flex";
    return;
  }

  //Food consumption and growth
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    blocks[`${food.x}-${food.y}`].classList.add("food");

    snake.unshift(head);
    score += 10;
    scoreDisplay.innerText = score;
    if (score > highScoreVal) {
      highScoreVal = score;
      localStorage.setItem("highScore", highScoreVal.toString());
      highScore.innerText = highScoreVal;
    }
  }

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });

  snake.unshift(head);
  snake.pop();
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.add("fill");
  });
}

strtBtn.addEventListener("click", () => {
  modal.style.display = "none";
  intervalId = setInterval(() => {
    render();
  }, 350);
  timerIntervalId = setInterval(() => {
    let [mins, secs] = time.split("-").map(Number);

    if (secs === 59) {
      mins += 1;
      secs = 0;
    }else {
      secs += 1;
    }
    time = `${mins}-${secs}`;
    timeDisplay.innerText = time;
  }, 1000);
});

restartBtn.addEventListener("click", resetGame);

function resetGame() {
  let food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };

  score = 0;
  scoreDisplay.innerText = score;
  time = `00-00`;

  timeDisplay.innerText = time;
  scoreDisplay.innerText = score;
  highScore.innerText = highScoreVal;

  blocks[`${food.x}-${food.y}`].classList.remove("food");
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });

  modal.style.display = "none";
  snake = [
    { x: 1, y: 3 },
    { x: 1, y: 4 },
  ];

  direction = "down";

  intervalId = setInterval(() => {
    render();
  }, 350);
}

addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    direction = "up";
  } else if (e.key === "ArrowDown") {
    direction = "down";
  } else if (e.key === "ArrowLeft") {
    direction = "left";
  } else if (e.key === "ArrowRight") {
    direction = "right";
  }
});
