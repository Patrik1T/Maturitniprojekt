    let questions = [];
    let currentQuestionIndex = 0;
    let correctAnswers = 0;
    let timeLimit = 0;
    let timeLeft = 0;
    let timer;
    let pointsPerQuestion = 1;
    let interval;  // Time interval for timer


 function addQuestion() {
    const questionText = document.getElementById('question').value;
    const answer1 = document.getElementById('answer1').value;
    const answer2 = document.getElementById('answer2').value;
    const answer3 = document.getElementById('answer3').value;
    const answer4 = document.getElementById('answer4').value;
    const correctAnswer = document.getElementById('correct-answer').value;
    const points = document.getElementById('points').value;

    // Kontrola, jestli jsou všechna pole vyplněná
    if (!questionText || !answer1 || !answer2 || !answer3 || !answer4 || !correctAnswer || !points) {

        return;
    }

    const question = {
        question: questionText,
        answers: [answer1, answer2, answer3, answer4],
        correctAnswer: parseInt(correctAnswer) - 1, // Ukládáme index správné odpovědi (0-3)
        points: parseInt(points)
    };

    // Přidání otázky do pole
    questions.push(question);

    // Zobrazení seznamu otázek
    displayQuestions();

    // Vymazání formuláře pro zadání nové otázky
    document.getElementById('question').value = '';
    document.getElementById('answer1').value = '';
    document.getElementById('answer2').value = '';
    document.getElementById('answer3').value = '';
    document.getElementById('answer4').value = '';
    document.getElementById('correct-answer').value = '';
    document.getElementById('points').value = '1'; // Reset na výchozí hodnotu
}


    // Funkce pro zobrazení seznamu otázek s možností úpravy a smazání
function displayQuestions() {
    const questionsList = document.getElementById('questionsList');
    questionsList.innerHTML = ''; // Vyčistíme seznam

    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question-box');
        questionDiv.innerHTML = `
            <strong>${question.question}</strong><br>
            <em>Odpovědi:</em><br>
            1. ${question.answers[0]}<br>
            2. ${question.answers[1]}<br>
            3. ${question.answers[2]}<br>
            4. ${question.answers[3]}<br>
            <button onclick="editQuestion(${index})">Upravit</button>
            <button onclick="deleteQuestion(${index})">Smazat</button>
        `;
        questionsList.appendChild(questionDiv);
    });
}

// Funkce pro editaci otázky
function editQuestion(index) {
    const question = questions[index];
    document.getElementById('question').value = question.question;
    document.getElementById('answer1').value = question.answers[0];
    document.getElementById('answer2').value = question.answers[1];
    document.getElementById('answer3').value = question.answers[2];
    document.getElementById('answer4').value = question.answers[3];
    document.getElementById('correct-answer').value = question.correctAnswer + 1; // Index upravit na 1-4
    document.getElementById('points').value = question.points;

    // Vymazání otázky z pole a zobrazení seznamu po editaci
    deleteQuestion(index);
}

