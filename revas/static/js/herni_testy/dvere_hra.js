    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timeLeft;
    let timerId;
    let playerPosition = { x: 185, y: 300 };
    let isTimerEnabled = false;

    const player = document.getElementById('player');
    const questionDisplay = document.getElementById('question');
    const gameArea = document.getElementById('gameArea');
    const timerDisplay = document.getElementById('timer');
    const timerInput = document.getElementById('timerInput');
    const useTimerCheckbox = document.getElementById('useTimer');

    function addAnswer() {
        const answersContainer = document.getElementById('answersContainer');
        const answerCount = answersContainer.children.length;

        if (answerCount >= 5) {

            return;
        }

        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer';
        answerDiv.innerHTML = `
            <input type="text" placeholder="Odpověď" class="newAnswer">
            <input type="radio" name="correctAnswer" /> Správná odpověď
            <button class="delete-answer" onclick="deleteAnswer(this)">Smazat</button>
        `;
        answersContainer.appendChild(answerDiv);
    }

    function deleteAnswer(button) {
        button.parentElement.remove();
    }

    function addQuestion() {
        const questionText = document.getElementById('newQuestion').value.trim();
        const points = parseInt(document.getElementById('questionPoints').value, 10);
        const answers = [];
        let correctAnswer = '';

        const answerElements = document.querySelectorAll('.answer');
        answerElements.forEach(element => {
            const answerText = element.querySelector('.newAnswer').value.trim();
            const isCorrect = element.querySelector('input[type="radio"]').checked;
            if (answerText) {
                answers.push(answerText);
                if (isCorrect) correctAnswer = answerText;
            }
        });

        if (!questionText || answers.length < 2 || !correctAnswer || points <= 0) {

            return;
        }

        questions.push({ question: questionText, answers, correctAnswer, points });
        updateQuestionList();

        document.getElementById('newQuestion').value = '';
        document.getElementById('questionPoints').value = 10;
        document.getElementById('answersContainer').innerHTML = '';
    }

    function updateQuestionList() {
        const questionList = document.getElementById('questionList');
        questionList.innerHTML = '';

        questions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.innerHTML = `
                <strong>${q.question}</strong>
                <ul>${q.answers.map(answer => `<li>${answer}${answer === q.correctAnswer ? ' (správná)' : ''}</li>`).join('')}</ul>
                <p>Bodové ohodnocení: ${q.points}</p>
                <button class="delete-btn" onclick="deleteQuestion(${index})">Smazat otázku</button>
            `;
            questionList.appendChild(questionDiv);
        });
    }

    function deleteQuestion(index) {
        questions.splice(index, 1);
        updateQuestionList();
    }

    function startGame() {
        if (questions.length === 0) {

            return;
        }

        currentQuestionIndex = 0;
        score = 0;
        timeLeft = parseInt(timerInput.value, 10);

        isTimerEnabled = useTimerCheckbox.checked;

        resetPlayerPosition();
        displayQuestion();
        if (isTimerEnabled) startTimer();

        document.addEventListener('keydown', handleMovement);
    }

    function startTimer() {
        timerDisplay.textContent = `Čas: ${timeLeft}s`;
        timerId = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Čas: ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timerId);
                endGame();
            }
        }, 1000);
    }

    function displayQuestion() {
        const { question, answers } = questions[currentQuestionIndex];
        questionDisplay.textContent = question;

        gameArea.querySelectorAll('.door').forEach(door => door.remove());
        const doorWidth = 100;
        const gap = (gameArea.offsetWidth - answers.length * doorWidth) / (answers.length + 1);

        answers.forEach((answer, index) => {
            const door = document.createElement('div');
            door.className = 'door';
            door.textContent = answer;
            door.style.left = `${gap + index * (doorWidth + gap)}px`;
            door.style.top = '50px';
            door.dataset.answer = answer;
            gameArea.appendChild(door);
        });
    }

    function handleMovement(event) {
        const speed = 20;
        const bounds = gameArea.getBoundingClientRect();
        const playerBounds = player.getBoundingClientRect();

        if (event.key === 'ArrowUp' && playerBounds.top > bounds.top) playerPosition.y -= speed;
        if (event.key === 'ArrowDown' && playerBounds.bottom < bounds.bottom) playerPosition.y += speed;
        if (event.key === 'ArrowLeft' && playerBounds.left > bounds.left) playerPosition.x -= speed;
        if (event.key === 'ArrowRight' && playerBounds.right < bounds.right) playerPosition.x += speed;

        player.style.left = `${playerPosition.x}px`;
        player.style.top = `${playerPosition.y}px`;

        checkDoorCollision();
    }

    function checkDoorCollision() {
        const doors = gameArea.querySelectorAll('.door');
        doors.forEach(door => {
            const doorRect = door.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();

            if (
                playerRect.left < doorRect.right &&
                playerRect.right > doorRect.left &&
                playerRect.top < doorRect.bottom &&
                playerRect.bottom > doorRect.top
            ) {
                evaluateAnswer(door.dataset.answer);
            }
        });
    }

    function evaluateAnswer(selectedAnswer) {
        const { correctAnswer, points } = questions[currentQuestionIndex];
        if (selectedAnswer === correctAnswer) {
            score += points;

        } else {

        }

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            resetPlayerPosition();
            displayQuestion();
        } else {
            endGame();
        }
    }

    function resetPlayerPosition() {
        playerPosition.x = 185;
        playerPosition.y = 300;
        player.style.left = `${playerPosition.x}px`;
        player.style.top = `${playerPosition.y}px`;
    }

  function endGame() {
    clearInterval(timerId);
    document.removeEventListener('keydown', handleMovement);
    questionDisplay.textContent = '';
    timerDisplay.textContent = '';
    displayResults();
}

