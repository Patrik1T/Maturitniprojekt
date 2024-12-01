let questionCount = 0;
    let correctAnswers = 0;
    let targetCorrectAnswers = 5; // Požadovaný počet správných odpovědí pro dosažení cíle
    let totalTime = 0;
    let timeRemaining = 0;
    let timerInterval;
    let progressBall = document.getElementById('progressBall');

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
                <label><input type="radio" name="question${questionCount}_answer" value="1" required>
                <input type="text" name="question${questionCount}_option1" placeholder="Odpověď 1" required></label>
                <label><input type="radio" name="question${questionCount}_answer" value="2" required>
                <input type="text" name="question${questionCount}_option2" placeholder="Odpověď 2" required></label>
                <label><input type="radio" name="question${questionCount}_answer" value="3" required>
                <input type="text" name="question${questionCount}_option3" placeholder="Odpověď 3" required></label>
                <label><input type="radio" name="question${questionCount}_answer" value="4" required>
                <input type="text" name="question${questionCount}_option4" placeholder="Odpověď 4" required></label>
            </div>
            <button type="button" class="delete-question-btn" onclick="deleteQuestion(${questionCount})">Smazat otázku</button>
        </div>`;
        document.getElementById('questionsContainer').insertAdjacentHTML('beforeend', questionTemplate);
    }

    // Funkce pro smazání otázky
    function deleteQuestion(questionId) {
        const questionElement = document.getElementById(`question${questionId}`);
        questionElement.remove();
        questionCount--;
    }

    // Funkce pro náhled testu
    function previewTest() {
        const testContent = document.getElementById('testContent');
        const testName = document.getElementById('testName').value;
        testContent.innerHTML = `<h2>${testName}</h2>`;

        const questions = document.querySelectorAll('.question-wrapper');
        questions.forEach(question => {
            const questionText = question.querySelector('input[name^="question"][name$="_text"]').value;
            const options = [];
            question.querySelectorAll('input[name$="_option1"], input[name$="_option2"], input[name$="_option3"], input[name$="_option4"]').forEach(option => {
                options.push(option.value);
            });
            testContent.innerHTML += `
                <div class="test-question">
                    <p>${questionText}</p>
                    <ul>
                        <li>${options[0]}</li>
                        <li>${options[1]}</li>
                        <li>${options[2]}</li>
                        <li>${options[3]}</li>
                    </ul>
                </div>
            `;
        });

        document.getElementById('previewTest').style.display = 'block';
    }

    // Funkce pro ukončení testu
    function endTest() {
        document.getElementById('resultsSection').style.display = 'block';
        let score = correctAnswers;
        let grade = 'Nedokončeno';

        if (score >= targetCorrectAnswers) {
            grade = 'Splněno';
        } else {
            grade = 'Nesplněno';
        }

        document.getElementById('scoreDisplay').textContent = `Počet správných odpovědí: ${score}`;
        document.getElementById('gradeDisplay').textContent = `Hodnocení: ${grade}`;
        document.getElementById('progressBar').style.display = 'none';
    }

    // Funkce pro přidání časovače
    function startTimer() {
        const enableTimer = document.getElementById('enableTimer').checked;
        if (enableTimer) {
            totalTime = parseInt(document.getElementById('timer').value) * 60;
            timeRemaining = totalTime;

            timerInterval = setInterval(updateTimer, 1000);
            document.getElementById('timerDisplay').style.display = 'block';
        }
    }

    // Funkce pro aktualizaci časovače
    function updateTimer() {
        if (timeRemaining > 0) {
            timeRemaining--;
            document.getElementById('timerCount').textContent = formatTime(timeRemaining);
        } else {
            clearInterval(timerInterval);
            alert('Čas vypršel!');
        }
    }

    // Funkce pro formátování času
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    // Funkce pro uložené testy
    function saveTest(storageKey) {
        const testData = {
            testName: document.getElementById('testName').value,
            questions: []
        };
        const questions = document.querySelectorAll('.question-wrapper');
        questions.forEach(question => {
            const questionText = question.querySelector('input[name^="question"][name$="_text"]').value;
            const options = [];
            question.querySelectorAll('input[name$="_option1"], input[name$="_option2"], input[name$="_option3"], input[name$="_option4"]').forEach(option => {
                options.push(option.value);
            });
            const correctAnswer = question.querySelector('input[type="radio"]:checked')?.value;

            testData.questions.push({ questionText, options, correctAnswer });
        });

        const savedTests = JSON.parse(localStorage.getItem(storageKey)) || [];
        savedTests.push(testData);
        localStorage.setItem(storageKey, JSON.stringify(savedTests));
        alert('Test byl uložen.');
    }

    // Funkce pro uložení jako HTML
    function saveAsHtml() {
        const testContent = document.getElementById('testContent').innerHTML;
        const testName = document.getElementById('testName').value;
        const htmlContent = `
            <html>
                <head><title>${testName}</title></head>
                <body>${testContent}</body>
            </html>`;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${testName}.html`;
        link.click();
    }