// Funkce pro smazání otázky
function deleteQuestion(index) {
    questions.splice(index, 1);
    displayQuestions(); // Zobrazíme seznam po smazání
}


    // Funkce pro spuštění testu
    function startTest() {
        if (questions.length === 0) {

            return;
        }

        // Nastavení časomíry, pokud je zaškrtnuto
        const useTimer = document.getElementById('useTimer').checked;
        timeLimit = parseInt(document.getElementById('timeLimit').value);
        if (useTimer && timeLimit > 0) {
            timeLeft = timeLimit * 60; // Přepočteme minuty na sekundy
            document.getElementById('timeLeft').textContent = timeLeft;
            startTimer();
        }

        currentQuestionIndex = 0;
        correctAnswers = 0;

        // Zamíchání otázek
        questions = shuffle(questions);

        updateTestQuestion();
        document.getElementById('testContainer').style.display = 'block';
        document.getElementById('questionsList').style.display = 'none';
    }

    // Funkce pro zamíchání otázek
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap
        }
        return array;
    }

    // Funkce pro zobrazení otázky a odpovědí
    function updateTestQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        const testQuestionDiv = document.getElementById('testQuestion');

        testQuestionDiv.innerHTML = `<h3>${currentQuestion.question}</h3>`;
        currentQuestion.answers.forEach((answer, index) => {
            const answerButton = document.createElement('button');
            answerButton.textContent = answer;
            answerButton.onclick = () => checkAnswer(index);
            testQuestionDiv.appendChild(answerButton);
        });
    }

    // Funkce pro kontrolu odpovědi
    function checkAnswer(selectedAnswerIndex) {
        const currentQuestion = questions[currentQuestionIndex];
        if (selectedAnswerIndex === currentQuestion.correctAnswer) {
            correctAnswers += currentQuestion.points;
        } else {

        }

        // Pokračovat na další otázku
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            updateTestQuestion();
            updateProgress();
        } else {
            // Pokud všechny otázky byly zodpovězeny, zastavit časomíru a zobrazit výsledek
            if (interval) {
                clearInterval(interval);
            }
            showResult();
        }
    }


    // Funkce pro návrat zpět k předchozí otázce
    function backQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            updateTestQuestion();
            updateProgress();
        }
    }

  // Funkce pro zobrazení výsledků
