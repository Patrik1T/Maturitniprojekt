let questionCount = 0;
let timerInterval;
let totalTime = 0;
let timeRemaining = 0;

// Funkce pro přidání otázky
function addQuestion() {
    questionCount++;
    const questionTemplate = `
        <div class="question-wrapper" id="question${questionCount}">
            <div class="question">
                <label for="question${questionCount}_text">Otázka ${questionCount}:</label>
                <textarea name="question${questionCount}_text" placeholder="Zadejte otázku nebo instrukce pro odpověď" required></textarea>
            </div>
            <div class="answers">
                <label for="question${questionCount}_answer_text">Zadejte odpověď (text):</label>
                <textarea name="question${questionCount}_answer_text" placeholder="Odpověď" required></textarea>
                
                <label for="question${questionCount}_answer_file">Nahrát soubor:</label>
                <div class="file-drop" id="fileDrop${questionCount}" ondrop="handleFileDrop(event, ${questionCount})" ondragover="event.preventDefault()">
                    Přetáhněte soubor sem nebo klikněte pro nahrání
                </div>
                <input type="file" name="question${questionCount}_answer_file" style="display:none;" onchange="handleFileSelect(event, ${questionCount})" />
            </div>
            <button type="button" class="delete-question-btn" onclick="deleteQuestion(${questionCount})">Smazat otázku</button>
        </div>`;
    document.getElementById('questionsContainer').insertAdjacentHTML('beforeend', questionTemplate);
}

// Funkce pro smazání otázky
function deleteQuestion(questionId) {
    const questionElement = document.getElementById(`question${questionId}`);
    questionElement.remove();
}

// Funkce pro zobrazení testu
function previewTest() {
    const testName = document.getElementById('testName').value;
    const questions = getQuestions();

    if (!testName || questions.length === 0) {
        alert('Přidejte otázky a název testu');
        return;
    }

    let testContent = `<h2>${testName}</h2><form id="previewForm">`;

    questions.forEach((question, index) => {
        testContent += `
            <div class="question">
                <p><strong>Otázka ${index + 1}:</strong> ${question.text}</p>
                <p><strong>Odpověď:</strong> ${question.answerText}</p>
                <p><strong>Soubory:</strong> ${question.answerFile ? 'Soubor nahrán' : 'Žádný soubor'}</p>
            </div>`;
    });

    testContent += `<button type="button" onclick="submitTest()">Hotovo</button></form>`;
    document.getElementById('testContent').innerHTML = testContent;
    document.getElementById('previewTest').style.display = 'block';

    // Spustí časovač, pokud je povolen
    if (document.getElementById('enableTimer').checked) {
        startTimer();
    }
}

// Funkce pro získání všech otázek z formuláře
function getQuestions() {
    const questions = [];
    for (let i = 1; i <= questionCount; i++) {
        const questionText = document.querySelector(`[name="question${i}_text"]`).value;
        const answerText = document.querySelector(`[name="question${i}_answer_text"]`).value;
        const answerFile = document.querySelector(`[name="question${i}_answer_file"]`).files[0];

        if (questionText && (answerText || answerFile)) {
            questions.push({ text: questionText, answerText, answerFile });
        }
    }
    return questions;
}

// Funkce pro uložení testu
function saveTest(testType) {
    const testName = document.getElementById('testName').value;
    const questions = getQuestions();

    if (!testName || questions.length === 0) {
        alert('Přidejte otázky a název testu');
        return;
    }

    const testData = {
        testName,
        questions,
        timer: document.getElementById('timer').value,
        timerEnabled: document.getElementById('enableTimer').checked,
    };

    console.log(testData);  // Uložení testu do konzole, přidejte backend logiku pro uložení
}

// Funkce pro uložení testu jako HTML
function saveAsHtml() {
    const testName = document.getElementById('testName').value;
    const questions = getQuestions();

    if (!testName || questions.length === 0) {
        alert('Přidejte otázky a název testu');
        return;
    }

    let htmlContent = `<html><head><title>${testName}</title></head><body><h1>${testName}</h1><ul>`;

    questions.forEach((question, index) => {
        htmlContent += `<li><strong>Otázka ${index + 1}:</strong> ${question.text}</li>`;
        htmlContent += `<li><strong>Odpověď:</strong> ${question.answerText}</li>`;
        htmlContent += `<li><strong>Soubory:</strong> ${question.answerFile ? 'Soubor nahrán' : 'Žádný soubor'}</li>`;
    });

    htmlContent += `</ul></body></html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${testName}.html`;
    link.click();
}

// Funkce pro výběr souboru
function handleFileSelect(event, questionId) {
    const file = event.target.files[0];
    const fileDropElement = document.getElementById(`fileDrop${questionId}`);
    fileDropElement.textContent = file ? file.name : 'Přetáhněte soubor sem nebo klikněte pro nahrání';
}

// Funkce pro přetahování souboru
function handleFileDrop(event, questionId) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const fileInput = document.querySelector(`[name="question${questionId}_answer_file"]`);
    fileInput.files = event.dataTransfer.files;

    const fileDropElement = document.getElementById(`fileDrop${questionId}`);
    fileDropElement.textContent = file ? file.name : 'Přetáhněte soubor sem nebo klikněte pro nahrání';
}

// Funkce pro start časovače
function startTimer() {
    timeRemaining = document.getElementById('timer').value * 60;
    totalTime = timeRemaining;
    document.getElementById('timerDisplay').style.display = 'block';
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timerCount').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        alert('Čas vypršel!');
    }
    timeRemaining--;
}

// Funkce pro ukončení testu
function endTest() {
    document.getElementById('previewTest').style.display = 'none';
    alert('Test byl ukončen.');
}
