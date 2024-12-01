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
            <div class="points">
                <label for="question${questionCount}_points">Počet bodů:</label>
                <input type="number" name="question${questionCount}_points" value="1" min="1" required>
            </div>
            <div class="answers">
                <label for="question${questionCount}_answer1">Spojte čísla (pro správnou odpověď zadejte číslo, které se shoduje):</label>
                <input type="text" name="question${questionCount}_answer1" placeholder="Zadejte číslo" required>
                <input type="text" name="question${questionCount}_answer2" placeholder="Zadejte číslo" required>
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
                        <input type="text" name="question${index + 1}_answer1" placeholder="Zadejte číslo">
                        <input type="text" name="question${index + 1}_answer2" placeholder="Zadejte číslo">
                    </div>
                </div>`;
        });

        testContent += `<button type="button" onclick="submitTest()">Odeslat test</button></form>`;
        document.getElementById('testContent').innerHTML = testContent;
        document.getElementById('previewTest').style.display = 'block';
    }

    // Funkce pro získání otázek
    function getQuestions() {
        const questions = [];
        const questionElements = document.querySelectorAll('.question-wrapper');
        questionElements.forEach((element) => {
            const questionText = element.querySelector('input[name^="question"][name$="_text"]').value;
            const answer1 = element.querySelector('input[name^="question"][name$="_answer1"]').value;
            const answer2 = element.querySelector('input[name^="question"][name$="_answer2"]').value;
            if (questionText && answer1 && answer2) {
                questions.push({ text: questionText, answers: [answer1, answer2] });
            }
        });
        return questions;
    }

    // Funkce pro odeslání testu
    function submitTest() {
        alert('Test byl odeslán');
    }

    // Funkce pro ukončení testu
    function endTest() {
        alert('Test byl ukončen');
    }

    // Funkce pro uložení testu
    function saveTest(type) {
        const testName = document.getElementById('testName').value;
        const questions = getQuestions();
        if (!testName || questions.length === 0) {
            alert('Přidejte otázky a název testu');
            return;
        }
        alert(`Test byl uložen jako ${type}`);
    }

    // Funkce pro uložení testu jako HTML
    function saveAsHtml() {
        const testName = document.getElementById('testName').value;
        const questions = getQuestions();
        if (!testName || questions.length === 0) {
            alert('Přidejte otázky a název testu');
            return;
        }
        alert('Test uložen jako HTML');
    }