function displayResults() {
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'resultsContainer';
    resultsContainer.style.marginTop = '20px';
    resultsContainer.style.padding = '20px';
    resultsContainer.style.border = '1px solid #ccc';
    resultsContainer.style.borderRadius = '10px';
    resultsContainer.style.backgroundColor = '#fff';

    // Výpočet známky
    const grade = calculateGrade(score);

    // Hlavní nadpis
    const title = document.createElement('h3');
    title.textContent = 'Výsledky hry';
    resultsContainer.appendChild(title);

    // Zobrazení bodů a známky
    const scoreParagraph = document.createElement('p');
    scoreParagraph.innerHTML = `<strong>Body:</strong> ${score}`;
    resultsContainer.appendChild(scoreParagraph);

    const gradeParagraph = document.createElement('p');
    gradeParagraph.innerHTML = `<strong>Známka:</strong> ${grade}`;
    resultsContainer.appendChild(gradeParagraph);

    // Seznam chyb
    const wrongAnswers = [];
    questions.forEach((q, index) => {
        const selectedAnswer = q.selectedAnswer;
        if (selectedAnswer && selectedAnswer !== q.correctAnswer) {
            wrongAnswers.push({ question: q.question, selectedAnswer, correctAnswer: q.correctAnswer });
        }
    });

    if (wrongAnswers.length > 0) {
        const wrongAnswersTitle = document.createElement('h4');
        wrongAnswersTitle.textContent = 'Špatně zodpovězené otázky:';
        resultsContainer.appendChild(wrongAnswersTitle);

        const wrongAnswersList = document.createElement('ul');
        wrongAnswers.forEach(wrong => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>Otázka:</strong> ${wrong.question}<br>
                <strong>Vaše odpověď:</strong> ${wrong.selectedAnswer}<br>
                <strong>Správná odpověď:</strong> ${wrong.correctAnswer}
            `;
            wrongAnswersList.appendChild(listItem);
        });
        resultsContainer.appendChild(wrongAnswersList);
    } else {
        const noErrorsMessage = document.createElement('p');
        noErrorsMessage.textContent = 'Gratulujeme! Nemáte žádné špatné odpovědi.';
        resultsContainer.appendChild(noErrorsMessage);
    }

    document.querySelector('.container').appendChild(resultsContainer);
}

function calculateGrade(score) {
    const grade1Min = parseInt(document.getElementById('grade1Min').value, 10);
    const grade1Max = parseInt(document.getElementById('grade1Max').value, 10);
    const grade2Min = parseInt(document.getElementById('grade2Min').value, 10);
    const grade2Max = parseInt(document.getElementById('grade2Max').value, 10);
    const grade3Min = parseInt(document.getElementById('grade3Min').value, 10);
    const grade3Max = parseInt(document.getElementById('grade3Max').value, 10);
    const grade4Min = parseInt(document.getElementById('grade4Min').value, 10);
    const grade4Max = parseInt(document.getElementById('grade4Max').value, 10);
    const grade5Min = parseInt(document.getElementById('grade5Min').value, 10);
    const grade5Max = parseInt(document.getElementById('grade5Max').value, 10);

    if (score >= grade1Min && score <= grade1Max) return '1';
    if (score >= grade2Min && score <= grade2Max) return '2';
    if (score >= grade3Min && score <= grade3Max) return '3';
    if (score >= grade4Min && score <= grade4Max) return '4';
    return '5';
}

// Přidání zvolené odpovědi k otázce
function evaluateAnswer(selectedAnswer) {
    const { correctAnswer, points } = questions[currentQuestionIndex];
    questions[currentQuestionIndex].selectedAnswer = selectedAnswer;

    if (selectedAnswer === correctAnswer) {
        score += points;

    } else {

    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        resetPlayerPosition();
        displayQuestion();
    } else {
        endGame();
    }
}

     function displayGrade(score) {
        const gradeText = document.getElementById('gradeText');
        if (score >= parseInt(document.getElementById('grade1Min').value) && score <= parseInt(document.getElementById('grade1Max').value)) {
            gradeText.innerHTML = "Známka: 1";
        } else if (score >= parseInt(document.getElementById('grade2Min').value) && score <= parseInt(document.getElementById('grade2Max').value)) {
            gradeText.innerHTML = "Známka: 2";
        } else if (score >= parseInt(document.getElementById('grade3Min').value) && score <= parseInt(document.getElementById('grade3Max').value)) {
            gradeText.innerHTML = "Známka: 3";
        } else if (score >= parseInt(document.getElementById('grade4Min').value) && score <= parseInt(document.getElementById('grade4Max').value)) {
            gradeText.innerHTML = "Známka: 4";
        } else if (score >= parseInt(document.getElementById('grade5Min').value) && score <= parseInt(document.getElementById('grade5Max').value)) {
            gradeText.innerHTML = "Známka: 5";
        }

        const scoreDisplay = document.getElementById("scoreDisplay");
        scoreDisplay.style.display = 'block';
    }

function exportToHTML() {
    const testName = document.getElementById('testName').value || 'game_questions';  // Získá název testu nebo použije výchozí název
    let htmlContent = `
        <html lang="cs">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${testName}</title>
        </head>
        <body>
            <h1>${testName}</h1>
            <h2>Seznam otázek</h2>
            <ul>
    `;

    questions.forEach(question => {
        htmlContent += `<li><strong>Otázka:</strong> ${question.question}<br>
                        <strong>Odpovědi:</strong><ul>`;
        question.answers.forEach(answer => {
            htmlContent += `<li>${answer}</li>`;
        });
        htmlContent += `</ul><strong>Správná odpověď:</strong> ${question.correctAnswer}<br>
                        <strong>Body:</strong> ${question.points}</li>`;
    });

    htmlContent += `
            </ul>
            <h3>Nastavení časomíry</h3>
            <p>Časovač: ${timerInput.value}s</p>
            <h3>Nastavení známek</h3>
            <p>Známka 1: ${grade1Min.value}-${grade1Max.value}</p>
            <p>Známka 2: ${grade2Min.value}-${grade2Max.value}</p>
            <p>Známka 3: ${grade3Min.value}-${grade3Max.value}</p>
            <p>Známka 4: ${grade4Min.value}-${grade4Max.value}</p>
            <p>Známka 5: ${grade5Min.value}-${grade5Max.value}</p>
        </body>
        </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${testName}.html`;  // Použije název testu pro název souboru
    link.click();
}

function exportToJSON() {
    const testName = document.getElementById('testName').value || 'game_questions';  // Získá název testu nebo použije výchozí název
    const data = {
        questions: questions,
        timer: {
            timeLimit: timerInput.value,
            useTimer: useTimerCheckbox.checked
        },
        grading: {
            grade1: { min: grade1Min.value, max: grade1Max.value },
            grade2: { min: grade2Min.value, max: grade2Max.value },
            grade3: { min: grade3Min.value, max: grade3Max.value },
            grade4: { min: grade4Min.value, max: grade4Max.value },
            grade5: { min: grade5Min.value, max: grade5Max.value }
        }
    };

    const jsonString = JSON.stringify(data, null, 4);

    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${testName}.json`;  // Použije název testu pro název souboru
    link.click();
}

function exportToMoodleXML() {
    const testName = document.getElementById('testName').value || 'game_questions';  // Získá název testu nebo použije výchozí název
    let xmlContent = `<?xml version="1.0" encoding="UTF-8" ?>
    <quiz>
        <question type="multichoice">
    `;

    questions.forEach((question, index) => {
        xmlContent += `
            <name>
                <text>${question.question}</text>
            </name>
            <questiontext format="html">
                <text>${question.question}</text>
            </questiontext>
            <generalfeedback format="html">
                <text>Správná odpověď je: ${question.correctAnswer}</text>
            </generalfeedback>
            <defaultgrade>${question.points}</defaultgrade>
            <answer fraction="100">
                <text>${question.correctAnswer}</text>
                <feedback>
                    <text>Správně!</text>
                </feedback>
            </answer>
        `;

        question.answers.forEach(answer => {
            if (answer !== question.correctAnswer) {
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

    xmlContent += `</quiz>`;

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${testName}.xml`;  // Použije název testu pro název souboru
    link.click();
}
