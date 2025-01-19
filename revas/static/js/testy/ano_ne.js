  let questionCount = 0;
    let timerInterval;
    let totalTime = 0;
    let timeRemaining = 0;
    let totalPoints = 0;
    let correctAnswers = 0;
    let userAnswers = [];



    // Funkce pro přidání otázky
    function addQuestion() {
        questionCount++;
        const questionHTML = `
            <div class="question-wrapper" id="question${questionCount}">
                <label>Otázka ${questionCount}:</label>
                <input type="text" name="question${questionCount}_text" placeholder="Zadejte otázku" required>
                <div class="error-message" id="errorQuestion${questionCount}">Tato otázka musí mít text.</div>
                <label>Správná odpověď:</label>
                <select name="question${questionCount}_correct_answer">
                    <option value="ano">Ano</option>
                    <option value="ne">Ne</option>
                </select>
                <label>Body za tuto otázku:</label>
                <input type="number" name="question${questionCount}_points" min="1" value="1" required>
                <button type="button" onclick="deleteQuestion(${questionCount})">Smazat otázku</button>
            </div>
        `;
        document.getElementById('questionsContainer').insertAdjacentHTML('beforeend', questionHTML);
    }

function gatherQuestions() {
    const questions = [];
    const questionElements = document.querySelectorAll('.question-wrapper');

    questionElements.forEach((questionElement, index) => {
        const questionText = questionElement.querySelector(`input[name="question${index + 1}_text"]`)?.value.trim();
        const correctAnswer = questionElement.querySelector(`select[name="question${index + 1}_correct_answer"]`)?.value;
        const points = parseInt(questionElement.querySelector(`input[name="question${index + 1}_points"]`)?.value);

        if (!questionText || isNaN(points) || (correctAnswer !== "ano" && correctAnswer !== "ne")) {
            return;
        }

        questions.push({
            text: questionText,
            correctAnswer: correctAnswer,
            points: points
        });
    });

    return questions;
}

      // Funkce pro zobrazení testu a přidání odpovědí
function previewTest() {
    // Validace formuláře před zobrazením preview
    if (!validateForm()) {
        return; // Pokud formulář není validní, test se nezobrazí
    }

    const questions = gatherQuestions();

    if (questions.length === 0) {
        document.getElementById('errorContainer').innerText = "Přidejte alespoň jednu otázku.";
        document.getElementById('errorContainer').style.display = 'block';
        return;
    }

    // Vytvoření HTML pro náhled testu
    let previewHTML = '<h3>Náhled na test:</h3>';
    questions.forEach((q, index) => {
        previewHTML += `
            <div>
                <p><strong>Otázka ${index + 1}:</strong> ${q.text}</p>
                <label><input type="radio" name="preview_question${index}" value="ano"> Ano</label>
                <label><input type="radio" name="preview_question${index}" value="ne"> Ne</label>
            </div>
        `;
    });

    // Přidání tlačítka pro ukončení testu
    previewHTML += `
        <button type="button" onclick="endTest()">Konec</button>
    `;

    // Zobrazení náhledu testu
    document.getElementById('testContent').innerHTML = previewHTML;
    document.getElementById('previewTest').style.display = 'block';
}

        // Funkce pro vyhodnocení testu
function evaluateTest() {
    const questions = gatherQuestions();
    const userAnswers = [];

    // Pro každou otázku vybereme odpověď uživatele
    questions.forEach((q, index) => {
        const userAnswer = document.querySelector(`[name="preview_question${index}"]:checked`);
        if (userAnswer) {
            userAnswers.push(userAnswer.value);
        } else {
            userAnswers.push(null); // Pokud uživatel nevybere odpověď, přidáme null
        }
    });

    // Vypočítáme skóre
    const score = calculateScore(userAnswers, questions);
    const grade = getGrade(score);

    // Zobrazíme výsledek
    displayResults(questions, userAnswers, score, grade);
}



      // Funkce pro smazání otázky
    function deleteQuestion(questionId) {
        const questionElement = document.getElementById(`question${questionId}`);
        questionElement.remove();
        reNumberQuestions();
    }

    // Funkce pro přepočítání čísel otázek
    function reNumberQuestions() {
        const questions = document.querySelectorAll('.question-wrapper');
        questions.forEach((question, index) => {
            const questionNumber = index + 1;
            question.querySelector('label').innerText = `Otázka ${questionNumber}:`;
            question.id = `question${questionNumber}`;
        });
        questionCount = questions.length;
    }

    // Funkce pro validaci formuláře
