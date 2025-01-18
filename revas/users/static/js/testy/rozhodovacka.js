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
    let errorMessages = [];  // Pole pro uchování chybových zpráv
    for (let i = 1; i <= questionCount; i++) {
        const questionText = document.querySelector(`[name="question${i}_text"]`).value;
        const points = document.querySelector(`[name="question${i}_points"]`).value;
        const options = [...document.querySelectorAll(`#answers${i} input[type="text"]`)].map(input => input.value);
        const correctAnswers = [...document.querySelectorAll(`[name="question${i}_correct_answer"]:checked`)].map(input => input.value);
        // Kontrola nadpisu otázky
        if (!questionText) {
            errorMessages.push(`Otázka ${i} nemá název.`);  // Přidej chybu do zpráv
            document.getElementById(`errorQuestion${i}`).style.display = 'block';
            isValid = false;
        } else {
            document.getElementById(`errorQuestion${i}`).style.display = 'none';
        }
        // Kontrola správné odpovědi
        if (correctAnswers.length === 0) {
            errorMessages.push(`Otázka ${i} nemá správně zaškrtnuté odpovědi.`);  // Přidej chybu do zpráv
            document.getElementById(`errorAnswer${i}`).style.display = 'block';
            isValid = false;
        } else {
            document.getElementById(`errorAnswer${i}`).style.display = 'none';
        }
        if (questionText && correctAnswers.length > 0) {
            questions.push({ text: questionText, options, correctAnswers, points });
        }
    }
    // Pokud existují chyby, zobrazíme je v errorContainer
    if (!isValid) {
        document.getElementById('errorContainer').style.display = 'block';
        document.getElementById('errorContainer').innerHTML = "<strong>Chyba:</strong> " + errorMessages.join(' ');
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
            const timerInput = document.getElementById('timer').value;
            if (timerInput) {
                totalTime = parseInt(timerInput) * 60; // Převod na sekundy
                timeRemaining = totalTime;
                updateTimerDisplay();
                timerInterval = setInterval(updateTimer, 1000);
                document.getElementById('timerDisplay').style.display = 'block';
            }
        }
        // Funkce pro aktualizaci časovače
        function updateTimer() {
            if (timeRemaining > 0) {
                timeRemaining--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                alert('Čas vypršel! Test bude ukončen.');
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
        alert("Zadejte název testu a alespoň jednu otázku.");
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
       function endTest() {
    const questions = gatherQuestions();
    let score = 0;
    let correctAnswersCount = 0;  // Počet správně odpovězených odpovědí
    let totalCorrectAnswers = 0;  // Počet všech správných odpovědí
    let completelyCorrect = 0; // Počet úplně správně zodpovězených
    let partiallyCorrect = 0; // Počet částečně správně zodpovězených
    let completelyWrong = 0; // Počet špatně zodpovězených
    questions.forEach((q, index) => {
        const selectedAnswers = [...document.querySelectorAll(`[name="preview_answer${index}"]:checked`)].map(input => input.value);
        const correctAnswers = q.correctAnswers;
        totalCorrectAnswers += correctAnswers.length;
        const correctSelectedCount = selectedAnswers.filter(answer => correctAnswers.includes(answer)).length;
        if (correctSelectedCount > 0) {
            // Výpočet skóre pro tuto otázku
            const scoreForThisQuestion = parseFloat(q.points) * (correctSelectedCount / correctAnswers.length);
            score += scoreForThisQuestion;
            correctAnswersCount += correctSelectedCount;
            if (correctSelectedCount === correctAnswers.length) {
                completelyCorrect++; // Uživatelské odpovědi odpovídají všem správným odpovědím
            } else {
                partiallyCorrect++; // Uživatelské odpovědi odpovídají jen některým správným odpovědím
            }
        } else {
            completelyWrong++; // Uživatelské odpovědi odpovídají žádné správné odpovědi
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
    // Přidání statistiky pro správné, částečné a nesprávné odpovědi
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
    const correctAnswers = ['Answer 1', 'Answer 2', 'Answer 4']; // Tohle nastavte podle skutečných správných odpovědí
    const userAnswers = ['Answer 1', 'Answer 3', 'Answer 5']; // Tohle nastavte podle odpovědí uživatele
    const partiallyCorrectAnswers = ['Answer 2']; // Tohle nastavte podle téměř správných odpovědí
    // Zavolání funkce pro zobrazení výsledků
    displayResults(correctAnswers, userAnswers, partiallyCorrectAnswers);
}
// Příklad jak zavolat tuto funkci při kliknutí na tlačítko "Ukázat test"
document.querySelector('.preview-btn').addEventListener('click', showTestResults);