const tileContainer = document.getElementsByClassName('tile-container');
const gameContainer = document.getElementById('game-container');
const ScoreInner = document.getElementById('scr-number');
const BestScore = document.getElementById('best-number');
const tileSize = 106.25, gridSpacing = 15;
let fontSize = 55;
const arr = new Array(4);
const tempArr = new Array(4);
let flag;//check arr change or not
let SOS = 0;//sum of score
// New Game
const tileReset = (arr, tempArr, EndGame) => {
    while (tileContainer[0].firstChild) {
        tileContainer[0].removeChild(tileContainer[0].firstChild);
    }
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(4).fill(0);
        tempArr[i] = new Array(4).fill(0);
    }
    for (let i = 0; i < 2; i++) {
        createNewTile(arr, tempArr);
    }
    if (EndGame) {
        const game_over = document.getElementsByClassName('game-over');
        game_over[0].remove();
    }
    ScoreReset();
    return arr;
};
function ScoreReset() {
    if (BestScore.innerHTML < SOS) {
        BestScore.innerHTML = `${SOS}`;
    }
    SOS = 0;
    score(0);
}

// prevent browser moving and Check
function preventMoving() {
    window.addEventListener("keydown", (e) => {
        (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1)
            ? e.preventDefault() : false
    })
}
function checkFullFill(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let k = 0; k < arr[i].length; k++) {
            if (arr[i][k] === 0) {
                return;
            }
            if (k + 1 < arr[i].length && arr[i][k] === arr[i][k + 1]) {
                return;
            }
            if (i + 1 < arr.length && arr[i][k] === arr[i + 1][k]) {
                return;
            }
        }
    }
    setTimeout(GameOver(), 1000);
    return;
}

function GameOver() {
    const div = document.createElement('div');
    const p = document.createElement('p');
    const button = document.createElement('button');
    p.innerHTML = "Game over!";
    button.innerHTML = "Try again";
    button.addEventListener('click', () => (tileReset(arr, tempArr, true)));
    div.classList.add("game-over");
    button.classList.add("btn");
    div.append(p);
    div.append(button);
    gameContainer.append(div);
}

// keypress event
function logKey(e) {
    preventMoving();

    switch (e.code) {
        case "ArrowLeft":
            flag = moveleft(arr);
            break;
        case "ArrowRight":
            flag = moveRight(arr);
            break;
        case "ArrowUp":
            flag = moveUp(arr);
            break;
        case "ArrowDown":
            flag = moveDown(arr);
            break;
        default:
            flag = true;
            console.log("Sor");
    }
    if (flag) {
        return;
    }
    else {
        createNewTile(arr, tempArr);
    }

}

// remove from document
const removeTile = (x, y) => {
    const tileposition = document.getElementsByClassName(`tile-position-${x + 1}-${y + 1}`);
    tileposition[0].remove();
}

//add to document
const addClassName = (num, x, y) => {
    const div = document.createElement('div');
    const divInner = document.createElement('div');
    div.classList.add("tile", `tile-${num}`, `tile-position-${x + 1}-${y + 1}`);
    divInner.classList.add("tile-inner");
    divInner.innerHTML = `${num}`;
    div.append(divInner);
    tileContainer[0].append(div);
}


// dynamics css 

const styleTile = (num, x, y) => {
    const tilePosition = document.getElementsByClassName(`tile-position-${x + 1}-${y + 1}`)[0].getElementsByClassName('tile-inner');
    num >= 128 ? fontSize = 45 : fontSize = 55;
    tilePosition[0].style.cssText = `
    position:absolute;
    top:${(tileSize + gridSpacing) * x}px;
    left:${(tileSize + gridSpacing) * y}px;
    font-size:${fontSize}px;
    `;
}

// create tile
const positionValue = () => { return Math.floor(Math.random() * 10) % 4; }

const value = () => { return Math.random() < 0.9 ? 2 : 4; }

const createNewTile = (arr, tempArr) => {
    flag = true;
    while (flag) {
        let k = positionValue(), j = positionValue();
        if (arr[j][k] === 0) {
            arr[j][k] = value();
            tempArr[j][k] = arr[j][k];
            addClassName(arr[j][k], j, k);
            styleTile(arr[j][k], j, k);
            flag = false;
        }
    }
    checkFullFill(arr);
    return arr;
}


