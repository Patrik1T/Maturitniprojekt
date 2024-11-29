let board;
let currentPlayer;
let gameOver;

function setup() {
    createCanvas(400, 400);
    resetGame();
}

function draw() {
    background(220);
    drawBoard();
    checkWinner();
}

function drawBoard() {
    let w = width / 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            stroke(0);
            noFill();
            rect(i * w, j * w, w, w);
            if (board[i][j] === 'X') {
                fill('red');
                textSize(64);
                text('X', i * w + w / 4, j * w + 3 * w / 4);
            } else if (board[i][j] === 'O') {
                fill('blue');
                textSize(64);
                text('O', i * w + w / 4, j * w + 3 * w / 4);
            }
        }
    }
}

function mousePressed() {
    if (!gameOver) {
        let w = width / 3;
        let i = floor(mouseX / w);
        let j = floor(mouseY / w);
        if (board[i][j] === '') {
            board[i][j] = currentPlayer;
            currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
        }
    }
}

function checkWinner() {

    for (let i = 0; i < 3; i++) {
        if (board[i][0] !== '' && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
            declareWinner(board[i][0]);
        }
    }

    for (let i = 0; i < 3; i++) {
        if (board[0][i] !== '' && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
            declareWinner(board[0][i]);
        }
    }

    if (board[0][0] !== '' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        declareWinner(board[0][0]);
    }
    if (board[0][2] !== '' && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        declareWinner(board[0][2]);
    }
}

function declareWinner(player) {
    gameOver = true;
    textSize(32);
    fill(0);
    text(`Hráč ${player} vyhrál!`, 50, height / 2);
}

function resetGame() {
    board = [['', '', ''], ['', '', ''], ['', '', '']];
    currentPlayer = 'X';
    gameOver = false;
}