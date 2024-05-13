const grid = document.querySelector('.grid');
const resultDisplay = document.querySelector('.results');
const width = 15;
const aliensRemoved = []
let currentShooterIndex = 202;
let invadersId;
let isGoingRight = true;
let direction = 1;
let results = 0;

for (let i = 0 ; i < width * width ; i++) {
    const square = document.createElement('div');
    square.id = i;
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'));

console.log(squares);

const alienInvaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]

const endLine = [
    195,196,197,198,199,200,201,202,203,204,205
]

function draw() {
    for (let i = 0; i < alienInvaders.length ; i++) {
        squares[alienInvaders[i]].classList.add('invader')
    }
}
draw()

squares[currentShooterIndex].classList.add('shooter')

function remove() {
    for (let i = 0 ; i < alienInvaders.length ; i++) {
        squares[alienInvaders[i]].classList.remove('invader')
    }
}

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter')
    switch(e.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % width !== 0)
                currentShooterIndex -=1;
            break;
        case 'ArrowRight':
            if (currentShooterIndex % width < width - 1)
                currentShooterIndex +=1;
            break;
    }
    squares[currentShooterIndex].classList.add('shooter')
}

document.addEventListener('keydown', moveShooter)

function moveInvaders() {
    console.log(alienInvaders)
    let leftEdge = false;
    let rightEdge = false;
    remove();

    for( let i of alienInvaders){
        if(i % width === width - 1)
            rightEdge = true;  
        if(i % width === 0)
            leftEdge = true;
    }

    if (rightEdge && isGoingRight ) {
        for(let i = 0 ; i< alienInvaders.length ; i++) {
            alienInvaders[i] += width + 1;
            direction = -1;
            isGoingRight = false;
        } 
    }

    if (leftEdge &&! isGoingRight ) {
        for(let i = 0 ; i< alienInvaders.length ; i++) {
            alienInvaders[i] += width - 1;
            direction = 1;
            isGoingRight = true;
        } 
    }

    for(let i = 0 ; i< alienInvaders.length ; i++) {
        alienInvaders[i] += direction;
    } 

    draw()

    if(squares[currentShooterIndex].classList.contains('invader')) {
        resultDisplay.innerHTML = "GAME OVER";
        clearInterval(invadersId)
    }
    for(let i =0 ; i < endLine.length ; i++){
        if(squares[endLine[i]].classList.contains('invader')) {
            resultDisplay.innerHTML = "GAME OVER";
            clearInterval(invadersId)
        }
    }

    if(aliensRemoved.length === alienInvaders.length) {
        resultDisplay.innerHTML = "YOU WIN";
        clearInterval(invadersId)
    }
    rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1; // Recalculate rightEdge here
}

invadersId = setInterval(moveInvaders, 200)

function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    function moveLaser() {
        squares[currentLaserIndex].classList.remove('laser')
        currentLaserIndex -= width;
        squares[currentLaserIndex].classList.add('laser')

        if(squares[currentLaserIndex].classList.contains('invader')){
            squares[currentLaserIndex].classList.remove('invader')
            squares[currentLaserIndex].classList.remove('laser')
            squares[currentLaserIndex].classList.add('boom')

            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 100 );
            clearInterval(laserId);

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
            alienInvaders.splice(alienRemoved, 1);
            
            results++
            resultDisplay.innerHTML = `score = ${results}`;
            console.log(aliensRemoved);

            clearInterval(laserId);
        }


    }

    
    if (e.key === ' ' )
        laserId = setInterval(moveLaser, 100);
}

document.addEventListener('keydown', shoot)