let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Funkce pro přidání otázky a odpovědí
function addQuestion() {
    const questionText = prompt("Zadejte text otázky:");
    if (!questionText) {

        return;
    }
    const answers = [];
    for (let i = 1; i <= 4; i++) {
        const answer = prompt(`Zadejte odpověď ${i}:`);
        if (!answer) {

            return;
        }
        answers.push(answer);
    }
    questions.push({
        text: questionText,
        answers: answers,
        correctAnswer: answers[0] // první odpověď je správná
    });

}

// Funkce pro spuštění hry
function startGame() {
    if (questions.length === 0) {

        return;
    }

    score = 0;
    currentQuestionIndex = 0;
    document.getElementById('gameOverMessage').style.display = 'none';
    document.getElementById('scoreDisplay').innerText = `Skóre: ${score}`;
    startNewQuestion();
}

// Funkce pro zahájení nové otázky
function startNewQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endGame();
        return;
    }
    const question = questions[currentQuestionIndex];
    document.getElementById('questionText').innerText = question.text;

    // Vyčistíme předchozí odpovědi
    document.querySelectorAll('.falling-answer').forEach(el => el.remove());

    question.answers.forEach(answer => {
        const answerElement = document.createElement('div');
        answerElement.classList.add('falling-answer');
        answerElement.textContent = answer;

        // Náhodná pozice a rychlost
        answerElement.style.left = `${Math.random() * 90}%`;
        answerElement.style.animationDuration = `${Math.random() * 2 + 3}s`;

        // Detekce kliknutí
        answerElement.addEventListener('click', () => {
            if (answer === question.correctAnswer) {
                score += 10;
                document.getElementById('scoreDisplay').innerText = `Skóre: ${score}`;
                answerElement.remove();
            }
        });

        document.querySelector('.game-container').appendChild(answerElement);
    });

    currentQuestionIndex++;
}

// Funkce pro ukončení hry
function endGame() {
    document.getElementById('gameOverMessage').style.display = 'block';
    document.getElementById('finalScore').innerText = score;
    document.querySelectorAll('.falling-answer').forEach(el => el.remove());
}
