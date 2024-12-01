 let questionCount = 0;
    let timerInterval;
    let totalTime = 0;
    let timeRemaining = 0;
    let totalPoints = 0;
    let correctAnswers = 0;

    function saveTest(type) {
    // Získání dat testu
    const testName = document.getElementById('testName').value;
    const questions = getQuestions();

    if (type === 'verejne_testy') {
        // Při ukládání do veřejných testů přidej text a obrázek
        const imageUrl = prompt("Zadejte URL obrázku pro veřejný test");
        const description = prompt("Zadejte popis testu");

        // Tady bys měl uložit test na server nebo do lokálního úložiště
        console.log(`Test uložen do veřejných testů: ${testName}, Popis: ${description}, Obrázek: ${imageUrl}`);
    } else {
        // Uložení na profil, hlavní stránku nebo uložené testy
        console.log(`Test uložen na ${type}: ${testName}`);
    }

    alert(`Test byl uložen jako ${type}`);
}

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
                            <label>
                                <input type="radio" name="question${index + 1}_answer" value="${i + 1}">
                                ${option}
                            </label>
                        `).join('')}
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

    // Funkce pro získání otázky
    function getQuestions() {
        const questions = [];
        for (let i = 1; i <= questionCount; i++) {
            const questionText = document.querySelector(`input[name="question${i}_text"]`).value;
            const options = [];
            for (let j = 1; j <= 4; j++) {
                const optionText = document.querySelector(`input[name="question${i}_option${j}"]`).value;
                options.push(optionText);
            }
            const answer = document.querySelector(`input[name="question${i}_answer"]:checked`)?.value;
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
        if (timeRemaining > 0) {
            timeRemaining--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            alert('Čas vypršel! Test bude ukončen.');
            submitTest();
        }
    }

    // Funkce pro zobrazení aktuálního času
    function updateTimerDisplay() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        document.getElementById('timerCount').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // Funkce pro ukončení testu
    function endTest() {
        alert('Test byl ukončen.');
    }

    // Funkce pro odeslání testu
    function submitTest() {
        let score = 0;
        const questions = getQuestions();
        questions.forEach((question, index) => {
            const selectedAnswer = document.querySelector(`input[name="question${index + 1}_answer"]:checked`);
            if (selectedAnswer && selectedAnswer.value === question.correctAnswer) {
                score += question.points;
            }
        });

        const grade = calculateGrade(score);
        document.getElementById('scoreDisplay').innerText = `Počet bodů: ${score}`;
        document.getElementById('gradeDisplay').innerText = `Vaše známka: ${grade}`;
        document.getElementById('resultsSection').style.display = 'block';
    }

    // Funkce pro výpočet známky
    function calculateGrade(score) {
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

    // Funkce pro uložení testu
    function saveTest(type) {
        alert(`Test byl uložen jako ${type}`);
    }

    // Funkce pro uložení testu jako HTML
function saveAsHtml() {
    const testName = document.getElementById('testName').value;
    const questions = getQuestions();

    function saveTest(type) {
    const testName = document.getElementById('testName').value;
    const description = document.getElementById('testDescription').value;
    const imageUrl = document.getElementById('testImage').files[0]; // Get the image file
    const imageSrc = imageUrl ? URL.createObjectURL(imageUrl) : null; // Get the image source URL

    if (type === 'verejne_testy') {
        // Save the public test information
        const testData = {
            name: testName,
            description: description,
            image: imageSrc // Store the image URL for display
        };

        // Store this data locally (you could also store it on a server)
        let publicTests = JSON.parse(localStorage.getItem('publicTests')) || [];
        publicTests.push(testData);
        localStorage.setItem('publicTests', JSON.stringify(publicTests));

        alert('Test byl uložen jako veřejný test');
    } else {
        // For other test types, like saving to profile
        console.log(`Test uložen na ${type}: ${testName}`);
    }
}


    let testContent = `
        <html lang="cs">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${testName}</title>
        </head>
        <body>
            <h1>${testName}</h1>`;

    questions.forEach((question, index) => {
        testContent += `<h3>Otázka ${index + 1}:</h3>
            <p>${question.text}</p>
            <ul>`;
        question.options.forEach((option) => {
            testContent += `<li>${option}</li>`;
        });
        testContent += `</ul>`;
    });

    testContent += `
        </body>
        </html>`;

    const blob = new Blob([testContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${testName}.html`;
    link.click();
}