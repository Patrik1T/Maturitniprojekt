    let snake = [{ x: 50, y: 50 }];
    let score = 0;
    let direction = 'RIGHT';
    let gameInterval;
    let questionIndex = 0;
    let questions = [];
    let snakeSize = 1;
    let correctAnswerIndex = -1;
    let gameOver = false;
    let answeredQuestions = 0;
    let timerInterval;
    let timerValue = 60; // Počáteční čas na odpovědi
    let timerEnabled = false;

    // Funkce pro přidání nové otázky a odpovědí
   function addQuestion() {
    const questionText = document.getElementById('question').value;
    const answer1 = document.getElementById('answer1').value;
    const answer2 = document.getElementById('answer2').value;
    const answer3 = document.getElementById('answer3').value;
    const correctAnswer = parseInt(document.getElementById('correctAnswer').value) - 1;

    if (questionText && answer1 && answer2 && answer3 && correctAnswer >= 0 && correctAnswer <= 2) {
        // Přidání otázky a odpovědí do pole
        questions.push({
            question: questionText,
            answers: [answer1, answer2, answer3],
            correct: correctAnswer
        });

        showModal('Otázka byla přidána!'); // Nahrazení alertu
        document.getElementById('question').value = '';
        document.getElementById('answer1').value = '';
        document.getElementById('answer2').value = '';
        document.getElementById('answer3').value = '';
        document.getElementById('correctAnswer').value = '';

        // Aktualizace seznamu otázek
        updateQuestionList();
    } else {
        showModal('Vyplňte všechna pole správně.'); // Nahrazení alertu
    }
}


    // Funkce pro zobrazení modální zprávy
function showModal(message) {
    const modal = document.getElementById('messageModal');
    const modalMessage = document.getElementById('modalMessage');
    const modalButton = document.getElementById('modalButton');

    modalMessage.textContent = message;
    modal.style.display = 'block';
}

// Funkce pro zavření modálního okna
function closeModal() {
    const modal = document.getElementById('messageModal');
    modal.style.display = 'none';
}

// Zavřít modal okno při kliknutí na "X"
document.getElementById('closeModalButton').addEventListener('click', closeModal);

// Zavřít modal okno při kliknutí mimo něj
window.addEventListener('click', (event) => {
    const modal = document.getElementById('messageModal');
    if (event.target === modal) {
        closeModal();
    }
});


    // Aktualizace seznamu otázek
    function updateQuestionList() {
        const questionList = document.getElementById('questionList');
        questionList.innerHTML = '';

        questions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.textContent = q.question;
            questionDiv.addEventListener('click', () => {
                questionIndex = index;
                showQuestion();
            });

            // Vytvoření seznamu odpovědí k otázce
            const answersDiv = document.createElement('div');
            q.answers.forEach((answer, idx) => {
                const answerDiv = document.createElement('div');
                answerDiv.textContent = answer;
                answersDiv.appendChild(answerDiv);
            });

            questionDiv.appendChild(answersDiv);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Smazat';
            deleteButton.addEventListener('click', (event) => {
                questions.splice(index, 1);
                updateQuestionList();
                event.stopPropagation(); // Zabráníme propagačnímu kliknutí
            });
            questionDiv.appendChild(deleteButton);
            questionList.appendChild(questionDiv);
        });

        // Zobrazíme tlačítko pro spuštění hry, pokud máme alespoň jednu otázku
        const startButton = document.getElementById('startGameButton');
        if (questions.length > 0) {
            startButton.style.display = 'block';
        } else {
            startButton.style.display = 'none';
        }
    }

    // Inicializace hry
    function startGameFromList() {
        if (questions.length > 0) {
            score = 0;
            snake = [{ x: 50, y: 50 }];
            snakeSize = 1;
            direction = 'RIGHT';
            gameOver = false;
            answeredQuestions = 0; // Reset počtu odpovědí
            showQuestion();
            if (timerEnabled) startTimer();
            gameInterval = setInterval(updateGame, 200);
        }
    }

    // Funkce pro zobrazení otázky
    function showQuestion() {
        const question = questions[questionIndex];
        document.getElementById('questionText').textContent = question.question;
        const answersDiv = document.getElementById('answers');
        answersDiv.innerHTML = '';
        question.answers.forEach((answer, idx) => {
            const answerDiv = document.createElement('div');
            answerDiv.textContent = answer;
            answerDiv.style.padding = '10px';
            answerDiv.style.margin = '5px';
            answerDiv.style.cursor = 'pointer';
            answerDiv.setAttribute('data-index', idx);
            answerDiv.addEventListener('click', checkAnswer); // Odpověď se kontroluje při kliknutí
            answersDiv.appendChild(answerDiv);
        });
        correctAnswerIndex = question.correct;
    }

   // Funkce pro kontrolu odpovědi
