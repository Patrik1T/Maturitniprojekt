let questionCount = 0;
        let timerInterval;
        let totalTime = 0;
        let timeRemaining = 0;

    function addQuestion() {
    questionCount++;
    const questionHTML = `
        <div class="question-wrapper" id="question${questionCount}">
            <label>Otázka ${questionCount}:</label>
            <input type="text" name="question${questionCount}_text" placeholder="Zadejte otázku" required>
            <div class="error-message" id="errorQuestion${questionCount}" style="display: none;">Tato otázka musí mít text.</div>
            <label>Body:</label>
            <input type="number" name="question${questionCount}_points" min="1" value="1">
            <div class="answers" id="answers${questionCount}">
                <label>
                    <input type="checkbox" name="question${questionCount}_correct_answer" value="1">
                    <input type="text" placeholder="Odpověď 1" required>
                    <button type="button" onclick="removeAnswer(${questionCount}, 1)">Smazat odpověď</button>
                </label>
            </div>
            <div class="error-message" id="errorAnswer${questionCount}" style="display: none;">Musíte označit správnou odpověď.</div>
            <button type="button" onclick="addAnswer(${questionCount})">Přidat odpověď</button>
            <button type="button" onclick="deleteQuestion(${questionCount})">Smazat otázku</button>
        </div>
    `;
    document.getElementById('questionsContainer').insertAdjacentHTML('beforeend', questionHTML);
}

function addAnswer(questionId) {
    const answersContainer = document.getElementById(`answers${questionId}`);
    const answerCount = answersContainer.children.length + 1;
    const answerHTML = `
        <label>
            <input type="checkbox" name="question${questionId}_correct_answer" value="${answerCount}">
            <input type="text" placeholder="Odpověď ${answerCount}" required>
            <button type="button" onclick="removeAnswer(${questionId}, ${answerCount})">Smazat odpověď</button>
        </label>
    `;
    answersContainer.insertAdjacentHTML('beforeend', answerHTML);
}
        function removeAnswer(questionId, answerId) {
    const answersContainer = document.getElementById(`answers${questionId}`);
    const answerToRemove = answersContainer.querySelectorAll('label')[answerId - 1];
    if (answerToRemove) {
        answerToRemove.remove();
    }
}
function deleteQuestion(id) {
    document.getElementById(`question${id}`).remove();
}
function gatherQuestions() {
    const questions = [];
    let isValid = true;
    let errorMessages = [];

    for (let i = 1; i <= questionCount; i++) {
        const questionText = document.querySelector(`[name="question${i}_text"]`)?.value?.trim() || '';
        const points = document.querySelector(`[name="question${i}_points"]`)?.value?.trim() || '1';
        const options = [...document.querySelectorAll(`#answers${i} input[type="text"]`)].map(input => input.value.trim());
        const correctAnswers = [...document.querySelectorAll(`[name="question${i}_correct_answer"]:checked`)].map(input => input.value);

        // Validace otázky
        if (!questionText) {
            errorMessages.push(`Otázka ${i} nemá název.`);
            document.getElementById(`errorQuestion${i}`).style.display = 'block';
            isValid = false;
        } else {
            document.getElementById(`errorQuestion${i}`).style.display = 'none';
        }

        // Validace odpovědí
        if (options.length < 2) {
            errorMessages.push(`Otázka ${i} musí mít alespoň dvě odpovědi.`);
            isValid = false;
        }
        if (options.some(option => !option)) {
            errorMessages.push(`Otázka ${i} obsahuje prázdné odpovědi.`);
            isValid = false;
        }

        // Validace správných odpovědí
        if (correctAnswers.length === 0) {
            errorMessages.push(`Otázka ${i} nemá žádnou správnou odpověď.`);
            document.getElementById(`errorAnswer${i}`).style.display = 'block';
            isValid = false;
        } else {
            document.getElementById(`errorAnswer${i}`).style.display = 'none';
        }

        if (isValid) {
            questions.push({
                text: questionText,
                options,
                correctAnswers,
                points,
            });
        }
    }

    if (!isValid) {
        document.getElementById('errorContainer').style.display = 'block';
        document.getElementById('errorContainer').innerHTML = `<strong>Chyba:</strong><ul><li>${errorMessages.join('</li><li>')}</li></ul>`;
    } else {
        document.getElementById('errorContainer').style.display = 'none';
    }

    return questions;
}


        // Funkce pro náhodné promíchání otázek
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
  // Funkce pro spuštění časovače
    function startTimer() {
        let timeLeft = totalTime;
        document.getElementById('timerCount').textContent = formatTime(timeLeft);

        timerInterval = setInterval(() => {
            timeLeft--;
            document.getElementById('timerCount').textContent = formatTime(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                showTimeUpMessage();  // Zobrazí výstrahu místo alertu
                endTest();  // Automaticky ukončí test, když čas vyprší
            }
        }, 1000);
    }

    function showTimeUpMessage() {
        const timeUpContainer = document.getElementById('timeUpContainer');
        timeUpContainer.style.display = 'block';

        // Skryje výstrahu po 5 sekundách
        setTimeout(() => {
            timeUpContainer.style.display = 'none';
        }, 5000);
    }

    // Funkce pro formátování času (minuty:sekundy)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${minutes}:${sec < 10 ? '0' + sec : sec}`;
    }

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
}

