  const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const bird = {
    x: 100,
    y: 150,
    width: 30,
    height: 30,
    gravity: 0.5,
    lift: -10,
    velocity: 0,
    alive: true
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 250; // Větší mezera mezi trubkami
let pipeFrequency = 150; // Větší vzdálenost mezi trubkami
let pipeSpeed = 2;

let score = 0;
let gameInterval;
let questionPopup = document.getElementById("questionPopup");
let questionText = document.getElementById("questionText");
let answerOptions = document.getElementById("answerOptions");

const questions = [
    { question: "Jaké je hlavní město ČR?", answers: ["Praha", "Brno", "Ostrava", "Plzeň"], correct: "Praha" },
    { question: "Kolik je 5 + 3?", answers: ["7", "8", "9", "6"], correct: "8" },
    { question: "Kdo objevil Ameriku?", answers: ["Kryštof Kolumbus", "Marco Polo", "Vasco da Gama", "Magellan"], correct: "Kryštof Kolumbus" },
];

function createPipe() {
    const height = Math.floor(Math.random() * (canvas.height - pipeGap - 60)) + 30; // Náhodná výška horní trubky
    pipes.push({ x: canvas.width, y: height, question: getRandomQuestion(), passed: false }); // Přidáme 'passed' flag pro označení, že pták prošel trubkami
}

function getRandomQuestion() {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    return randomQuestion;
}

function drawBird() {
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    ctx.fillStyle = "#228B22"; // Zelené trubky
    pipes.forEach(pipe => {
        // Horní trubka
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);
        // Dolní trubka
        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - pipe.y - pipeGap);
    });
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height >= canvas.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
    }

    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        if (pipe.x + pipeWidth <= 0) {
            pipes.shift();
            score++;
        }

        if (
            bird.x + bird.width > pipe.x &&
            bird.x < pipe.x + pipeWidth &&
            (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap) && !pipe.passed
        ) {
            // Hráč narazí do trubky – hra končí
            endGame();
        }

        // Pokud ptáček proletí mezi trubkami, označíme 'passed' jako true a nabídneme otázku
        if (bird.x + bird.width > pipe.x + pipeWidth && !pipe.passed) {
            pipe.passed = true; // Označíme, že ptáček prošel mezi trubkami
            askQuestion(pipe); // Položíme otázku
        }
    });

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - pipeFrequency) {
        createPipe();
    }

    drawBird();
    drawPipes();

    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 20, 30);
}

function gameLoop() {
    if (bird.alive) {
        updateGame();
    } else {
        clearInterval(gameInterval);
    }
}

function endGame() {
    bird.alive = false;
    document.getElementById("gameOver").style.display = "block";
    document.getElementById("finalScore").textContent = score;
}

function askQuestion(pipe) {
    // Zastaví hru, když je otázka
    clearInterval(gameInterval);

    // Zobrazí otázku při průletu mezi trubkami
    questionText.textContent = pipe.question.question;
    answerOptions.innerHTML = "";

    pipe.question.answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.onclick = () => handleAnswer(answer, pipe.question.correct);
        answerOptions.appendChild(button);
    });

    questionPopup.style.display = "block";
}

function handleAnswer(answer, correctAnswer) {
    if (answer === correctAnswer) {
        // Správná odpověď, pokračujeme v hře
        score += 10;
        questionPopup.style.display = "none";
        gameInterval = setInterval(gameLoop, 1000 / 60); // Restartujeme hru
    } else {
        // Špatná odpověď, hra končí
        score -= 5;
        endGame(); // Konec hry
    }
}

document.addEventListener("keydown", () => {
    if (bird.alive) {
        bird.velocity = bird.lift;
    }
});

function startGame() {
    bird.alive = true;
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
}

startGame();