let questions = [];
let currentQuestionIndex = 0;
let userAnswer = '';
let score = 0;
let gameOver = false;

function setup() {
    createCanvas(400, 300);
    // Inicializace otázek
    questions.push({ question: "Kolik je 2 + 2?", answer: "4" });
    questions.push({ question: "Jaký je hlavní město Francie?", answer: "Paříž" });
    questions.push({ question: "Jaké je hlavní město Česka?", answer: "Praha" });
    questions.push({ question: "Kolik nohou má kočka?", answer: "4" });
    questions.push({ question: "Jaký je název největšího oceánu?", answer: "Tichý" });
}

function draw() {
    background(220);
    if (gameOver) {
        textSize(24);
        fill(0);
        text("Konec hry!", 100, 50);
        text("Tvé skóre: " + score, 100, 100);
        text("Stiskni F5 pro restart.", 100, 150);
    } else {
        displayQuestion();
        displayInput();
        checkAnswer();
    }
}

function displayQuestion() {
    textSize(18);
    fill(0);
    text(questions[currentQuestionIndex].question, 10, 50);
}

function displayInput() {
    fill(255);
    rect(10, 70, 380, 30);
    fill(0);
    text(userAnswer, 15, 90);
}

function keyTyped() {
    if (key === 'Enter') {

        if (userAnswer.toLowerCase() === questions[currentQuestionIndex].answer.toLowerCase()) {
            score++;
        }
        userAnswer = '';
        currentQuestionIndex++;


        if (currentQuestionIndex >= questions.length) {
            gameOver = true;
        }
    } else if (keyCode === BACKSPACE) {

        userAnswer = userAnswer.slice(0, -1);
    } else {
        userAnswer += key;
    }
}
