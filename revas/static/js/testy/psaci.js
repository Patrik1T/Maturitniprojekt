   let questionCount = 0;
    let timerInterval;
    let totalTime = 0;
    let timeRemaining = 0;
    let totalPoints = 0;
    let correctAnswers = 0;

  function addQuestion() {
    questionCount++;
    const questionHTML = `
        <div class="question-wrapper" id="question${questionCount}">
            <label>Otázka ${questionCount}:</label>
            <input type="text" name="question${questionCount}_text" placeholder="Zadejte otázku" required>
            <div class="error-message" id="errorQuestion${questionCount}">Tato otázka musí mít text.</div>
            
            <label>Správná odpověď:</label>
            <input type="text" name="question${questionCount}_correct_answer" placeholder="Zadejte správnou odpověď" required>
            
            <label>Body za tuto otázku:</label>
            <input type="number" name="question${questionCount}_points" placeholder="Zadejte počet bodů" required>
            
            <button type="button" onclick="deleteQuestion(${questionCount})">Smazat otázku</button>
        </div>
    `;
    document.getElementById('questionsContainer').insertAdjacentHTML('beforeend', questionHTML);
}

// Funkce pro smazání otázky
function deleteQuestion(questionId) {
    const questionElement = document.getElementById(`question${questionId}`);
    questionElement.remove();
}

// Funkce pro zobrazení výsledků testu
function showResults() {
    const questions = gatherQuestions();
    let resultsHTML = '';
    let totalScore = 0;
    questions.forEach((q, index) => {
        const userAnswer = document.querySelector(`[name="answer_${index}"]`).value.trim();
        const isCorrect = userAnswer.toLowerCase() === q.correctAnswer.toLowerCase();
        const points = q.points;
        totalScore += isCorrect ? points : 0;

        resultsHTML += `
            <div>
                <p><strong>Otázka ${index + 1}:</strong> ${q.text}</p>
                <p><strong>Vaše odpověď:</strong> ${userAnswer}</p>
                <p><strong>Správná odpověď:</strong> ${q.correctAnswer}</p>
                <p><strong>Body:</strong> ${isCorrect ? points : 0} / ${points}</p>
            </div>
        `;
    });

    resultsHTML += `<p><strong>Celkové skóre:</strong> ${totalScore} / ${calculateTotalPoints(questions)}</p>`;
    document.getElementById('resultsContainer').innerHTML = resultsHTML;
    document.getElementById('resultsSection').style.display = 'block';
}


function gatherQuestions() {
    const questions = [];
    for (let i = 1; i <= questionCount; i++) {
        const questionText = document.querySelector(`[name="question${i}_text"]`).value.trim();
        const correctAnswer = document.querySelector(`[name="question${i}_correct_answer"]`).value.trim();
        const points = parseInt(document.querySelector(`[name="question${i}_points"]`).value);

        // Získání nesprávných odpovědí
        const incorrectAnswers = [];
        document.querySelectorAll(`[name="question${i}_incorrect_answer"]`).forEach(input => {
            if (input.value.trim()) {
                incorrectAnswers.push(input.value.trim());
            }
        });

        questions.push({
            text: questionText,
            correctAnswer: correctAnswer,
            incorrectAnswers: incorrectAnswers,
            points: points
        });
    }
    return questions;
}



// Připojení funkce k tlačítku pro uložení testu jako HTML
document.getElementById('saveAsHtmlBtn').addEventListener('click', saveTestToHtml);

// Funkce pro výpočet celkových bodů
function calculateTotalPoints(questions) {
    return questions.reduce((total, q) => total + q.points, 0);
}

       // Funkce pro náhled testu
function previewTest() {
    const questions = gatherQuestions();
    let previewHTML = '<h3>Náhled na test:</h3>';
    questions.forEach((q, index) => {
        previewHTML += `
            <div>
                <p><strong>Otázka ${index + 1}:</strong> ${q.text}</p>
                <label>Odpověď:</label>
                <input type="text" name="answer_${index}" placeholder="Zadejte odpověď">
            </div>
        `;
    });

    previewHTML += `
        <button type="button" onclick="showResults()">Vyhodnotit test</button>
    `;
    document.getElementById('testContent').innerHTML = previewHTML;
}


