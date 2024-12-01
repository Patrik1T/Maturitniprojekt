 let questionCount = 0;
    let timerInterval;
    let totalTime = 0;
    let timeRemaining = 0;
    let totalPoints = 0;
    let correctAnswers = 0;

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
                <label for="question${questionCount}_option1">Odpověď:</label>
                <input type="text" name="question${questionCount}_option1" placeholder="Zadejte odpověď 1" required>

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
                        <label>
                            <input type="text" name="question${index + 1}_answer" placeholder="Zadejte odpověď">
                        </label>
                    </div>
                </div>`;
        });

        testContent += `<button type="button" onclick="submitTest()">Hotovo</button></form>`;
        document.getElementById('testContent').innerHTML = testContent;
        document.getElementById('previewTest').style.display = 'block';

        // Spustí časovač pokud je povolen
        if (document.getElementById('enableTimer').checked) {
            startTimer();
        }
    }

    // Funkce pro získání otázek
    function getQuestions() {
        const questions = [];
        for (let i = 1; i <= questionCount; i++) {
            const questionText = document.querySelector(`input[name="question${i}_text"]`).value;
            const options = [];
            for (let j = 1; j <= 4; j++) {
                const optionText = document.querySelector(`input[name="question${i}_option${j}"]`).value;
                options.push(optionText);
            }
            const answer = options[parseInt(document.querySelector(`input[name="question${i}_answer"]:checked`)?.value) - 1];
            const points = parseInt(document.querySelector(`input[name="question${i}_points"]`).value);

            if (questionText && answer) {
                questions.push({
                    text: questionText,
                    options: options,
                    correctAnswer: answer,
                    points: points
                });
            }
        }
        return questions;
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
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert('Čas vypršel!');
            submitTest();
        }
    }

    // Funkce pro zobrazení zbývajícího času
    function updateTimerDisplay() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        document.getElementById('timerCount').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // Funkce pro odeslání testu
    function submitTest() {
        alert('Test odeslán!');
        endTest();
    }

    // Funkce pro ukončení testu
    function endTest() {
        document.getElementById('previewTest').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';

        // Tady by se počítaly výsledky testu podle odpovědí
    }

    // Funkce pro uložení testu jako HTML
    function saveAsHtml() {
        const testName = document.getElementById('testName').value;
        const questions = getQuestions();
        let htmlContent = `<h1>${testName}</h1>`;

        questions.forEach((question, index) => {
            htmlContent += `
                <h2>${question.text}</h2>
                <ul>`;
            question.options.forEach(option => {
                htmlContent += `<li>${option}</li>`;
            });
            htmlContent += `</ul>`;
        });

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${testName}.html`;
        link.click();
    }