function validateForm() {
    const testName = document.getElementById('testName').value;
    const grade1 = parseInt(document.getElementById('grade1').value);
    const grade2 = parseInt(document.getElementById('grade2').value);
    const grade3 = parseInt(document.getElementById('grade3').value);
    const grade4 = parseInt(document.getElementById('grade4').value);
    const grade5 = parseInt(document.getElementById('grade5').value);
    const enableTimer = document.getElementById('enableTimer').checked;
    const timerValue = document.getElementById('timer').value;

    // Kontrola název testu
    if (!testName) {
        document.getElementById('errorContainer').innerText = 'Název testu je povinný!';
        document.getElementById('errorContainer').style.display = 'block';
        return false;
    }

    // Kontrola známek
    if (grade1 <= grade2 || grade2 <= grade3 || grade3 <= grade4 || grade4 <= grade5) {
        document.getElementById('errorContainer').innerText = 'Známky musí být ve správném pořadí a musí být reálné!';
        document.getElementById('errorContainer').style.display = 'block';
        return false;
    }

    // Kontrola časovače
    if (enableTimer && !timerValue) {
        document.getElementById('errorContainer').innerText = 'Pokud povolíte časovač, musíte zadat dobu!';
        document.getElementById('errorContainer').style.display = 'block';
        return false;
    }

    // Kontrola otázek
    const questions = document.querySelectorAll('.question-wrapper');
    if (questions.length < 1) {
        document.getElementById('errorContainer').innerText = 'Musíte přidat alespoň jednu otázku!';
        document.getElementById('errorContainer').style.display = 'block';
        return false;
    }

    // Kontrola každé otázky
    for (let i = 0; i < questions.length; i++) {
        const questionText = questions[i].querySelector('input[type="text"]').value;
        const answers = questions[i].querySelector('select').value;
        if (!questionText) {
            document.getElementById('errorContainer').innerText = `Otázka ${i+1} nemá text!`;
            document.getElementById('errorContainer').style.display = 'block';
            return false;
        }

        if (answers.length < 2) {
            document.getElementById('errorContainer').innerText = `Otázka ${i+1} musí mít alespoň dvě možnosti odpovědí!`;
            document.getElementById('errorContainer').style.display = 'block';
            return false;
        }
    }

    return true;
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
    function calculateScore() {
        let score = 0;
        userAnswers.forEach((answer, index) => {
            if (answer === 'ano' && questions[index].correctAnswer === 'ano') {
                score += questions[index].points;
            } else if (answer === 'ne' && questions[index].correctAnswer === 'ne') {
                score += questions[index].points;
            }
        });
        return score;
    }

   // Funkce pro získání hodnocení
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

    // Funkce pro zobrazení výsledků
function displayResults(questions, userAnswers, score, grade) {
    const correctAnswersDisplay = document.getElementById('correctAnswersDisplay');
    const partiallyCorrectDisplay = document.getElementById('partiallyCorrectDisplay');
    const wrongAnswersDisplay = document.getElementById('wrongAnswersDisplay');

    let correctHTML = '';
    let partiallyCorrectHTML = '';
    let wrongHTML = '';

    let correctCount = 0;
    let partiallyCorrectCount = 0;
    let wrongCount = 0;

    // Pro každou otázku zkontrolujeme odpověď
    questions.forEach((q, index) => {
        const correctAnswer = q.correctAnswer; // Správná odpověď
        const userAnswer = userAnswers[index]; // Odpověď uživatele

        // Kontrola odpovědi
        if (userAnswer === correctAnswer) {
            correctHTML += `<span class="correct">Otázka ${index + 1}: Správně - ${q.text}</span><br>`;
            correctCount++;
        } else if (userAnswer !== null) {
            wrongHTML += `<span class="wrong">Otázka ${index + 1}: Špatně - ${q.text}</span><br>`;
            wrongCount++;
        } else {
            partiallyCorrectHTML += `<span class="partially-correct">Otázka ${index + 1}: Nezodpovězeno</span><br>`;
            partiallyCorrectCount++;
        }
    });

    // Zobrazení výsledků
    correctAnswersDisplay.innerHTML = `Správně: ${correctCount} otázek<br>${correctHTML}`;
    partiallyCorrectDisplay.innerHTML = `Chybně: ${wrongCount} otázek<br>${wrongHTML}`;
    wrongAnswersDisplay.innerHTML = `Nezodpovězeno: ${partiallyCorrectCount} otázek<br>${partiallyCorrectHTML}`;

    document.getElementById('scoreDisplay').innerText = `Počet bodů: ${score}`;
    document.getElementById('gradeDisplay').innerText = `Známka: ${grade}`;
    document.getElementById('resultsSection').style.display = 'block';
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

  // Funkce pro výpočet skóre
function calculateScore(userAnswers, questions) {
    let score = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === questions[index].correctAnswer) {
            score++;
        }
    });
    return score;
}

 // Funkce pro ukončení testu a vyhodnocení
    function endTest() {
        const questions = gatherQuestions();
        userAnswers = [];
        let score = 0;

        // Pro každou otázku zkontrolujeme odpověď
        questions.forEach((q, index) => {
            const userAnswer = document.querySelector(`[name="preview_question${index}"]:checked`);
            if (userAnswer) {
                userAnswers.push(userAnswer.value);
                if (userAnswer.value === q.correctAnswer) {
                    score += q.points; // Přičteme body za správnou odpověď
                }
            } else {
                userAnswers.push(null); // Pokud uživatel nevybere odpověď, přidáme null
            }
        });

        // Získáme hodnocení
        const grade = getGrade(score);

        // Zobrazíme výsledek
        displayResults(questions, userAnswers, score, grade);
    }

