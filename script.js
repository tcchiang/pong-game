const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle settings
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const PADDLE_MARGIN = 20;
const PADDLE_SPEED = 6;

// Ball settings
const BALL_SIZE = 16;
let ball = {
    x: WIDTH / 2 - BALL_SIZE / 2,
    y: HEIGHT / 2 - BALL_SIZE / 2,
    vx: 5 * (Math.random() > 0.5 ? 1 : -1),
    vy: 3 * (Math.random() > 0.5 ? 1 : -1),
};

// Left paddle (player)
let leftPaddle = {
    x: PADDLE_MARGIN,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    vy: 0,
};

// Right paddle (AI)
let rightPaddle = {
    x: WIDTH - PADDLE_MARGIN - PADDLE_WIDTH,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    vy: 0,
};

// Mouse movement for left paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    leftPaddle.y = mouseY - PADDLE_HEIGHT / 2;
    // Clamp within game area
    if (leftPaddle.y < 0) leftPaddle.y = 0;
    if (leftPaddle.y > HEIGHT - PADDLE_HEIGHT) leftPaddle.y = HEIGHT - PADDLE_HEIGHT;
});

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Ball collision with top/bottom walls
    if (ball.y <= 0 || ball.y + BALL_SIZE >= HEIGHT) {
        ball.vy *= -1;
        ball.y = ball.y <= 0 ? 0 : HEIGHT - BALL_SIZE;
    }

    // Ball collision with paddles
    // Left paddle
    if (
        ball.x <= leftPaddle.x + PADDLE_WIDTH &&
        ball.y + BALL_SIZE >= leftPaddle.y &&
        ball.y <= leftPaddle.y + PADDLE_HEIGHT
    ) {
        ball.vx *= -1;
        ball.x = leftPaddle.x + PADDLE_WIDTH;
        // Add some "spin" based on where you hit the paddle
        let hitPos = (ball.y + BALL_SIZE/2) - (leftPaddle.y + PADDLE_HEIGHT/2);
        ball.vy += hitPos * 0.05;
    }
    // Right paddle
    if (
        ball.x + BALL_SIZE >= rightPaddle.x &&
        ball.y + BALL_SIZE >= rightPaddle.y &&
        ball.y <= rightPaddle.y + PADDLE_HEIGHT
    ) {
        ball.vx *= -1;
        ball.x = rightPaddle.x - BALL_SIZE;
        let hitPos = (ball.y + BALL_SIZE/2) - (rightPaddle.y + PADDLE_HEIGHT/2);
        ball.vy += hitPos * 0.05;
    }

    // Reset ball if it goes out of bounds (left or right)
    if (ball.x < -BALL_SIZE || ball.x > WIDTH + BALL_SIZE) {
        resetBall();
    }

    // AI paddle movement (simple: follow the ball)
    let targetY = ball.y + BALL_SIZE / 2 - PADDLE_HEIGHT / 2;
    let diff = targetY - rightPaddle.y;
    rightPaddle.y += Math.sign(diff) * Math.min(Math.abs(diff), PADDLE_SPEED);
    // Clamp within game area
    if (rightPaddle.y < 0) rightPaddle.y = 0;
    if (rightPaddle.y > HEIGHT - PADDLE_HEIGHT) rightPaddle.y = HEIGHT - PADDLE_HEIGHT;
}

// Draw everything
function draw() {
    // Clear
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw middle line
    ctx.strokeStyle = "#aaa";
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(leftPaddle.x, leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = "#ff3";
    ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);
}

// Reset ball to center after score
function resetBall() {
    ball.x = WIDTH / 2 - BALL_SIZE / 2;
    ball.y = HEIGHT / 2 - BALL_SIZE / 2;
    ball.vx = 5 * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = 3 * (Math.random() > 0.5 ? 1 : -1);
}

// Start game loop
gameLoop();