function evaluateTest() {
    const testForm = document.getElementById('testForm');
    const formElements = testForm.elements;
    let totalScore = 0;
    let totalPoints = 0;
    const resultsContainer = document.getElementById('resultsContainer');

    // Vyprázdnit předchozí výsledky, pokud nějaké jsou
    resultsContainer.innerHTML = '';

    // Shromáždíme otázky z formuláře
    const questions = gatherQuestions();

    // Přejít přes všechny otázky a zkontrolovat odpovědi
    questions.forEach((question, index) => {
        const userAnswer = formElements[`answer_${index}`].value.trim();
        totalPoints += question.points;

        // Pokud je odpověď správná, přičteme skóre
        if (userAnswer.toLowerCase() === question.correctAnswer.toLowerCase()) {
            totalScore += question.points;
        }

        // Vytvořit část výsledku pro každou otázku
        const result = document.createElement('div');
        result.classList.add('result');
        result.innerHTML = `  
            <strong>Otázka ${index + 1}:</strong> ${question.text} <br>
            Vaše odpověď: ${userAnswer} <br>
            ${userAnswer.toLowerCase() === question.correctAnswer.toLowerCase() ? 
                '<span style="color: green;">Správně</span>' : 
                `<span style="color: red;">Špatně</span>`} <br>
            <strong>Body za tuto otázku:</strong> ${question.points} <br><br>
        `;
        resultsContainer.appendChild(result);
    });

    // Zobrazení celkového výsledku
    const finalResult = document.createElement('div');
    finalResult.classList.add('final-result');
    finalResult.innerHTML = `
        <h2>Výsledky testu:</h2>
        <p>Celkové skóre: ${totalScore} / ${totalPoints} bodů</p>
        <p>Procento správných odpovědí: ${(totalScore / totalPoints * 100).toFixed(2)}%</p>
    `;
    resultsContainer.appendChild(finalResult);
}



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



    // Funkce pro odeslání testu
    function submitTest() {
        const answers = getAnswers();
        const score = calculateScore(answers);
        const grade = getGrade(score);

        document.getElementById('scoreDisplay').innerText = `Počet bodů: ${score}`;
        document.getElementById('gradeDisplay').innerText = `Známka: ${grade}`;
        document.getElementById('resultsSection').style.display = 'block';
    }

    // Funkce pro získání odpovědí
    function getAnswers() {
        const answers = [];
        const questions = document.querySelectorAll('.question-wrapper');
        questions.forEach((question, index) => {
            const answer = document.querySelector(`input[name="question${index + 1}_answer"]:checked`);
            if (answer) {
                answers.push(answer.value);
            }
        });
        return answers;
    }

    // Funkce pro výpočet skóre
    function calculateScore(answers) {
        totalPoints = 0;
        correctAnswers = 0;

        answers.forEach(answer => {
            if (answer === 'Ano') {
                totalPoints += 1;
                correctAnswers += 1;
            }
        });

        return correctAnswers;
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

    // Funkce pro získání otázek
    function getQuestions() {
        const questions = [];
        const questionElements = document.querySelectorAll('.question-wrapper');
        questionElements.forEach((questionElement, index) => {
            const questionText = questionElement.querySelector(`input[name="question${index + 1}_text"]`).value;
            const points = parseInt(questionElement.querySelector(`input[name="question${index + 1}_points"]`).value);
            questions.push({
                text: questionText,
                points: points
            });
        });
        return questions;
    }

    function displayResults(correctAnswers, userAnswers) {
    const correctDisplay = document.getElementById('correctAnswersDisplay');
    const wrongDisplay = document.getElementById('wrongAnswersDisplay');
    let correctHTML = '';
    let wrongHTML = '';
    let correctCount = 0;
    let wrongCount = 0;

    correctAnswers.forEach((answer, index) => {
        const userAnswer = userAnswers[index];
        if (userAnswer.toLowerCase() === answer.toLowerCase()) {
            correctHTML += `<span class="correct">Otázka ${index + 1}: Správně - Odpověď: ${userAnswer}</span><br>`;
            correctCount++;
        } else {
            wrongHTML += `<span class="wrong">Otázka ${index + 1}: Špatně - Odpověď: ${userAnswer} (Správně: ${answer})</span><br>`;
            wrongCount++;
        }
    });

    correctDisplay.innerHTML = `Úplně správně: ${correctCount} otázek<br>${correctHTML}`;
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


function saveTestToJson() {
    const testName = document.getElementById('name').value; // Získání názvu testu
    const testDescription = document.getElementById('description').value; // Získání popisu testu
    const questions = gatherQuestions(); // Funkce pro získání všech otázek

    const testData = {
        name: testName,
        description: testDescription,
        questions: questions
    };

    const blob = new Blob([JSON.stringify(testData, null, 2)], { type: 'application/json' });
    saveAs(blob, `${testName}.json`);
}

function saveTestToHtml() {
    const testName = document.getElementById('name').value; // Získání názvu testu
    const testDescription = document.getElementById('description').value; // Získání popisu testu
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
                </style>
            </head>
            <body>
                <h1>${testName}</h1>
                <p>${testDescription}</p>
                <form id="testForm">
    `;

    // Generování otázek
    questions.forEach((question, index) => {
        htmlContent += `
            <div class="question">
                <p><strong>Otázka ${index + 1}:</strong> ${question.text}</p>
                <label for="answer_${index}">Odpověď:</label>
                <input type="text" name="answer_${index}" placeholder="Zadejte odpověď">
            </div>
        `;
    });

    htmlContent += `
            <button type="button" onclick="evaluateTest()">Vyhodnotit test</button>
            <div id="resultsContainer"></div> <!-- Kontejner pro výsledky -->
        </form>
        </body>
    </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    saveAs(blob, `${testName}.html`);
}



function saveTest(type) {
    const testName = document.getElementById('testName').value;
    const testDescription = document.getElementById('testDescription').value;
    const testImage = document.getElementById('testImage').files[0]; // získání obrázku
    const isPublic = (type === 'verejne_testy') ? true : false;  // Pokud je 'verejne_testy', test bude veřejný

    const formData = new FormData();
    formData.append('name', testName);
    formData.append('description', testDescription);
    formData.append('image', testImage);
    formData.append('is_public', isPublic);

    // Odeslání dat na server pomocí AJAX
    fetch('/api/save_test/', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Test byl úspěšně uložen.');
        } else {
            alert('Nastala chyba při ukládání testu.');
        }
    })
    .catch(error => {
        alert('Došlo k chybě při komunikaci se serverem.');
    });
}