// move and merge
const moveleft = (arr) => {
    let flag = true, sum = 0;
    for (let i = 0; i < arr.length; i++) {
        let temp = 0, newHome = 0;
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] && temp == 0) {
                temp = arr[i][j];
                arr[i][j] = 0;
                removeTile(i, j);
            }
            if (temp == arr[i][j] && temp) {
                arr[i][newHome] = temp + arr[i][j];
                sum += arr[i][newHome];
                removeTile(i, j);
                addClassName(arr[i][newHome], i, newHome);
                styleTile(arr[i][newHome], i, newHome);
                temp = 0;
                arr[i][j] = 0;
                newHome++;
            }
            if (temp != arr[i][j] && arr[i][j]) {
                arr[i][newHome] = temp;
                temp = arr[i][j];
                removeTile(i, j);
                addClassName(arr[i][newHome], i, newHome);
                styleTile(arr[i][newHome], i, newHome);
                arr[i][j] = 0;
                newHome++;
            }
        }
        if (temp) {
            arr[i][newHome] = temp;
            addClassName(arr[i][newHome], i, newHome);
            styleTile(arr[i][newHome], i, newHome);

        }
        for (let j = 0; j < arr[i].length; j++) {
            if (tempArr[i][j] != arr[i][j]) {
                flag = false;
                tempArr[i][j] = arr[i][j];
            }
        }
    }
    if (sum) {
        score(sum);
    }
    return flag;
}
const moveRight = (arr) => {
    let flag = true, sum = 0;
    for (let i = 0; i < arr.length; i++) {
        let temp = 0, newHome = arr[i].length - 1;
        for (let j = arr[i].length - 1; j >= 0; j--) {
            if (arr[i][j] && temp == 0) {
                temp = arr[i][j];
                arr[i][j] = 0;

                removeTile(i, j);
            }
            if (temp == arr[i][j] && temp) {
                arr[i][newHome] = temp + arr[i][j];
                sum += arr[i][newHome];
                removeTile(i, j);
                addClassName(arr[i][newHome], i, newHome);
                styleTile(arr[i][newHome], i, newHome);
                temp = 0;
                arr[i][j] = 0;
                newHome--;
            }
            if (temp != arr[i][j] && arr[i][j]) {
                arr[i][newHome] = temp;
                temp = arr[i][j];
                removeTile(i, j);
                addClassName(arr[i][newHome], i, newHome);
                styleTile(arr[i][newHome], i, newHome);
                arr[i][j] = 0;
                newHome--;
            }
        }
        if (temp) {
            arr[i][newHome] = temp;
            addClassName(arr[i][newHome], i, newHome);
            styleTile(arr[i][newHome], i, newHome);
        }
        for (let j = 0; j < arr[i].length; j++) {
            if (tempArr[i][j] != arr[i][j]) {
                flag = false;
                tempArr[i][j] = arr[i][j];
            }
        }
    }
    if (sum) {
        score(sum);
    }
    return flag;
}
const moveUp = (arr) => {
    let flag = true, sum = 0;
    for (let j = 0; j < arr.length; j++) {
        let temp = 0, newHome = 0;
        for (let i = 0; i < arr[j].length; i++) {
            if (arr[i][j] && temp == 0) {
                temp = arr[i][j];
                arr[i][j] = 0;
                removeTile(i, j);
            }
            if (temp == arr[i][j] && temp) {
                arr[newHome][j] = temp + arr[i][j];
                sum += arr[newHome][j];
                removeTile(i, j);
                addClassName(arr[newHome][j], newHome, j);
                styleTile(arr[newHome][j], newHome, j);
                temp = 0;
                arr[i][j] = 0;
                newHome++;
            }
            if (temp != arr[i][j] && arr[i][j]) {
                arr[newHome][j] = temp;
                temp = arr[i][j];
                removeTile(i, j);
                addClassName(arr[newHome][j], newHome, j);
                styleTile(arr[newHome][j], newHome, j);
                arr[i][j] = 0;
                newHome++;
            }
        }
        if (temp) {
            arr[newHome][j] = temp;
            addClassName(arr[newHome][j], newHome, j);
            styleTile(arr[newHome][j], newHome, j);
        }
        for (let i = 0; i < arr[j].length; i++) {
            if (tempArr[i][j] != arr[i][j]) {
                flag = false;
                tempArr[i][j] = arr[i][j];
            }
        }

    }
    if (sum) {
        score(sum);
    }
    return flag;
}
const moveDown = (arr) => {
    let flag = true, sum = 0;

    for (let j = 0; j < arr.length; j++) {
        let temp = 0, newHome = arr[j].length - 1;
        for (let i = arr[j].length - 1; i >= 0; i--) {
            if (arr[i][j] && temp == 0) {
                temp = arr[i][j];
                arr[i][j] = 0;
                removeTile(i, j);
            }
            if (temp == arr[i][j] && temp) {
                arr[newHome][j] = temp + arr[i][j];
                sum += arr[newHome][j];
                removeTile(i, j);
                addClassName(arr[newHome][j], newHome, j);
                styleTile(arr[newHome][j], newHome, j);
                temp = 0;
                arr[i][j] = 0;
                newHome--;
            }
            if (temp != arr[i][j] && arr[i][j]) {
                arr[newHome][j] = temp;
                temp = arr[i][j];
                removeTile(i, j);
                addClassName(arr[newHome][j], newHome, j);
                styleTile(arr[newHome][j], newHome, j);
                arr[i][j] = 0;
                newHome--;
            }
        }
        if (temp) {
            arr[newHome][j] = temp;
            addClassName(arr[newHome][j], newHome, j);
            styleTile(arr[newHome][j], newHome, j);
        }
        for (let i = 0; i < arr[j].length; i++) {
            if (tempArr[i][j] != arr[i][j]) {
                flag = false;
                tempArr[i][j] = arr[i][j];
            }
        }

    }
    if (sum) {
        score(sum);
    }
    return flag;
}
function score(sum) {
    SOS += sum;
    ScoreInner.innerHTML = `${SOS}`;
}

const btn = document.querySelector('button');
document.addEventListener('keydown', logKey);
btn.addEventListener('click', () => (tileReset(arr, tempArr, false)));
tileReset(arr, tempArr, false);