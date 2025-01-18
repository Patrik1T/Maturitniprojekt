// Function to save the test as Moodle XML
function saveTestToXml() {
    const testName = document.getElementById('testName').value;
    const testDescription = document.getElementById('testDescription').value;
    const questions = gatherQuestions();

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
            <text>${question.text}</text>
        </questiontext>`;

        // Answers (you may add additional logic for correct answers, feedback, etc.)
        question.answers.forEach(answer => {
            xmlContent += `
        <answer>
            <text>${answer}</text>
            <feedback>
                <text>Správná odpověď!</text>
            </feedback>
        </answer>`;
        });

        xmlContent += `
    </question>`;
    });

    xmlContent += `
</quiz>`;

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    saveAs(blob, `${testName}.xml`);
}

// Function to save the test as JSON
function saveTestToJson() {
    const testName = document.getElementById('testName').value;
    const testDescription = document.getElementById('testDescription').value;
    const questions = gatherQuestions();

    const testData = {
        name: testName,
        description: testDescription,
        questions: questions
    };

    const blob = new Blob([JSON.stringify(testData, null, 2)], { type: 'application/json' });
    saveAs(blob, `${testName}.json`);
}

// Function to save the test as HTML
function saveTestToHtml() {
    const testName = document.getElementById('testName').value;
    const testDescription = document.getElementById('testDescription').value;
    const questions = gatherQuestions();

    let htmlContent = `
    <html>
        <head>
            <title>${testName}</title>
            <style>
                body { font-family: Arial, sans-serif; }
                .question { margin-bottom: 20px; }
                .question label { font-weight: bold; }
                .result { margin-top: 20px; }
            </style>
        </head>
        <body>
            <h1>${testName}</h1>
            <p>${testDescription}</p>
            <form id="testForm">`;

    questions.forEach((question, index) => {
        htmlContent += `
            <div class="question">
                <p><strong>Otázka ${index + 1}:</strong> ${question.text}</p>
                <div class="answers">
                    ${question.answers.map((answer, idx) => `
                        <p><textarea placeholder="Zadejte odpověď" required>${answer}</textarea></p>
                    `).join('')}
                </div>
            </div>`;
    });

    htmlContent += `
            <button type="button" onclick="evaluateTest()">Vyhodnotit test</button>
            <div id="resultsContainer"></div>
        </form>
        </body>
    </html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    saveAs(blob, `${testName}.html`);
}
function gatherQuestions() {
    const questions = [];
    const questionsContainer = document.getElementById('questionsContainer');
    const questionWrappers = questionsContainer.querySelectorAll('.question-wrapper');

    questionWrappers.forEach(questionWrapper => {
        const questionText = questionWrapper.querySelector('textarea').value;
        const answers = [];
        const answerElements = questionWrapper.querySelectorAll('.answers textarea');

        answerElements.forEach(answerElement => {
            answers.push(answerElement.value);
        });

        questions.push({
            text: questionText,
            answers: answers
        });
    });

    return questions;
}

let questionCount = 0;

function addQuestion() {
    questionCount++;
    const questionHTML = `
        <div class="question-wrapper" id="question${questionCount}">
            <label>Otázka ${questionCount}:</label>
            
            <!-- Textová otázka -->
            <textarea name="question${questionCount}_text" placeholder="Zadejte otázku" required></textarea>
            <div class="error-message" id="errorQuestion${questionCount}" style="display: none;">Tato otázka musí mít text.</div>

            <!-- Souborová otázka -->
            <label for="question${questionCount}_file">Přidat soubor k otázce:</label>
            <input type="file" name="question${questionCount}_file" accept="image/*, .pdf, .doc, .docx, .txt">

            <label>Body:</label>
            <input type="number" name="question${questionCount}_points" min="1" value="1">

            <!-- Odpovědi pro tuto otázku -->
            <div class="answers" id="answers${questionCount}">
                <div class="answer">
                    <!-- Textová odpověď -->
                    <textarea placeholder="Zadejte textovou odpověď" required></textarea>
                    <button type="button" onclick="removeTextAnswer(${questionCount}, 1)">Smazat textovou odpověď</button>
                </div>

                <div class="answer">
                    <!-- Souborová odpověď -->
                    <label for="question${questionCount}_answer_file1">Přidat soubor k odpovědi:</label>
                    <input type="file" name="question${questionCount}_answer_file1" accept="image/*, .pdf, .doc, .docx, .txt">
                    <button type="button" onclick="removeFileAnswer(${questionCount}, 1)">Smazat souborovou odpověď</button>
                </div>
            </div>

            <button type="button" onclick="addTextAnswer(${questionCount})">Přidat textovou odpověď</button>
            <button type="button" onclick="addFileAnswer(${questionCount})">Přidat souborovou odpověď</button>
            <button type="button" onclick="deleteQuestion(${questionCount})">Smazat otázku</button>
        </div>
    `;
    document.getElementById('questionsContainer').insertAdjacentHTML('beforeend', questionHTML);
}