function checkAnswer(event) {
    const selectedAnswer = parseInt(event.target.getAttribute('data-index'));
    if (selectedAnswer === correctAnswerIndex) {
        score += 1;
        // Zobrazení výsledku na obrazovce
        showModal(`Správně! Získal jsi bod. Tvoje skóre: ${score}`);
    } else {
        // Špatná odpověď
        showModal(`Špatně! Zkus to znovu. Tvoje skóre: ${score}`);
    }
    snakeSize++; // Zvětšení hada po každé odpovědi
    answeredQuestions++;
    nextQuestion();
}



    // Přejít na další otázku
    function nextQuestion() {
        if (answeredQuestions >= questions.length) {
            clearInterval(gameInterval);
            if (timerEnabled) clearInterval(timerInterval);
            displayResults();
        } else {
            questionIndex = (questionIndex + 1) % questions.length; // Posun na další otázku
            showQuestion(); // Zobrazí novou otázku
        }
    }

   // Funkce pro zobrazení výsledků
function displayResults() {
    // Zobrazení skóre
    const gameResults = document.getElementById('gameResults');
    gameResults.innerHTML = `<h3>Skončil jsi! Tvoje skóre: ${score} bodů.</h3>`;

    // Získání známky podle skóre
    const grade = getGrade(score);
    gameResults.innerHTML += `<p>Tvoje známka: ${grade}</p>`;
}


    // Funkce pro získání známky podle skóre
    function getGrade(score) {
        if (score === questions.length) return '1';
        if (score >= questions.length * 0.8) return '2';
        if (score >= questions.length * 0.6) return '3';
        if (score >= questions.length * 0.4) return '4';
        return '5';
    }

    // Funkce pro spuštění časomíry
   function startTimer() {
    timerValue = 60; // Reset času na 60 sekund
    timerInterval = setInterval(() => {
        if (timerValue <= 0) {
            clearInterval(timerInterval);
            showModal("Čas vypršel! Hra skončila."); // Nahrazení alertu
            displayResults();
        } else {
            timerValue--;
            document.getElementById('timer').textContent = `Čas: ${timerValue} sek.`;
        }
    }, 1000);
}


    // Přepnutí viditelnosti časomíry
    function toggleTimer() {
        timerEnabled = !timerEnabled;
    }

    // Funkce pro pohyb hada
    function updateGame() {
        if (gameOver) return;

        const head = { ...snake[0] };
        if (direction === 'RIGHT') head.x += 10;
        if (direction === 'LEFT') head.x -= 10;
        if (direction === 'UP') head.y -= 10;
        if (direction === 'DOWN') head.y += 10;

        // Kolize se zdi nebo s vlastním tělem
        if (head.x < 0 || head.x >= 200 || head.y < 0 || head.y >= 150 || collisionWithSnake(head)) {
            gameOver = true;
            alert("Prohrál jsi! Dotkl ses zdi nebo těla.");
            clearInterval(gameInterval);
        }

        snake.unshift(head);
        if (snake.length > snakeSize) {
            snake.pop();
        }

        renderGame();
    }

    // Kolize s vlastním tělem
    function collisionWithSnake(head) {
        return snake.some(segment => segment.x === head.x && segment.y === head.y);
    }

    // Zobrazení hada
    function renderGame() {
        const gameContainer = document.getElementById('gameContainer');
        gameContainer.innerHTML = '';
        snake.forEach(segment => {
            const snakeSegment = document.createElement('div');
            snakeSegment.style.left = segment.x + 'px';
            snakeSegment.style.top = segment.y + 'px';
            snakeSegment.classList.add('snake');
            gameContainer.appendChild(snakeSegment);
        });
    }

    // Řízení pohybu hada
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
        if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
        if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
        if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    });

  function exportToHTML() {
    const testName = document.getElementById('testName').value;
    const testImage = document.getElementById('testImage').files[0];
    const testDescription = document.getElementById('testDescription').value;
    const enableTimer = document.getElementById('enableTimer').checked;
    const timeLimit = document.getElementById('timeLimit').value;

    let htmlContent = `
        <html lang="cs">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${testName || 'Hadí Test'}</title>
        </head>
        <body>
            <h1>${testName || 'Hadí Test'}</h1>
            <p>${testDescription || 'Popis testu není zadán.'}</p>
            ${testImage ? `<img src="${URL.createObjectURL(testImage)}" alt="Test Image" />` : ''}
            <h2>Seznam otázek:</h2>
            <ul>
    `;

    questions.forEach((question) => {
        htmlContent += `<li><strong>Otázka:</strong> ${question.question}<br><strong>Odpovědi:</strong><ul>`;
        question.answers.forEach((answer) => {
            htmlContent += `<li>${answer}</li>`;
        });
        htmlContent += `</ul><strong>Správná odpověď:</strong> ${question.answers[question.correct]}<br>
                        <strong>Body:</strong> ${question.points}</li>`;
    });

    htmlContent += `
            </ul>
            <h3>Časovač:</h3>
            <p>${enableTimer ? `Používá se časovač: ${timeLimit} sekund` : 'Časovač není zapnutý'}</p>
            <h3>Nastavení známek:</h3>
            <ul>
                <li>1: ${document.getElementById('grade1').value}</li>
                <li>2: ${document.getElementById('grade2').value}</li>
                <li>3: ${document.getElementById('grade3').value}</li>
                <li>4: ${document.getElementById('grade4').value}</li>
                <li>5: ${document.getElementById('grade5').value}</li>
            </ul>
        </body>
        </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${testName || 'Hadí Test'}.html`;
    link.click();
}

