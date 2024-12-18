  let questionCount = 0;
        let timerInterval;
        let totalTime = 0;
        let timeRemaining = 0;

function saveTest(location) {
    // Kód pro uložení testu sem patří, budu děl v djangu.
    // Například se test uloží do databáze nebo souboru v závislosti na parametru 'location'.

    // Zde přidáme logiku pro úspěšné uložení
    if (location === 'profil') {
        // Představme si, že test je úspěšně uložen do profilu
        showSuccessMessage('Test byl úspěšně uložen v aplikaci.');
    } else if (location === 'verejne_testy') {
        // Představme si, že test je úspěšně uložen jako veřejný test
        showSuccessMessage('Test byl úspěšně uložen jako veřejný test.');
    }
}




        function showSuccessMessage(message) {
    const successContainer = document.getElementById('successContainer');
    successContainer.innerHTML = `<strong>Úspěch:</strong> ${message}`;
    successContainer.style.display = 'block';  // Zobrazí zprávu
    setTimeout(function() {
        successContainer.style.display = 'none';  // Po 3 sekundách se zpráva schová
    }, 3000);
}




        function validateTest() {
    let isValid = true;
    const errorMessages = [];

    // Kontrola názvu testu
    const testName = document.getElementById('testName').value;
    if (!testName) {
        errorMessages.push("Název testu není zadán.");
        document.getElementById('testName').style.borderColor = 'red';  // Zvýrazní pole
    } else {
        document.getElementById('testName').style.borderColor = '';  // Resetuje barvu, pokud je název správný
    }

    // Kontrola popisu testu
    const testDescription = document.getElementById('testDescription').value;
    if (!testDescription) {
        errorMessages.push("Popis testu není zadán.");
        document.getElementById('testDescription').style.borderColor = 'red';  // Zvýrazní pole
    } else {
        document.getElementById('testDescription').style.borderColor = '';  // Resetuje barvu
    }

    // Kontrola obrázku testu
    const testImage = document.getElementById('testImage').files.length;
    if (testImage === 0) {
        errorMessages.push("Obrázek testu není nahrán.");
        document.getElementById('testImage').style.borderColor = 'red';  // Zvýrazní pole
    } else {
        document.getElementById('testImage').style.borderColor = '';  // Resetuje barvu
    }

    const questions = gatherQuestions();
    // Kontrola každé otázky
    questions.forEach((q, index) => {
        // Kontrola, zda má otázka text
        if (!q.text) {
            errorMessages.push(`Otázka ${index + 1} nemá název.`);
            document.querySelector(`[name="question${index + 1}_text"]`).style.borderColor = 'red';
        }

        // Kontrola, zda je zaškrtnutá alespoň jedna odpověď
        if (q.correctAnswers.length === 0) {
            errorMessages.push(`Otázka ${index + 1} nemá správně zaškrtnuté odpovědi.`);
            const answersInputs = document.querySelectorAll(`[name="question${index + 1}_correct_answer"]`);
            answersInputs.forEach(input => input.style.borderColor = 'red');
        } else {
            const answersInputs = document.querySelectorAll(`[name="question${index + 1}_correct_answer"]`);
            answersInputs.forEach(input => input.style.borderColor = ''); // Resetování barvy borderu
        }
    });

    // Pokud jsou nějaké chyby, zobrazíme chybovou hlášku
    if (errorMessages.length > 0) {
        document.getElementById('errorContainer').style.display = 'block';
        document.getElementById('errorContainer').innerHTML = "<strong>Chyba:</strong> " + errorMessages.join(' ');
    } else {
        document.getElementById('errorContainer').style.display = 'none';
    }

    return isValid;
}





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

    // Vloží obsah do náhledu testu
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

    let correctAnswersList = []; // Úplně správné otázky
    let partiallyCorrectList = []; // Skoro správné otázky
    let completelyWrongList = []; // Úplně špatné otázky

    const userAnswersList = []; // Uložení odpovědí uživatele

    questions.forEach((q, index) => {
        const selectedAnswers = [...document.querySelectorAll(`[name="preview_answer${index}"]:checked`)].map(input => input.value);
        const correctAnswers = q.correctAnswers;

        userAnswersList.push(...selectedAnswers);

        const correctSelectedCount = selectedAnswers.filter(answer => correctAnswers.includes(answer)).length;

        if (correctSelectedCount > 0) {
            // Výpočet skóre pro tuto otázku
            const scoreForThisQuestion = parseFloat(q.points) * (correctSelectedCount / correctAnswers.length);
            score += scoreForThisQuestion;

            if (correctSelectedCount === correctAnswers.length) {
                correctAnswersList.push(q.text); // Přidat do úplně správných
            } else {
                partiallyCorrectList.push({
                    question: q.text,
                    missingAnswers: correctAnswers.filter(answer => !selectedAnswers.includes(answer)) // Chybějící odpovědi
                });
            }
        } else {
            completelyWrongList.push(q.text); // Přidat do úplně špatných
        }
    });

    const totalPoints = questions.reduce((sum, q) => sum + parseFloat(q.points), 0);
    const roundedScore = score.toFixed(2);
    const grade = getGrade(score);

    // Použití displayResults pro zobrazení výsledků
    const correctQuestions = correctAnswersList;
    const partiallyCorrectQuestions = partiallyCorrectList.map(pc => `${pc.question} (Chybí: ${pc.missingAnswers.join(', ')})`);
    const wrongQuestions = completelyWrongList;

    displayResults(correctQuestions, userAnswersList, partiallyCorrectQuestions);

    // Dodatečné zobrazení známky a skóre
    document.getElementById('scoreDisplay').textContent = `Tvoje skóre: ${roundedScore} / ${totalPoints.toFixed(2)} bodů`;
    document.getElementById('gradeDisplay').textContent = `Známka: ${grade}`;

    // Zastavení časovače, pokud běží
    clearInterval(timerInterval);
    document.getElementById('timerDisplay').style.display = 'none';
}

