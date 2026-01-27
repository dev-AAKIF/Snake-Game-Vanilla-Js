const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start');
const modal = document.querySelector(".modal");

const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");

const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time")


const blockHeight = 50;
const blockWidth = 50;

let highScore = localStorage.getItem("highscore") || 0
let score = 0 
let time = `00:00`

highScoreElement.innerText = highScore

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null
let timeIntervalId = null
// let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)}

let snake = [ {
    x: 1, y: 3
}, ]

function generateFood() {
    let newFood;
    do {
        newFood = { 
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        }
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood;
}



let food = generateFood()

const blocks = []


let direction = "down"
let lastDirection = "down"

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++ ) {
        const block = document.createElement('div');
        block.classList.add('block')
        board.appendChild(block);
        // block.innerText = `${row} - ${col}`
        blocks[`${row}-${col}` ] = block
    }
}

function render() {
    let head = null

    blocks[`${food.x}-${food.y}` ].classList.add("food")
    if(direction === "left") {
        head = {x: snake[0].x, y: snake[0].y - 1  }
    } else if(direction === "right") {
        head = {x: snake[0].x, y: snake[0].y + 1  }  
    } else if(direction === "down") {
        head = {x: snake[0].x + 1, y: snake[0].y }  
    } else if(direction === "up") {
        head = {x: snake[0].x - 1, y: snake[0].y }  
    } 

    lastDirection = direction

    // Wall Collision Code
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalId)
        clearInterval(timeIntervalId)

        modal.style.display = "flex";
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex"
        return
    }

    // Check self collision
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            clearInterval(intervalId)
            clearInterval(timeIntervalId)

            modal.style.display = "flex";
            startGameModal.style.display = "none";
            gameOverModal.style.display = "flex"
            return
        }
    }

    // food consume logic
    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x}-${food.y}` ].classList.remove("food")
        // food = { 
        //     x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)
        // }
        food = generateFood()
        blocks[`${food.x}-${food.y}` ].classList.add("food")

        snake.unshift(head)

        score += 10
        scoreElement.innerHTML = score

        if( score > highScore) {
            highScore = score
            localStorage.setItem("highscore", highScore.toString())
            highScoreElement.innerHTML = highScore
        }
    } else {snake.forEach(segment => { 
        blocks[ `${segment.x}-${segment.y}`].classList.remove("fill")
    });

    snake.unshift(head)
    snake.pop()
}
snake.forEach(segment => { 
        blocks[ `${segment.x}-${segment.y}`].classList.add("fill")

    });
}

//     for (let segment of snake) {
//     if (segment.x === head.x && segment.y === head.y) {
//         clearInterval(intervalId)

//         modal.style.display = "flex";
//         startGameModal.style.display = "none";
//         gameOverModal.style.display = "flex"
//         return
//     }
// }


    

startButton.addEventListener("click", function() {
    modal.style.display = "none"
    intervalId = setInterval(() => {
        render()
    }, 250);
    timeIntervalId = setInterval(()=> {
        let [min,sec] = time.split(":").map(Number)

        if( sec == 59) {
            min += 1
            sec = 0 
        } else {
            sec += 1
        }
        
        time = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
        // time = `${min}:${sec}`
        timeElement.innerText = time
    },1000)
})

restartButton.addEventListener("click", restartGame);

function restartGame() {
    clearInterval(intervalId);
    clearInterval(timeIntervalId);
   
    blocks[`${food.x}-${food.y}` ].classList.remove("food")
    snake.forEach(segment => { 
        blocks[ `${segment.x}-${segment.y}`].classList.remove("fill")
    });

    score = 0
    time = `00:00`

    scoreElement.innerText = score
    timeElement.innerText = time
    highScoreElement.innerText = highScore

    modal.style.display = "none"
    direction = "down"
    lastDirection = "down" 

    snake = [ { x: 1, y: 3} ]
    // food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)}
    food = generateFood()
    intervalId = setInterval(() => {
        render()
    }, 250); 

     timeIntervalId = setInterval(()=> {
        let [min,sec] = time.split(":").map(Number)

        if( sec == 59) {
            min += 1
            sec = 0 
        } else {
            sec += 1
        }
        
        time = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
        timeElement.innerText = time
    },1000)

}

addEventListener("keydown", (event)=> {
    if (event.key === "ArrowUp" && lastDirection !== "down") {
        direction = "up"
    } else if (event.key === "ArrowRight" && lastDirection !== "left") {
        direction = "right"
    } else if (event.key === "ArrowDown" && lastDirection !== "up") {
        direction = "down"
    } else if (event.key === "ArrowLeft" && lastDirection !== "right") {
        direction = "left"
    } 
});