function showResult() {
    const totalPoints = questions.reduce((sum, question) => sum + question.points, 0);
    const gradeBoundary1 = parseInt(document.getElementById('grade1').value); // Například 90%
    const gradeBoundary2 = parseInt(document.getElementById('grade2').value); // Například 80%
    const gradeBoundary3 = parseInt(document.getElementById('grade3').value); // Například 70%
    const gradeBoundary4 = parseInt(document.getElementById('grade4').value); // Například 60%
    const gradeBoundary5 = parseInt(document.getElementById('grade5').value); // Například 50%

    // Výpočet procenta správně zodpovězených odpovědí
    const gradePercentage = (correctAnswers / totalPoints) * 100;

    // Určení známky podle procenta
    let gradeMessage = '';

    if (gradePercentage >= gradeBoundary1) {
        gradeMessage = 'Známka: 1';
    } else if (gradePercentage >= gradeBoundary2) {
        gradeMessage = 'Známka: 2';
    } else if (gradePercentage >= gradeBoundary3) {
        gradeMessage = 'Známka: 3';
    } else if (gradePercentage >= gradeBoundary4) {
        gradeMessage = 'Známka: 4';
    } else if (gradePercentage >= gradeBoundary5) {
        gradeMessage = 'Známka: 5';
    } else {
        gradeMessage = 'Známka: 5'; // Pokud je méně než gradeBoundary5, je to 5
    }

    const resultMessage = `Správně ${correctAnswers} z ${totalPoints} bodů.`;
    const scoreMessage = `Celkové skóre: ${correctAnswers} z ${totalPoints} bodů.`;

    // Zobrazení výsledků
    document.getElementById('resultMessage').textContent = resultMessage;
    document.getElementById('scoreMessage').textContent = scoreMessage;
    document.getElementById('gradeMessage').textContent = gradeMessage;

    document.getElementById('resultContainer').style.display = 'block';
}


    // Funkce pro restartování testu
    function restartTest() {
        // Zastavit časomíru, pokud je aktivní
        if (interval) {
            clearInterval(interval);
        }

        currentQuestionIndex = 0;
        correctAnswers = 0;
        updateTestQuestion();
        updateProgress();
        document.getElementById('resultContainer').style.display = 'none';

        // Pokud je časomíra aktivní, nastavíme správný čas
        const useTimer = document.getElementById('useTimer').checked;
        if (useTimer && timeLimit > 0) {
            timeLeft = timeLimit * 60; // Obnovíme původní čas
            document.getElementById('timeLeft').textContent = timeLeft;
            startTimer();
        }
    }

    // Funkce pro aktualizaci pokroku
    function updateProgress() {
        const progressDot = document.getElementById('progressDot');
        const progressBar = document.querySelector('.progress-bar');
        const progressPercentage = (currentQuestionIndex / questions.length) * 100;
        progressDot.style.left = `calc(${progressPercentage}% - 10px)`; // 10px je polovina velikosti červeného bodu
    }

    // Funkce pro spuštění časomíry
    function startTimer() {
        interval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                document.getElementById('timeLeft').textContent = timeLeft;
            } else {
                clearInterval(interval);

                showResult();
            }
        }, 1000);
    }

 // Funkce pro uložení testu jako HTML
    function saveTestToHtml() {
        const testName = prompt("Zadejte název testu:", "Test");
        if (!testName) return;

        let htmlContent = `
        <html lang="cs">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${testName}</title>
        </head>
        <body>
            <h1>${testName}</h1>
            <h2>Otázky</h2>
        `;

        questions.forEach((question, index) => {
            htmlContent += `
                <p><strong>${question.question}</strong></p>
                <ul>
                    <li>1. ${question.answers[0]}</li>
                    <li>2. ${question.answers[1]}</li>
                    <li>3. ${question.answers[2]}</li>
                    <li>4. ${question.answers[3]}</li>
                </ul>
                <p><em>Správná odpověď: ${question.correctAnswer + 1}</em></p>
                <p><em>Bodování: ${question.points} bodů</em></p>
                <hr>
            `;
        });

        // Časomíra a známky
        htmlContent += `
            <h2>Časomíra</h2>
            <p>Časový limit: ${timeLimit} minut</p>
            <h2>Známky</h2>
            <p>1. ${document.getElementById('grade1').value}%</p>
            <p>2. ${document.getElementById('grade2').value}%</p>
            <p>3. ${document.getElementById('grade3').value}%</p>
            <p>4. ${document.getElementById('grade4').value}%</p>
            <p>5. ${document.getElementById('grade5').value}%</p>
        </body>
        </html>
        `;

        const blob = new Blob([htmlContent], { type: "text/html" });
        saveAs(blob, `${testName}.html`);
    }

    // Funkce pro uložení testu jako JSON
    function saveTestToJson() {
        const testName = prompt("Zadejte název testu:", "Test");
        if (!testName) return;

        const testData = {
            testName: testName,
            questions: questions,
            timeLimit: timeLimit,
            grades: {
                grade1: document.getElementById('grade1').value,
                grade2: document.getElementById('grade2').value,
                grade3: document.getElementById('grade3').value,
                grade4: document.getElementById('grade4').value,
                grade5: document.getElementById('grade5').value
            }
        };

        const blob = new Blob([JSON.stringify(testData, null, 2)], { type: "application/json" });
        saveAs(blob, `${testName}.json`);
    }

    // Funkce pro uložení testu jako XML
    function saveTestToXml() {
        const testName = prompt("Zadejte název testu:", "Test");
        if (!testName) return;

        let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<test>\n  <testName>${testName}</testName>\n`;

        // Otázky a odpovědi
        questions.forEach((question, index) => {
            xmlContent += `  <question>\n    <questionText>${question.question}</questionText>\n    <answers>\n`;
            question.answers.forEach((answer, i) => {
                xmlContent += `      <answer index="${i + 1}">${answer}</answer>\n`;
            });
            xmlContent += `    </answers>\n    <correctAnswer>${question.correctAnswer + 1}</correctAnswer>\n    <points>${question.points}</points>\n  </question>\n`;
        });

        // Časomíra a známky
        xmlContent += `  <timeLimit>${timeLimit}</timeLimit>\n  <grades>\n`;
        xmlContent += `    <grade1>${document.getElementById('grade1').value}</grade1>\n`;
        xmlContent += `    <grade2>${document.getElementById('grade2').value}</grade2>\n`;
        xmlContent += `    <grade3>${document.getElementById('grade3').value}</grade3>\n`;
        xmlContent += `    <grade4>${document.getElementById('grade4').value}</grade4>\n`;
        xmlContent += `    <grade5>${document.getElementById('grade5').value}</grade5>\n  </grades>\n</test>`;

        const blob = new Blob([xmlContent], { type: "application/xml" });
        saveAs(blob, `${testName}.xml`);
    }