function addTextAnswer(questionId) {
    const answersContainer = document.getElementById(`answers${questionId}`);
    const newAnswerHTML = `
        <div class="answer">
            <textarea placeholder="Zadejte textovou odpověď" required></textarea>
            <button type="button" onclick="removeTextAnswer(${questionId}, ${answersContainer.querySelectorAll('.answer').length})">Smazat textovou odpověď</button>
        </div>
    `;
    answersContainer.insertAdjacentHTML('beforeend', newAnswerHTML);
}

function addFileAnswer(questionId) {
    const answersContainer = document.getElementById(`answers${questionId}`);
    const newFileAnswerHTML = `
        <div class="answer">
            <label for="question${questionId}_answer_file${answersContainer.querySelectorAll('.answer').length}">Přidat soubor k odpovědi:</label>
            <input type="file" name="question${questionId}_answer_file${answersContainer.querySelectorAll('.answer').length}" accept="image/*, .pdf, .doc, .docx, .txt">
            <button type="button" onclick="removeFileAnswer(${questionId}, ${answersContainer.querySelectorAll('.answer').length})">Smazat souborovou odpověď</button>
        </div>
    `;
    answersContainer.insertAdjacentHTML('beforeend', newFileAnswerHTML);
}



function removeTextAnswer(questionId, answerId) {
    const answersContainer = document.getElementById(`answers${questionId}`);
    const answerToRemove = answersContainer.querySelectorAll('.answer')[answerId - 1];
    if (answerToRemove) {
        answerToRemove.remove();
    }
}

function removeFileAnswer(questionId, answerId) {
    const answersContainer = document.getElementById(`answers${questionId}`);
    const answerToRemove = answersContainer.querySelectorAll('.answer')[answerId - 1];
    if (answerToRemove) {
        answerToRemove.remove();
    }
}


function deleteQuestion(questionId) {
    const questionWrapper = document.getElementById(`question${questionId}`);
    if (questionWrapper) {
        questionWrapper.remove();
    }
}

// Funkce pro uložení testu
function saveTest(type) {
    // Implementujte uložení testu podle typu (profil, veřejné testy atd.)
    alert(`Test uložen jako ${type}`);
}

function previewTest() {
    const testName = document.getElementById('testName').value;
    const testDescription = document.getElementById('testDescription').value;
    const testContent = document.getElementById('testContent');

    // Vytvoření hlavičky pro náhled
    testContent.innerHTML = `<h3>${testName}</h3><p>${testDescription}</p>`;

    // Přidání krátkého textu do náhledu
    const shortText = "Tento test obsahuje otázky na různá témata. Vyberte správné odpovědi.";
    testContent.innerHTML += `<p><strong>Úvodní text:</strong> ${shortText}</p>`;

    // Přidání otázek do náhledu
    const questionsContainer = document.getElementById('questionsContainer');
    const questions = questionsContainer.querySelectorAll('.question-wrapper');

    questions.forEach((questionWrapper, index) => {
        const questionText = questionWrapper.querySelector('textarea[name^="question"]').value;  // Text otázky
        const answers = questionWrapper.querySelectorAll('.answers textarea');  // Odpovědi (text)
        const files = questionWrapper.querySelectorAll('.answers input[type="file"]');  // Soubory

        // Zobrazení textových odpovědí (a umožnění editace)
        const answersHTML = Array.from(answers).map(answer => ` 
            <p><textarea placeholder="Zadejte textovou odpověď" required>${answer.value}</textarea></p>
        `).join('');

        // Zobrazení souborů, pokud existují, a umožnění jejich výběru
        const filesHTML = Array.from(files).map((fileInput, idx) => {
            if (fileInput.files.length > 0) {
                return `<p><label>Soubor: </label>${fileInput.files[0].name}</p>`;
            }
            return `
                <p>
                    <label for="file${index}-${idx}">Přidejte soubor k odpovědi:</label>
                    <input type="file" id="file${index}-${idx}" accept="image/*, .pdf, .doc, .docx, .txt">
                </p>
            `;
        }).join('');

        // Přiřazení otázek, odpovědí a souborů do HTML
        testContent.innerHTML += `
            <div class="question-preview" style="margin-bottom: 20px;">
                <h4>Otázka ${index + 1}:</h4>
                <p><textarea placeholder="Zadejte otázku" style="width: 100%; height: 100px;" required>${questionText}</textarea></p>
                <div class="answers-preview" style="margin-top: 10px;">${answersHTML}</div>
                <div class="files-preview" style="margin-top: 10px;">${filesHTML}</div>
            </div>
        `;
    });

    // Zobrazení náhledu testu
    document.getElementById('previewTest').style.display = 'block';
}




