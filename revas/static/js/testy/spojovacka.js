    let questionCount = 0;

    // Funkce pro přidání otázky
function addQuestion() {
    questionCount++;
    const questionHTML = `
        <div class="question-wrapper" id="question${questionCount}">
            <label>Otázka ${questionCount}:</label>
            <textarea name="question${questionCount}_text" placeholder="Zadejte otázku" required></textarea>
            <div class="error-message" id="errorQuestion${questionCount}" style="display: none; color: red;">Tato otázka musí mít text.</div>
            
            <label>Odpovědi:</label>
            <div id="answers${questionCount}" class="answers">
                <div>
                    <input type="text" name="question${questionCount}_answer_1" placeholder="Zadejte odpověď" required>
                    <input type="checkbox" name="question${questionCount}_correct_1"> Správná odpověď
                </div>
            </div>
            
            <button type="button" onclick="addAnswer(${questionCount})">Přidat odpověď</button>
            <button type="button" onclick="deleteQuestion(${questionCount})">Smazat otázku</button>
        </div>
    `;
    document.getElementById('questionsContainer').insertAdjacentHTML('beforeend', questionHTML);
}

// Funkce pro přidání odpovědi
function addAnswer(questionId) {
    const answerContainer = document.getElementById(`answers${questionId}`);
    const answerCount = answerContainer.children.length + 1;
    const answerHTML = `
        <div id="answer_${questionId}_${answerCount}">
            <input type="text" name="question${questionId}_answer_${answerCount}" placeholder="Zadejte odpověď" required>
            <input type="checkbox" name="question${questionId}_correct_${answerCount}"> Správná odpověď
            <button type="button" onclick="deleteAnswer(${questionId}, ${answerCount})">Smazat odpověď</button>
        </div>
    `;
    answerContainer.insertAdjacentHTML('beforeend', answerHTML);
}

// Funkce pro smazání odpovědi
function deleteAnswer(questionId, answerId) {
    const answerElement = document.getElementById(`answer_${questionId}_${answerId}`);
    if (answerElement) {
        answerElement.remove();
    }
}

// Funkce pro smazání otázky
function deleteQuestion(questionId) {
    const questionElement = document.getElementById(`question${questionId}`);
    if (questionElement) {
        questionElement.remove();
    }
}

// Funkce pro shromáždění všech otázek
function gatherQuestions() {
    const questions = [];
    for (let i = 1; i <= questionCount; i++) {
        const questionElement = document.querySelector(`#question${i}`);
        if (questionElement) {
            const text = questionElement.querySelector(`textarea[name="question${i}_text"]`).value.trim();
            const answers = [];
            const answerElements = questionElement.querySelectorAll(`#answers${i} div`);

            answerElements.forEach((answerElement, index) => {
                const answerText = answerElement.querySelector(`input[name="question${i}_answer_${index + 1}"]`).value.trim();
                const isCorrect = answerElement.querySelector(`input[name="question${i}_correct_${index + 1}"]`).checked;
                answers.push({ text: answerText, correct: isCorrect });
            });

            questions.push({ text, answers });
        }
    }
    return questions;
}

// Funkce pro náhled testu a časomíru
function previewTest() {
    const enableTimer = document.getElementById("enableTimer").checked;
    const timerValue = document.getElementById("timer").value;

    let previewHTML = '<h3>Náhled na test:</h3>';
    const questions = gatherQuestions();

    questions.forEach((q, index) => {
        previewHTML += `
            <div class="question-preview">
                <p><strong>Otázka ${index + 1}:</strong> ${q.text}</p>
                <p>Odpovědi:</p>
                <div class="answers-preview">`;

        q.answers.forEach((answer, ansIndex) => {
            previewHTML += `
                <label>
                    <input type="checkbox" name="preview_question_${index}_${ansIndex}" />
                    ${answer.text}
                </label><br>
                <label>
                    Vaše odpověď:
                    <input type="text" name="preview_answer_${index}_${ansIndex}" placeholder="Napište odpověď" />
                </label><br>`;
        });

        previewHTML += `</div></div>`;
    });

    // Nastavení časomíry
    if (enableTimer && timerValue) {
        previewHTML += `<p><strong>Časovač: </strong>${timerValue} minut</p>`;
        startTimer(timerValue);  // Spustí časomíru
    }

    previewHTML += '<button type="button" onclick="evaluateTest()">Vyhodnotit test</button>';
    document.getElementById('testContent').innerHTML = previewHTML;
}

