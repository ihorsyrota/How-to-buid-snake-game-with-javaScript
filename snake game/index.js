const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let speed = 7;
let tileSize = 20;
let tileCount = canvas.clientHeight / tileSize;

let headX = 10;
let headY = 10;

// array for snake parts
let snakeParts = [];
let tailLength = 2;

//initialize the speed of snake
let xvelocity = 0;
let yvelocity = 0;

//draw apple
let appleX = Math.floor(Math.random() * tileCount);
let appleY = Math.floor(Math.random() * tileCount);

//scores
let score = 0;
let keyboardEventCode = '';

let isGameOver = false;

function resetGame() {
    snakeParts = [];
    xvelocity = 0;
    yvelocity = 0;
    score = 0;
    keyboardEventCode = '';
    headX = 10;
    headY = 10;
    tailLength = 2;
    speed = 7;
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
}

// create game loop-to continously update screen
function drawGame() {
    changeSnakePosition();
    // game over logic
    isGameOver = checkGameOver();
    if (isGameOver) {// if result is true
        return;
    }

    clearScreen();
    drawSnake();
    drawApple();

    checkCollision()
    drawScore();
    setTimeout(drawGame, 1000 / speed);//update screen 7 times a second
}

//Game Over function
function checkGameOver() {
    let gameOver = false; 
    //check whether game has started
    if (yvelocity === 0 && xvelocity === 0) {
        return false;
    }

    // headX < 0, headY < 0 - page top reached; headX === tileCount, headY === tileCount - page bottom reached
    gameOver = headX < 0 || headY < 0 || headX === tileCount || headY === tileCount;

    // snake eat itself
    if (snakeParts.some(function(part) { return part.x === headX && part.y === headY; })) {
        gameOver = true;
    }
    
    //display text Game Over
    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '50px verdana';
        ctx.fillText('Game Over!', canvas.clientWidth / 4.5, canvas.clientHeight / 2); //position our text in center

        ctx.fillStyle = 'white';
        ctx.font = '20px verdana';
        ctx.fillText('Please Space to start a new game!', canvas.clientWidth / 5.5, canvas.clientHeight - 50); //position our text in center
    }

    return gameOver; // this will stop execution of drawgame method
}

// score function
function drawScore() {
    ctx.fillStyle = 'white'// set our text color to white
    ctx.font = '10px verdena'//set font size to 10px of font family verdena
    ctx.fillText('Score: ' + score, canvas.clientWidth - 50, 10);// position our score at right hand corner 
}

// clear our screen
function clearScreen() {
    ctx.fillStyle = 'black'// make screen black
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)// black color start from 0px left, right to canvas width and canvas height
}

function drawSnake() {
    ctx.fillStyle = 'green';
    //loop through our snakeparts array
    snakeParts.forEach(function(part) {
        ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize - 2, tileSize - 2)
    })

    //add parts to snake --through push
    snakeParts.push({x: headX, y: headY}); //put item at the end of list next to the head
    if (snakeParts.length > tailLength) {
        snakeParts.shift(); //remove furthest item from  snake part if we have more than our tail size
    }

    ctx.fillStyle = 'orange';
    ctx.fillRect(headX * tileSize, headY * tileSize, tileSize - 2, tileSize - 2)
 }

 function changeSnakePosition() {
    headX += xvelocity;
    headY += yvelocity;
 }
 
 function drawApple() {
    ctx.fillStyle = 'red';
    ctx.fillRect(appleX * tileSize, appleY * tileSize, tileSize - 2, tileSize - 2);
 }

 // check for collision and change apple position
 function checkCollision() {
    if (appleX === headX && appleY === headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        speed += 0.2;
        score++; //increase our score value
    }
}

function resolveKeyboardEvents(keyboardEvent) {
    if (keyboardEvent.code === 'Space' && isGameOver) {
        resetGame();
        drawGame();
    }
    var keysMap = {
        'ArrowUp': {restrictedKeyCode: 'ArrowDown', xvelocity: 0, yvelocity: -1},
        'ArrowDown': {restrictedKeyCode: 'ArrowUp', xvelocity: 0, yvelocity: 1 },
        'ArrowLeft': {restrictedKeyCode: 'ArrowRight', xvelocity: -1, yvelocity: 0},
        'ArrowRight': {restrictedKeyCode: 'ArrowLeft', xvelocity: 1, yvelocity: 0}
    };

    if (keysMap[keyboardEventCode] && keysMap[keyboardEventCode].restrictedKeyCode === keyboardEvent.code) {
        return;
    }

    if (keysMap[keyboardEvent.code]) {
        keyboardEventCode = keyboardEvent.code;
        yvelocity = keysMap[keyboardEventCode].yvelocity;
        xvelocity = keysMap[keyboardEventCode].xvelocity;
    }
}

//add keyboard event listener to our body
document.body.addEventListener('keydown', resolveKeyboardEvents);

drawGame();
