 let customQuestions = [];
    let usedQuestions = new Set();
    let currentQuestionIndex = 0;
    let score = 0;
    let timeLeft = 30;
    let answersElements = [];
    let timerInterval;
    const questionElement = document.getElementById("question");
    const scoreElement = document.getElementById("score");
    const timerElement = document.getElementById("timer");
    const enableTimerCheckbox = document.getElementById("enableTimerCheckbox");
    const gameTimeInput = document.getElementById("gameTime");

    function addAnswer() {
        const answersContainer = document.getElementById("answersContainer");
        const div = document.createElement("div");
        div.className = "answerRow";
        div.innerHTML = `
            <input type="text" placeholder="Odpověď" class="answerInput" />
            <label>
                <input type="checkbox" class="correctCheckbox" /> Správná odpověď
            </label>
            <input type="number" class="pointsInput" placeholder="Bodů za odpověď" min="1" />
            <button onclick="removeAnswer(this)">Odstranit</button>
        `;
        answersContainer.appendChild(div);
    }

    function removeAnswer(button) {
        button.parentElement.remove();
    }

    function saveQuestion() {
        const questionText = document.getElementById("newQuestion").value.trim();
        const answerInputs = document.querySelectorAll(".answerInput");
        const correctCheckboxes = document.querySelectorAll(".correctCheckbox");
        const pointsInputs = document.querySelectorAll(".pointsInput");

        if (!questionText) {
            alert("Zadejte otázku.");
            return;
        }

        const answers = Array.from(answerInputs).map((input, index) => ({
            text: input.value.trim(),
            correct: correctCheckboxes[index].checked,
            points: parseInt(pointsInputs[index].value) || 1,
        }));

        if (answers.length < 2 || !answers.some(a => a.correct)) {
            alert("Otázka musí mít alespoň dvě odpovědi a jednu správnou.");
            return;
        }

        customQuestions.push({ question: questionText, answers });
        document.getElementById("newQuestion").value = "";
        document.getElementById("answersContainer").innerHTML = `
            <div class="answerRow">
                <input type="text" placeholder="Odpověď" class="answerInput" />
                <label>
                    <input type="checkbox" class="correctCheckbox" /> Správná odpověď
                </label>
                <input type="number" class="pointsInput" placeholder="Bodů za odpověď" min="1" />
                <button onclick="removeAnswer(this)">Odstranit</button>
            </div>
        `;
        updateQuestionList();
    }

    function updateQuestionList() {
        const questionList = document.getElementById("questionList");
        questionList.innerHTML = "";

        customQuestions.forEach((q, index) => {
            const div = document.createElement("div");
            div.className = "questionContainer";
            div.innerHTML = `
                <h3>${q.question}</h3>
                <ul>
                    ${q.answers.map(a => `
                        <li>${a.text} ${a.correct ? "(správná)" : ""} - ${a.points} bodů</li>
                    `).join("")}
                </ul>
                <button onclick="removeQuestion(${index})">Odstranit otázku</button>
            `;
            questionList.appendChild(div);
        });
    }

    function removeQuestion(index) {
        customQuestions.splice(index, 1);
        updateQuestionList();
    }

function setupQuestion() {
    if (customQuestions.length === usedQuestions.size) {
        // Zobrazí dialog místo alertu
        document.getElementById("finalScoreQuestionsOver").textContent = score;
        document.getElementById("questionsOverModal").style.display = "block";
        document.getElementById("questionsOverlay").style.display = "block";
        return;
    }

    do {
        currentQuestionIndex = Math.floor(Math.random() * customQuestions.length);
    } while (usedQuestions.has(currentQuestionIndex));

    usedQuestions.add(currentQuestionIndex);
    const currentQuestion = customQuestions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const answerElement = document.createElement("div");
        answerElement.className = "answer";
        answerElement.textContent = answer.text;
        answerElement.style.top = `${Math.random() * (gameArea.clientHeight - 50)}px`;
        answerElement.style.left = `${Math.random() * (gameArea.clientWidth - 100)}px`;

        moveAnswer(answerElement);

        answerElement.addEventListener("click", () => {
            if (answer.correct) {
                score += answer.points;
            } else {
                score -= 5;
            }
            scoreElement.textContent = `Body: ${score}`;
            resetQuestion();
        });

        gameArea.appendChild(answerElement);
        answersElements.push(answerElement);
    });
}