function exportToHTML() {
    const questions = gatherQuestions();
    const testName = document.getElementById('testName').value;

    if (questions.length === 0 || !testName) {

        return;
    }

    let htmlContent = '<!DOCTYPE html>\n<html lang="cs">\n<head>\n<title>' + testName + '</title>\n</head>\n<body>\n';
    htmlContent += '<h1>' + testName + '</h1>\n';
    questions.forEach((q, index) => {
        htmlContent += `<h2>Otázka ${index + 1}</h2>\n`;
        htmlContent += `<p>${q.text}</p>\n`;
        htmlContent += `<p><strong>Správná odpověď:</strong> ${q.correctAnswer}</p>\n`;
    });
    htmlContent += '</body>\n</html>';

    // Vytvoření souboru pro stažení
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${testName}_test.html`;
    link.click();
}



function exportToMoodleXML() {
    const questions = gatherQuestions();
    const testName = document.getElementById('testName').value;

    if (questions.length === 0 || !testName) {
        alert("Musíte přidat název testu a alespoň jednu otázku.");
        return;
    }

    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmlContent += '<quiz>\n';

    questions.forEach((q, index) => {
        // Začátek otázky
        xmlContent += '  <question type="truefalse">\n';
        xmlContent += '    <name>\n';
        xmlContent += `      <text>Otázka ${index + 1}</text>\n`; // Unikátní název otázky
        xmlContent += '    </name>\n';
        xmlContent += '    <questiontext format="html">\n';
        xmlContent += `      <text><![CDATA[${q.text}]]></text>\n`; // Text otázky
        xmlContent += '    </questiontext>\n';

        // Odpověď "Ano" (True)
        xmlContent += `    <answer fraction="${q.correctAnswer === 'ano' ? 100 : 0}">\n`;
        xmlContent += '      <text>true</text>\n'; // Moodle očekává "true" místo "Ano"
        xmlContent += '      <feedback>\n';
        xmlContent += '        <text><![CDATA[Správná odpověď: Ano]]></text>\n'; // Zpětná vazba
        xmlContent += '      </feedback>\n';
        xmlContent += '    </answer>\n';

        // Odpověď "Ne" (False)
        xmlContent += `    <answer fraction="${q.correctAnswer === 'ne' ? 100 : 0}">\n`;
        xmlContent += '      <text>false</text>\n'; // Moodle očekává "false" místo "Ne"
        xmlContent += '      <feedback>\n';
        xmlContent += '        <text><![CDATA[Správná odpověď: Ne]]></text>\n'; // Zpětná vazba
        xmlContent += '      </feedback>\n';
        xmlContent += '    </answer>\n';

        // Konec otázky
        xmlContent += '  </question>\n';
    });

    xmlContent += '</quiz>';

    // Vytvoření souboru pro stažení
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${testName}_test.xml`; // Název souboru s testem
    link.click();
}





function exportToJSON() {
    const questions = gatherQuestions();
    const testName = document.getElementById('testName').value;

    if (questions.length === 0 || !testName) {

        return;
    }

    const testData = {
        name: testName,
        questions: questions
    };

    // Vytvoření souboru pro stažení
    const blob = new Blob([JSON.stringify(testData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${testName}_test.json`;
    link.click();
}