function displayResults(correctAnswers, userAnswers, partiallyCorrectAnswers) {
    const correctDisplay = document.getElementById('correctAnswersDisplay');
    const partiallyCorrectDisplay = document.getElementById('partiallyCorrectDisplay');
    const wrongDisplay = document.getElementById('wrongAnswersDisplay');

    let correctHTML = '';
    let partiallyCorrectHTML = '';
    let wrongHTML = '';

    let correctCount = correctAnswers.length;
    let partiallyCorrectCount = partiallyCorrectAnswers.length;
    let wrongCount = userAnswers.length - correctCount - partiallyCorrectCount;

    // Zpracování správných odpovědí
    correctAnswers.forEach((answer) => {
        correctHTML += `<span class="correct">${answer}</span><br>`;
    });

    // Zpracování téměř správných odpovědí
    partiallyCorrectAnswers.forEach((answer) => {
        partiallyCorrectHTML += `<span class="partially-correct">${answer}</span><br>`;
    });

    // Zpracování špatných odpovědí
    wrongHTML = wrongCount > 0 ? `<span class="wrong">${wrongCount} špatných odpovědí</span>` : '';

    // Zobrazení výsledků
    correctDisplay.innerHTML = `Úplně správně: ${correctCount} otázek<br>${correctHTML}`;
    partiallyCorrectDisplay.innerHTML = `Skoro správně: ${partiallyCorrectCount} otázek<br>${partiallyCorrectHTML}`;
    wrongDisplay.innerHTML = `Úplně špatně: ${wrongCount} otázek<br>${wrongHTML}`;
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







function saveAsHtml() {
    const testName = document.getElementById('testName').value;
    const questions = gatherQuestions(); // Funkce pro získání otázek

    if (!testName || questions.length === 0) {
        alert("Zadejte název testu a alespoň jednu otázku.");
        return;
    }

    let htmlContent = `
        <!DOCTYPE html>
        <html lang="cs">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${testName}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .question { margin-bottom: 20px; }
                .question h3 { margin: 10px 0; }
                .answers { margin-left: 20px; }
            </style>
        </head>
        <body>
        <h1>${testName}</h1>
        <div id="testContent">
    `;

    questions.forEach((question, index) => {
        htmlContent += `
            <div class="question">
                <h3>Otázka ${index + 1}: ${question.text}</h3>
                <div class="answers">
        `;

        question.options.forEach((option, i) => {
            htmlContent += `
                <label>
                    <input type="checkbox" disabled ${question.correctOption === i + 1 ? 'checked' : ''}>
                    ${option}
                </label><br>
            `;
        });

        htmlContent += `
                </div>
            </div>
        `;
    });

    htmlContent += `
        </div>
        </body>
        </html>
    `;

    // Vytvoření souboru HTML a jeho stažení
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${testName}.html`; // Název souboru
    a.click();
    URL.revokeObjectURL(url); // Uvolnění objektu URL
}