function closeQuestionsOverModal() {
    document.getElementById("questionsOverModal").style.display = "none";
    document.getElementById("questionsOverlay").style.display = "none";
}

    function moveAnswer(answerElement) {
        setInterval(() => {
            const newTop = Math.random() * (gameArea.clientHeight - 50);
            const newLeft = Math.random() * (gameArea.clientWidth - 100);
            answerElement.style.top = `${newTop}px`;
            answerElement.style.left = `${newLeft}px`;
        }, 1000);
    }

    function resetQuestion() {
        answersElements.forEach(el => el.remove());
        answersElements = [];
        setupQuestion();
    }

    function calculateGrade(score) {
        const gradeSettings = document.getElementById("gradeSettings").value;
        const gradeRanges = gradeSettings.split(",").map(range => {
            const [rangeText, grade] = range.split(":");
            const [min, max] = rangeText.split("-").map(Number);
            return { min, max, grade };
        });

        for (let range of gradeRanges) {
            if (score >= range.min && score <= range.max) {
                return range.grade;
            }
        }
        return "Neznámková";
    }

   function showGameOverModal(score) {
    const grade = calculateGrade(score);
    document.getElementById("finalScore").textContent = `Vaše skóre je: ${score}`;
    document.getElementById("finalGrade").textContent = `Známka: ${grade}`;
    document.getElementById("gameOverModal").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeGameOverModal() {
    document.getElementById("gameOverModal").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function startGame() {
    if (customQuestions.length === 0) {
        alert("Před spuštěním hry vytvořte alespoň jednu otázku.");
        return;
    }

    score = 0;
    timeLeft = enableTimerCheckbox.checked ? parseInt(gameTimeInput.value) : 0;
    usedQuestions.clear();
    scoreElement.textContent = `Body: ${score}`;
    setupQuestion();

    if (timeLeft > 0) {
        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `Čas: ${timeLeft}`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                showGameOverModal(score);
            }
        }, 1000);
    }
}

function resetQuestion() {
    answersElements.forEach(el => el.remove());
    answersElements = [];
    setupQuestion();
}


    // Funkce pro export do JSON
    function exportToJSON() {
        if (customQuestions.length === 0) {
            alert("Nemáte žádné otázky pro export!");
            return;
        }

        const jsonData = {
            questions: customQuestions,  // Export otázek, odpovědí a bodů
            score: score,  // Export aktuálních bodů
            timeLeft: timeLeft,  // Export zbývajícího času
            isTimerEnabled: enableTimerCheckbox.checked  // Stav časovače
        };

        const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'test_game.json';
        link.click();
    }

    // Funkce pro export do Moodle XML
    function exportToMoodleXML() {
        if (customQuestions.length === 0) {
            alert("Nemáte žádné otázky pro export!");
            return;
        }

        let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<quiz>\n`;

        customQuestions.forEach((q, index) => {
            xmlContent += `
            <question type="multichoice">
                <name>
                    <text>Otázka ${index + 1}</text>
                </name>
                <questiontext format="html">
                    <text><![CDATA[<p>${q.question}</p>]]></text>
                </questiontext>
                ${q.answers.map(a => `
                <answer fraction="${a.correct ? 100 : 0}">
                    <text><![CDATA[${a.text}]]></text>
                </answer>
                `).join("")}
                <feedback>
                    <text>Správná odpověď!</text>
                </feedback>
                <defaultgrade>${q.answers.reduce((total, a) => total + a.points, 0) || 1}</defaultgrade>
            </question>`;
        });

        xmlContent += `\n</quiz>`;

        const blob = new Blob([xmlContent], { type: 'application/xml' });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "test_game_moodle.xml";
        a.click();
    }

    // Funkce pro export do HTML
function exportToHTML() {
    if (customQuestions.length === 0) {
        alert("Nemáte žádné otázky pro export!");
        return;
    }

    // Začátek HTML souboru
    let htmlContent = `<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Otázky</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .question-container { margin-bottom: 20px; border: 1px solid #ccc; padding: 15px; border-radius: 5px; }
        .question-container h3 { font-size: 18px; }
        .answer { margin-top: 5px; padding: 10px; background-color: #f1f1f1; border-radius: 3px; }
        .correct { background-color: #90ee90; }
    </style>
</head>
<body>
    <h1>Test Otázky</h1>`;

    // Generování otázek a odpovědí
    customQuestions.forEach((q, index) => {
        htmlContent += `<div class="question-container">
            <h3>${index + 1}. ${q.question}</h3>
            <ul>
                ${q.answers.map(a => `
                    <li class="answer ${a.correct ? 'correct' : ''}">${a.text} ${a.correct ? '(správná)' : ''} - ${a.points} bodů</li>
                `).join("")}
            </ul>
        </div>`;
    });

    // Konec HTML souboru
    htmlContent += `</body></html>`;

    // Vytvoření a stažení HTML souboru
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'test_otazky.html';
    link.click();
}