function exportToJSON() {
    const data = {
        testName: document.getElementById('testName').value,
        testDescription: document.getElementById('testDescription').value,
        testImage: document.getElementById('testImage').files[0] ? document.getElementById('testImage').files[0].name : null,
        enableTimer: document.getElementById('enableTimer').checked,
        timeLimit: document.getElementById('timeLimit').value,
        grading: {
            grade1: document.getElementById('grade1').value,
            grade2: document.getElementById('grade2').value,
            grade3: document.getElementById('grade3').value,
            grade4: document.getElementById('grade4').value,
            grade5: document.getElementById('grade5').value
        },
        questions: questions.map(q => ({
            question: q.question,
            answers: q.answers,
            correct: q.correct,
            points: q.points
        }))
    };

    const jsonString = JSON.stringify(data, null, 4);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${data.testName || 'Hadí Test'}.json`;
    link.click();
}

function exportToMoodleXML() {
    const testName = document.getElementById('testName').value;
    const enableTimer = document.getElementById('enableTimer').checked;
    const timeLimit = document.getElementById('timeLimit').value;

    let xmlContent = `<?xml version="1.0" encoding="UTF-8" ?>
    <quiz>
        <name>
            <text>${testName || 'Hadí Test'}</text>
        </name>
        <question type="multichoice">
    `;

    questions.forEach((question) => {
        xmlContent += `
            <name>
                <text>${question.question}</text>
            </name>
            <questiontext format="html">
                <text>${question.question}</text>
            </questiontext>
            <generalfeedback format="html">
                <text>Správná odpověď je: ${question.answers[question.correct]}</text>
            </generalfeedback>
            <defaultgrade>${question.points}</defaultgrade>
            <answer fraction="100">
                <text>${question.answers[question.correct]}</text>
                <feedback>
                    <text>Správně!</text>
                </feedback>
            </answer>
        `;

        question.answers.forEach((answer, idx) => {
            if (idx !== question.correct) {
                xmlContent += `
                    <answer fraction="0">
                        <text>${answer}</text>
                        <feedback>
                            <text>Špatně!</text>
                        </feedback>
                    </answer>
                `;
            }
        });

        xmlContent += `</question>`;
    });

    xmlContent += `
        </quiz>
    `;

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${testName || 'Hadí Test'}.xml`;
    link.click();
}
