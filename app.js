document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startButton = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId 
    let score = 0
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]

    
    const lTetris = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const tTetris = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1],
    ]

    const oTetris = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const zTetris = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ]

    const iTetris = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

const theTetris = [lTetris, zTetris, tTetris, oTetris, iTetris]

let currentPosition = 4
let currentRotation = 0

console.log(theTetris[0][0])

let random = Math.floor(Math.random()*theTetris.length)
let current = theTetris[random][currentRotation]

//crtanje
function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetris')
        squares[currentPosition + index].style.backgroundColor = colors[random]
    })
}

//brisanje
function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetris')
        squares[currentPosition + index].style.backgroundColor = ''
    })
}

//funkcija za kontrolu pomjeranje 
function control(e) {
    if(e.keyCode === 37) moveLeft()
    else if (e.keyCode === 38) rotate()
    else if (e.keyCode === 39) moveRight()
    else if (e.keyCode === 40) moveDown()
}

document.addEventListener('keyup', control)

//funkcija moveDown
function moveDown(){
    undraw()
    currentPosition +=width
    draw()
    freeze()
}

// freeze funkcija
function freeze(){
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
    current.forEach(index => squares[currentPosition + index].classList.add('taken'))

    //novi tetris
    random = nextRandom
    nextRandom = Math.floor(Math.random()*theTetris.length)
    current = theTetris[random][currentRotation]
    currentPosition = 4
    draw()
    displayShape()
    addScore()
    gameOver()
}
}

//pomjeranje lijevo
function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if(!isAtLeftEdge) currentPosition -=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition +=1
    }
    draw()
}

//pomjeranje desno
function moveRight() {
    undraw()
    const isAtRigthEdge = current.some(index => (currentPosition + index) % width === width-1)
    if(!isAtRigthEdge) currentPosition +=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition -=1
    }
    draw()
}

function isAtLeft() {
    return current.some(index => (currentPosition + index) % width === 0)
}

function isAtRight() {
    return current.some(index => (currentPosition + index +1) % width === 0)
}

function checkRotatePosition(P){
    P = P || currentPosition
    if((P+1) % width < 4) {
        if(isAtRight()){
            currentPosition +=1
            checkRotatePosition(P)
        }
    } else if( P % width > 5) {
        if(isAtLeft()){
            currentPosition -=1
            checkRotatePosition(P)
        }
    }
}

//rotate
function rotate() {
    undraw()
    currentPosition ++
    if(currentRotation === current.length) {
        currentRotation = 0
    }
    current = theTetris[random][currentRotation]
    checkRotatePosition()
    draw()
}


//prikaz sljedeceg oblika

const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
const displayIndex = 0

const nextTetris = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetris
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetris
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetris
    [0, 1, displayWidth, displayWidth+1], //oTetris
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetris
]

function displayShape() {
    displaySquares.forEach(square => {
        square.classList.remove('tetris')
        square.style.backgroundColor = ''
    })
    nextTetris[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tetris')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
}

//button
startButton.addEventListener('click', () => {
    if(timerId) {
        clearInterval(timerId)
        timerId = null
    } else {
        draw()
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random()*theTetris.length)
        displayShape()
    }
})


//bodovi
function addScore() {
    for(let i = 0; i < 199; i +=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

    if(row.every(index => squares[index].classList.contains('taken'))){
        score +=10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
            squares[index].classList.remove('taken')
            squares[index].classList.remove('tetris')
            squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
    }
    }
}


//kraj igrice
function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'end'
        clearInterval(timerId)
    }
}
})