document.getElementById('enableTimer').addEventListener('change', (e) => {
    if (e.target.checked) {
        totalTime = parseInt(document.getElementById('timer').value) * 60;
        document.getElementById('timerDisplay').style.display = 'block';
        startTimer();
    } else {
        clearInterval(timerInterval);
        document.getElementById('timerDisplay').style.display = 'none';
    }
});
        // Funkce pro aktualizaci časovače
        function updateTimer() {
            if (timeRemaining > 0) {
                timeRemaining--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                submitTest();
            }
        }
        // Funkce pro zobrazení času na obrazovce
        function updateTimerDisplay() {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            document.getElementById('timerCount').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
        // Funkce pro zobrazení náhledu testu
function previewTest() {
    const testName = document.getElementById('testName').value;
    const questions = gatherQuestions();
    if (!testName || questions.length === 0) {
    showAlert('error', 'Zadejte název testu a alespoň jednu otázku.');
    return;
}

    // Náhodně promícháme otázky
    const shuffledQuestions = shuffleArray(questions);
    let previewHTML = `
        <h3>Náhled na test: ${testName}</h3>
    `;
    shuffledQuestions.forEach((q, index) => {
        previewHTML += `
            <div class="question-preview">
                <p><strong>Otázka ${index + 1}:</strong> ${q.text}</p>
                <div class="answers-preview">
        `;
        q.options.forEach((option, i) => {
            previewHTML += `
                <label>
                    <input type="checkbox" name="preview_answer${index}" value="${i + 1}">
                    ${option}
                </label><br>
            `;
        });
        previewHTML += `
                </div>
                <p><strong>Body:</strong> ${q.points}</p>
            </div>
        `;
    });
    previewHTML += `
        <button type="button" onclick="endTest()">Ukončit test</button>
        <button type="button" onclick="restartTest()">Restartovat test</button>
    `;
    // Vložíme generovaný obsah do náhledu testu
    document.getElementById('testContent').innerHTML = previewHTML;
    document.getElementById('previewTest').style.display = 'block';
    // Pokud je časovač povolen, spusťte ho
    if (document.getElementById('enableTimer').checked) {
        startTimer();
    }
}

// Funkce pro zobrazení upozorňovacího okna
function showAlert(type, message) {
    const errorContainer = document.getElementById('errorContainer');
    const successContainer = document.getElementById('successContainer');

    // Skrytí obou kontejnerů
    errorContainer.style.display = 'none';
    successContainer.style.display = 'none';

    // Zobrazení příslušného kontejneru s textem
    if (type === 'error') {
        errorContainer.innerText = message;
        errorContainer.style.display = 'block';
    } else if (type === 'success') {
        successContainer.innerText = message;
        successContainer.style.display = 'block';
    }
}

       function endTest() {
    const questions = gatherQuestions();
    let score = 0;
    let correctAnswersCount = 0;
    let totalCorrectAnswers = 0;
    let completelyCorrect = 0;
    let partiallyCorrect = 0;
    let completelyWrong = 0;

    questions.forEach((q, index) => {
        const selectedAnswers = [...document.querySelectorAll(`[name="preview_answer${index}"]:checked`)].map(input => input.value);
        const correctAnswers = q.correctAnswers;
        totalCorrectAnswers += correctAnswers.length;
        const correctSelectedCount = selectedAnswers.filter(answer => correctAnswers.includes(answer)).length;

        if (correctSelectedCount > 0) {
            const scoreForThisQuestion = parseFloat(q.points) * (correctSelectedCount / correctAnswers.length);
            score += scoreForThisQuestion;
            correctAnswersCount += correctSelectedCount;
            if (correctSelectedCount === correctAnswers.length) {
                completelyCorrect++;
            } else {
                partiallyCorrect++;
            }
        } else {
            completelyWrong++;
        }
    });

    const totalPoints = questions.reduce((sum, q) => sum + parseFloat(q.points), 0);
    const correctPercentage = (correctAnswersCount / totalCorrectAnswers) * 100;
    const roundedScore = score.toFixed(2);
    const grade = getGrade(score);

    document.getElementById('scoreDisplay').textContent = `Tvoje skóre: ${roundedScore} / ${totalPoints.toFixed(2)} bodů`;
    document.getElementById('gradeDisplay').textContent = `Známka: ${grade}`;
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('percentageDisplay').textContent = `Správně odpověděno: ${correctPercentage.toFixed(2)}%`;

    document.getElementById('correctAnswersDisplay').textContent = `Úplně správně: ${completelyCorrect} otázek`;
    document.getElementById('partiallyCorrectDisplay').textContent = `Skoro správně: ${partiallyCorrect} otázek`;
    document.getElementById('wrongAnswersDisplay').textContent = `Úplně špatně: ${completelyWrong} otázek`;

    clearInterval(timerInterval);
    document.getElementById('timerDisplay').style.display = 'none';
}

        // Funkce pro restart testu
function restartTest() {
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('timerDisplay').style.display = 'none';
    clearInterval(timerInterval);
    timeRemaining = totalTime;
    // Resetovat všechny odpovědi
    const checkboxes = document.querySelectorAll('[name^="preview_answer"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
    // Zobrazit časovač a začít znovu
    if (document.getElementById('enableTimer').checked) {
        startTimer();
    }
    // Přečíst otázky a promíchat je
    const questions = gatherQuestions();
    const shuffledQuestions = shuffleArray(questions);
    let previewHTML = `
        <h3>Náhled na test</h3>
    `;
    shuffledQuestions.forEach((q, index) => {
        previewHTML += `
            <div class="question-preview">
                <p><strong>Otázka ${index + 1}:</strong> ${q.text}</p>
                <div class="answers-preview">
        `;
        q.options.forEach((option, i) => {
            previewHTML += `
                <label>
                    <input type="checkbox" name="preview_answer${index}" value="${i + 1}">
                    ${option}
                </label><br>
            `;
        });
        previewHTML += `
                </div>
                <p><strong>Body:</strong> ${q.points}</p>
            </div>
        `;
    });
    previewHTML += `
        <button type="button" onclick="endTest()">Ukončit test</button>
        <button type="button" onclick="restartTest()">Restartovat test</button>
    `;
    // Vloží obsah do náhledu testu
    document.getElementById('testContent').innerHTML = previewHTML;
}
        // Funkce pro získání známky
        function getGrade(score) {
            const grade1 = parseInt(document.getElementById('grade1').value);
            const grade2 = parseInt(document.getElementById('grade2').value);
            const grade3 = parseInt(document.getElementById('grade3').value);
            const grade4 = parseInt(document.getElementById('grade4').value);
            const grade5 = parseInt(document.getElementById('grade5').value);
            if (score >= grade1) return '1';
            if (score >= grade2) return '2';
            if (score >= grade3) return '3';
            if (score >= grade4) return '4';
            return '5';
        }
        document.getElementById('enableTimer').addEventListener('change', (e) => {
            if (e.target.checked) {
                totalTime = parseInt(document.getElementById('timer').value) * 60;
                document.getElementById('timerDisplay').style.display = 'block';
                startTimer();
            } else {
                clearInterval(timerInterval);
                document.getElementById('timerDisplay').style.display = 'none';
            }
        });

function displayResults(correctAnswers, userAnswers, partiallyCorrectAnswers) {
    const correctDisplay = document.getElementById('correctAnswersDisplay');
    const partiallyCorrectDisplay = document.getElementById('partiallyCorrectDisplay');
    const wrongDisplay = document.getElementById('wrongAnswersDisplay');
    let correctHTML = '';
    let partiallyCorrectHTML = '';
    let wrongHTML = '';
    let correctCount = 0;
    let partiallyCorrectCount = 0;
    let wrongCount = 0;
    // Zpracování správných odpovědí
    correctAnswers.forEach((answer) => {
        correctHTML += `<span class="correct">${answer}</span><br>`;
        correctCount++;
    });
    // Zpracování téměř správných odpovědí
    partiallyCorrectAnswers.forEach((answer) => {
        partiallyCorrectHTML += `<span class="partially-correct">${answer}</span><br>`;
        partiallyCorrectCount++;
    });
    // Zpracování odpovědí uživatele
    userAnswers.forEach((answer) => {
        const isCorrect = correctAnswers.some((correctAnswer) => correctAnswer.toLowerCase().trim() === answer.toLowerCase().trim());
        const isPartiallyCorrect = partiallyCorrectAnswers.some((partiallyCorrectAnswer) => partiallyCorrectAnswer.toLowerCase().trim() === answer.toLowerCase().trim());
        if (isCorrect) {
            correctHTML += `<span class="correct">${answer}</span><br>`;
            correctCount++;
        } else if (isPartiallyCorrect) {
            partiallyCorrectHTML += `<span class="partially-correct">${answer}</span><br>`;
            partiallyCorrectCount++;
        } else {
            wrongHTML += `<span class="wrong">${answer}</span><br>`;
            wrongCount++;
        }
    });
    // Zobrazení výsledků
    correctDisplay.innerHTML = `Úplně správně: ${correctCount} otázek<br>${correctHTML}`;
    partiallyCorrectDisplay.innerHTML = `Skoro správně: ${partiallyCorrectCount} otázek<br>${partiallyCorrectHTML}`;
    wrongDisplay.innerHTML = `Úplně špatně: ${wrongCount} otázek<br>${wrongHTML}`;
}

// Zavolání funkce při kliknutí na tlačítko pro zobrazení výsledků
function showTestResults() {
    // Předpokládané testovací odpovědi
    const correctAnswers = ['Answer 1', 'Answer 2', 'Answer 4'];
    const userAnswers = ['Answer 1', 'Answer 3', 'Answer 5'];
    const partiallyCorrectAnswers = ['Answer 2'];
    // Zavolání funkce pro zobrazení výsledků
    displayResults(correctAnswers, userAnswers, partiallyCorrectAnswers);
}
// Příklad jak zavolat tuto funkci při kliknutí na tlačítko "Ukázat test"
document.querySelector('.preview-btn').addEventListener('click', showTestResults);


 const errorContainer = document.getElementById("errorContainer");
    const successContainer = document.getElementById("successContainer");
    const questionsContainer = document.getElementById("questionsContainer");

    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.style.display = "block";
        setTimeout(() => errorContainer.style.display = "none", 5000);
    }

    function showSuccess(message) {
        successContainer.textContent = message;
        successContainer.style.display = "block";
        setTimeout(() => successContainer.style.display = "none", 5000);
    }

    function validateForm() {
        const testName = document.getElementById("testName").value.trim();
        const timer = document.getElementById("timer").checked;
        const timerDuration = document.getElementById("timerDuration").value;
        const questions = questionsContainer.getElementsByClassName("question");

        if (!testName) {
            showError("Název testu je povinný.");
            return;
        }

        if (timer && !timerDuration) {
            showError("Pokud je časovač aktivní, musíte zadat čas.");
            return;
        }

        for (const question of questions) {
            const questionText = question.querySelector("textarea").value.trim();
            const answers = question.querySelectorAll(".answers input");

            if (!questionText) {
                showError("Každá otázka musí mít text.");
                return;
            }

            if (answers.length < 2) {
                showError("Každá otázka musí mít alespoň dvě odpovědi.");
                return;
            }

            for (const answer of answers) {
                if (!answer.value.trim()) {
                    showError("Každá odpověď musí být vyplněna.");
                    return;
                }
            }
        }

        showSuccess("Test byl úspěšně uložen.");
    }


function saveTestToXml() {
    const testName = document.getElementById('testName').value.trim() || "Test";
    const testDescription = document.getElementById('testDescription').value.trim();
    const questions = gatherQuestions();

    if (questions.length === 0) {
        alert("Žádné validní otázky nebyly nalezeny.");
        return;
    }

    // Generování XML obsahu
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<quiz>
    <name>${testName}</name>
    <description>${testDescription}</description>`;

    questions.forEach((question, index) => {
        xmlContent += `
    <question type="multichoice">
        <name>
            <text>Otázka ${index + 1}</text>
        </name>
        <questiontext format="html">
            <text><![CDATA[${question.text}]]></text>
        </questiontext>
        <defaultgrade>${question.points}</defaultgrade>
        <single>false</single>
        <shuffleanswers>true</shuffleanswers>
        <answernumbering>none</answernumbering>`;

        question.options.forEach((option, idx) => {
            const isCorrect = question.correctAnswers.includes(String(idx));
            xmlContent += `
        <answer fraction="${isCorrect ? '100' : '0'}">
            <text><![CDATA[${option}]]></text>
            <feedback>
                <text>${isCorrect ? 'Správná odpověď!' : 'Špatná odpověď.'}</text>
            </feedback>
        </answer>`;
        });

        xmlContent += `
    </question>`;
    });

    xmlContent += `
</quiz>`;

    // Vytvoření Blob objektu a nabídnutí ke stažení
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${testName}.xml`;
    link.click();
}





function saveTestToJson() {
    const testName = document.getElementById('testName').value.trim() || "Test";
    const testDescription = document.getElementById('testDescription').value.trim();
    const questions = gatherQuestions();

    const testData = {
        name: testName,
        description: testDescription,
        questions: questions
    };

    // Vytvoření souboru a nabídnutí ke stažení
    const blob = new Blob([JSON.stringify(testData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${testName}.json`;
    link.click();
}




function saveTestToHtml() {
    const testName = document.getElementById('testName').value.trim() || "Test";
    const testDescription = document.getElementById('testDescription').value.trim();
    const questions = gatherQuestions(); // Funkce pro získání všech otázek

    let htmlContent = `
        <html>
            <head>
                <title>${testName}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                    }
                    .question {
                        margin-bottom: 20px;
                    }
                    .question label {
                        font-weight: bold;
                    }
                    .result {
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <h1>${testName}</h1>
                <p>${testDescription}</p>
                <form id="testForm">`;

    // Generování otázek
    questions.forEach((question, index) => {
        htmlContent += `
            <div class="question">
                <p><strong>Otázka ${index + 1}:</strong> ${question.text}</p>
                <label for="answer_${index}">Odpověď:</label>
                <input type="text" name="answer_${index}" placeholder="Zadejte odpověď">
            </div>`;
    });

    htmlContent += `
            <button type="button" onclick="evaluateTest()">Vyhodnotit test</button>
            <div id="resultsContainer"></div> <!-- Kontejner pro výsledky -->
        </form>
        </body>
    </html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${testName}.html`;
    link.click();
}