function saveTestToXml() {
    const testName = document.getElementById('name').value.trim(); // Název testu
    const testDescription = document.getElementById('description').value.trim(); // Popis testu
    const questions = gatherQuestions(); // Získání všech otázek

    // Základní struktura XML
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<quiz>
    <!-- Popis a název testu -->
    <question type="category">
        <category>
            <text>$course$/Default for ${testName}</text>
        </category>
    </question>`;

    questions.forEach((question, index) => {
        xmlContent += `
    <question type="shortanswer">
        <name>
            <text>Otázka ${index + 1}</text>
        </name>
        <questiontext format="html">
            <text><![CDATA[${question.text}]]></text>
        </questiontext>
        <generalfeedback format="html">
            <text><![CDATA[]]></text>
        </generalfeedback>
        <defaultgrade>${question.points}</defaultgrade>
        <penalty>0.3333333</penalty>
        <hidden>0</hidden>`;

        // Definice správné odpovědi
        xmlContent += `
        <answer fraction="100" format="html">
            <text><![CDATA[${question.correctAnswer}]]></text>
            <feedback>
                <text>Správná odpověď!</text>
            </feedback>
        </answer>`;

        // Pokud existují nesprávné odpovědi
        question.incorrectAnswers.forEach(incorrectAnswer => {
            xmlContent += `
        <answer fraction="0" format="html">
            <text><![CDATA[${incorrectAnswer}]]></text>
            <feedback>
                <text>Nesprávná odpověď.</text>
            </feedback>
        </answer>`;
        });

        xmlContent += `
    </question>`;
    });

    xmlContent += `
</quiz>`;

    // Uložení XML souboru
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    saveAs(blob, `${testName}.xml`);
}