// Funkce pro spuštění časomíry s animací
function startTimer(minutes) {
    const countdownDisplay = document.createElement("p");
    countdownDisplay.id = "timerDisplay";
    document.getElementById("testContent").appendChild(countdownDisplay);

    let timeRemaining = minutes * 60; // Přepočet minut na sekundy
    const timerInterval = setInterval(function() {
        const minutesLeft = Math.floor(timeRemaining / 60);
        const secondsLeft = timeRemaining % 60;

        // Animace odpočítávání
        countdownDisplay.textContent = `Čas zbývá: ${minutesLeft}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;

        timeRemaining--; // Snížení času

        // Po uplynutí času
        if (timeRemaining < 0) {
            clearInterval(timerInterval); // Zastavení časomíry
            alert("Čas vypršel!");
            evaluateTest();  // Automatické vyhodnocení testu
        }
    }, 1000); // Odpočítávání každou sekundu
}

// Funkce pro vyhodnocení testu
function evaluateTest() {
    const questions = gatherQuestions();
    let totalScore = 0;
    let resultsHTML = '<h3>Výsledky testu:</h3>';

    questions.forEach((q, index) => {
        let questionScore = 0;
        let userAnswers = [];

        q.answers.forEach((answer, ansIndex) => {
            const userAnswer = document.querySelector(`input[name="preview_answer_${index}_${ansIndex}"]`).value.trim();
            const isAnswerCorrect = userAnswer.toLowerCase() === answer.text.toLowerCase();
            const isChecked = document.querySelector(`input[name="preview_question_${index}_${ansIndex}"]`).checked;

            if (isAnswerCorrect) {
                questionScore += 1;
            }

            if (isChecked && answer.correct) {
                questionScore += 1;
            }

            userAnswers.push({
                userAnswer,
                isAnswerCorrect,
                isChecked,
                answerText: answer.text,
                isCorrectAnswer: answer.correct,
            });
        });

        totalScore += questionScore;

        resultsHTML += `
            <div>
                <p><strong>Otázka ${index + 1}:</strong> ${q.text}</p>
                ${userAnswers.map((a, i) => 
                    `<p>Odpověď ${i + 1}: 
                        <br>Uživatel: ${a.userAnswer} (${a.isAnswerCorrect ? 'Správně napsáno' : 'Špatně napsáno'}) 
                        <br>Zaškrtnuto: ${a.isChecked ? 'Ano' : 'Ne'} 
                        <br>Správná odpověď: ${a.answerText} (${a.isCorrectAnswer ? 'Správná' : 'Špatná'})
                    </p>`).join('')}
                <p><strong>Body za tuto otázku:</strong> ${questionScore}</p>
            </div>`;
    });

    let grade = '';
    const maxScore = questions.length * 2;
    const grade1 = parseInt(document.getElementById('grade1').value);
    const grade2 = parseInt(document.getElementById('grade2').value);
    const grade3 = parseInt(document.getElementById('grade3').value);
    const grade4 = parseInt(document.getElementById('grade4').value);
    const grade5 = parseInt(document.getElementById('grade5').value);

    if (totalScore >= grade1) grade = '1 (Výborný)';
    else if (totalScore >= grade2) grade = '2 (Chvalitebný)';
    else if (totalScore >= grade3) grade = '3 (Dobrý)';
    else if (totalScore >= grade4) grade = '4 (Dostatečný)';
    else grade = '5 (Nedostatečný)';

    resultsHTML += `<p><strong>Celkové skóre:</strong> ${totalScore} / ${maxScore}</p>`;
    resultsHTML += `<p><strong>Známka:</strong> ${grade}</p>`;

    document.getElementById('resultsContainer').innerHTML = resultsHTML;
    document.getElementById('resultsSection').style.display = 'block';
}

function saveTestToJson() {
    const testName = document.getElementById('testName').value.trim();
    const testDescription = document.getElementById('testDescription').value.trim();
    const questions = gatherQuestions();

    const testData = {
        name: testName,
        description: testDescription,
        questions: questions.map(q => ({
            text: q.text,
            answers: q.answers.map(a => ({
                text: a.text,
                correct: a.correct
            }))
        }))
    };

    const jsonString = JSON.stringify(testData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, `${testName || 'test'}.json`);
}
function saveTestToHtml() {
    const testName = document.getElementById('testName').value.trim();
    const testDescription = document.getElementById('testDescription').value.trim();
    const questions = gatherQuestions();

    let htmlContent = `
    <!DOCTYPE html>
    <html lang="cs">
    <head>
        <meta charset="UTF-8">
        <title>${testName || 'Test'}</title>
    </head>
    <body>
        <h1>${testName || 'Test'}</h1>
        <p>${testDescription}</p>
        ${questions.map((q, index) => `
            <div>
                <h2>Otázka ${index + 1}: ${q.text}</h2>
                <ul>
                    ${q.answers.map(a => `
                        <li>${a.text}${a.correct ? ' (Správná odpověď)' : ''}</li>
                    `).join('')}
                </ul>
            </div>
        `).join('')}
    </body>
    </html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    saveAs(blob, `${testName || 'test'}.html`);
}

function saveTestToXml() {
    const testName = document.getElementById('testName').value.trim();
    const questions = gatherQuestions();

    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<quiz>\n`;

    questions.forEach((q, index) => {
        xmlContent += `
        <question type="matching">
            <name>
                <text>${q.text}</text>
            </name>
            <questiontext format="html">
                <text><![CDATA[${q.text}]]></text>
            </questiontext>
            <shuffleanswers>true</shuffleanswers>`;

        q.answers.forEach(a => {
            if (a.correct) {
                xmlContent += `
            <subquestion>
                <text><![CDATA[${a.text}]]></text>
                <answer>
                    <text><![CDATA[${a.text}]]></text>
                </answer>
            </subquestion>`;
            }
        });

        xmlContent += `
        </question>\n`;
    });

    xmlContent += `</quiz>`;
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    saveAs(blob, `${testName || 'test'}.xml`);
}