// Funkce pro shromáždění všech otázek a odpovědí
function gatherQuestions() {
    const questions = [];
    const questionsContainer = document.getElementById('questionsContainer');
    const questionWrappers = questionsContainer.querySelectorAll('.question-wrapper');

    questionWrappers.forEach(questionWrapper => {
        const questionText = questionWrapper.querySelector('textarea').value;
        const answers = [];
        const answerElements = questionWrapper.querySelectorAll('.answers textarea');

        answerElements.forEach(answerElement => {
            answers.push(answerElement.value);
        });

        questions.push({
            text: questionText,
            answers: answers
        });
    });

    return questions;
}


  // Funkce pro ukončení testu
    function endTest() {
        // Skrytí formuláře pro vytváření testu
        document.getElementById('testForm').style.display = 'none';
        document.getElementById('previewTest').style.display = 'none';

        // Zobrazení výsledků
        showResults();
    }

    // Funkce pro zobrazení výsledků testu
    function showResults() {
    const testName = document.getElementById('testName').value;
    const testDescription = document.getElementById('testDescription').value;
    const questionsContainer = document.getElementById('questionsContainer');
    const questions = questionsContainer.querySelectorAll('.question-wrapper');

    let resultsHTML = `<h2>Výsledky testu: ${testName}</h2>`;
    resultsHTML += `<p>Popis: ${testDescription}</p>`;

    questions.forEach((questionWrapper, index) => {
        const questionText = questionWrapper.querySelector('textarea[name^="question"]').value;
        resultsHTML += `<p><strong>Otázka ${index + 1}:</strong> ${questionText}</p>`;

        const answers = questionWrapper.querySelectorAll('.answers textarea');
        answers.forEach((answer, answerIndex) => {
            resultsHTML += `<p>Odpověď ${answerIndex + 1}: ${answer.value}</p>`;
        });

        // Zobrazení souborů
        const fileAnswers = questionWrapper.querySelectorAll('.answers input[type="file"]');
        fileAnswers.forEach(fileInput => {
            if (fileInput.files.length > 0) {
                resultsHTML += `<p>Soubory k odpovědi: ${fileInput.files[0].name}</p>`;
            }
        });
    });

    // Zobrazení výsledků
    document.getElementById('resultsSection').innerHTML = resultsHTML;
    document.getElementById('resultsSection').style.display = 'block';
}

// Funkce pro uložení testu jako Moodle XML
function saveTestToXml() {
    const testName = document.getElementById('testName').value;
    const testDescription = document.getElementById('testDescription').value;
    const questions = gatherQuestions();

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
            <text>${question.text}</text>
        </questiontext>`;

        question.answers.forEach(answer => {
            xmlContent += `
        <answer>
            <text>${answer}</text>
            <feedback>
                <text>Správná odpověď!</text>
            </feedback>
        </answer>`;
        });

        xmlContent += `
    </question>`;
    });

    xmlContent += `
</quiz>`;

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    saveAs(blob, `${testName}.xml`);
}

// Funkce pro uložení testu jako JSON
function saveTestToJson() {
    const testName = document.getElementById('testName').value;
    const testDescription = document.getElementById('testDescription').value;
    const questions = gatherQuestions();
    const testImage = document.getElementById('testImage').files[0]; // Uložení souboru obrázku

    const testData = {
        name: testName,
        description: testDescription,
        image: testImage ? testImage.name : null, // Přidání obrázku (pokud existuje)
        questions: questions
    };

    const blob = new Blob([JSON.stringify(testData, null, 2)], { type: 'application/json' });
    saveAs(blob, `${testName}.json`);
}

// Funkce pro uložení testu jako HTML
function saveTestToHtml() {
    const testName = document.getElementById('testName').value;
    const testDescription = document.getElementById('testDescription').value;
    const questions = gatherQuestions();
    const testImage = document.getElementById('testImage').files[0]; // Uložení souboru obrázku

    let htmlContent = `
    <html>
        <head>
            <title>${testName}</title>
            <style>
                body { font-family: Arial, sans-serif; }
                .question { margin-bottom: 20px; }
                .question label { font-weight: bold; }
                .result { margin-top: 20px; }
            </style>
        </head>
        <body>
            <h1>${testName}</h1>
            <p>${testDescription}</p>`;

    if (testImage) {
        htmlContent += `<img src="${URL.createObjectURL(testImage)}" alt="Obrázek testu" />`;
    }

    htmlContent += `<form id="testForm">`;

    questions.forEach((question, index) => {
        htmlContent += `
            <div class="question">
                <p><strong>Otázka ${index + 1}:</strong> ${question.text}</p>
                <div class="answers">
                    ${question.answers.map((answer, idx) => `
                        <p><textarea placeholder="Zadejte odpověď" required>${answer}</textarea></p>
                    `).join('')}
                </div>
            </div>`;
    });

    htmlContent += `
            <button type="button" onclick="evaluateTest()">Vyhodnotit test</button>
            <div id="resultsContainer"></div>
        </form>
        </body>
    </html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    saveAs(blob, `${testName}.html`);
}