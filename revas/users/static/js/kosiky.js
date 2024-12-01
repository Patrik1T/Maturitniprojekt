 let questionCount = 0;

    // Funkce pro přidání otázky
    function addQuestion() {
        questionCount++;
        const questionTemplate = `
        <div class="question-wrapper" id="question${questionCount}">
            <div class="question">
                <label for="question${questionCount}_text">Otázka ${questionCount}:</label>
                <input type="text" name="question${questionCount}_text" placeholder="Zadejte otázku" required>
            </div>
            <div class="answers">
                <label for="question${questionCount}_option1">Odpověď 1:</label>
                <input type="text" name="question${questionCount}_option1" placeholder="Odpověď 1" required>
                <label for="question${questionCount}_option2">Odpověď 2:</label>
                <input type="text" name="question${questionCount}_option2" placeholder="Odpověď 2" required>
                <label for="question${questionCount}_option3">Odpověď 3:</label>
                <input type="text" name="question${questionCount}_option3" placeholder="Odpověď 3" required>
                <label for="question${questionCount}_option4">Odpověď 4:</label>
                <input type="text" name="question${questionCount}_option4" placeholder="Odpověď 4" required>
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

    // Funkce pro náhled testu
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
                    <p>${question.text}</p>
                    <div class="answers">
                        ${question.options.map((option, i) => `
                            <div class="answer-draggable" id="answer${index}_${i}" draggable="true" ondragstart="drag(event)">
                                ${option}
                            </div>
                        `).join('')}
                    </div>
                    <div class="basket open" id="basket${index}">
                        <span>Košík ${index + 1}</span>
                    </div>
                </div>`;
        });

        testContent += `<button type="button" onclick="submitTest()">Hotovo</button></form>`;
        document.getElementById('testContent').innerHTML = testContent;
        document.getElementById('previewTest').style.display = 'block';
    }

    // Funkce pro získání otázek a odpovědí
    function getQuestions() {
        const questions = [];
        const questionElements = document.querySelectorAll('.question-wrapper');
        questionElements.forEach(questionElement => {
            const questionText = questionElement.querySelector('input[type="text"]').value;
            const options = [];
            questionElement.querySelectorAll('.answers input[type="text"]').forEach(optionElement => {
                options.push(optionElement.value);
            });
            questions.push({ text: questionText, options });
        });
        return questions;
    }

    // Funkce pro přetahování odpovědí do košíků
    function drag(event) {
        event.dataTransfer.setData("text", event.target.id);
    }

    function drop(event, basketId) {
        event.preventDefault();
        const data = event.dataTransfer.getData("text");
        const answer = document.getElementById(data);
        const basket = document.getElementById(basketId);
        basket.appendChild(answer);
    }

    function saveTest(type) {
        const questions = getQuestions();
        const testData = {
            name: document.getElementById('testName').value,
            questions: questions
        };
        // Uložit data testu na server nebo do lokalní úložiště
        console.log('Saving test', type, testData);
    }

    function saveAsHtml() {
        const questions = getQuestions();
        const htmlContent = `
        <h1>${document.getElementById('testName').value}</h1>
        <ol>
            ${questions.map(q => `
                <li>${q.text}</li>
                <ul>
                    ${q.options.map(option => `<li>${option}</li>`).join('')}
                </ul>
            `).join('')}
        </ol>`;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${document.getElementById('testName').value}.html`;
        link.click();
    }

    function endTest() {
        alert('Test byl ukončen!');
    }