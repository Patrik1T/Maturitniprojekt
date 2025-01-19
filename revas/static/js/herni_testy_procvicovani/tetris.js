  const questions = [];
        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");
        const nextCanvas = document.getElementById("nextCanvas");
        const nextCtx = nextCanvas.getContext("2d");
        const nextCanvas1 = document.getElementById("nextCanvas1");
        const nextCtx1 = nextCanvas1.getContext("2d");
        const nextCanvas2 = document.getElementById("nextCanvas2");
        const nextCtx2 = nextCanvas2.getContext("2d");

        const rows = 24;
        const cols = 10;
        const blockSize = 30;
        const gameBoard = Array.from({ length: rows }, () => Array(cols).fill(0));

        const tetriminos = [
            { color: "red", shape: [[1, 1, 1, 1]] },
            { color: "blue", shape: [[1, 1], [1, 1]] },
            { color: "green", shape: [[1, 1, 0], [0, 1, 1]] },
            { color: "orange", shape: [[0, 1, 1], [1, 1, 0]] },
            { color: "purple", shape: [[1, 0, 0], [1, 1, 1]] },
            { color: "yellow", shape: [[0, 0, 1], [1, 1, 1]] },
            { color: "cyan", shape: [[0, 1, 0], [1, 1, 1]] },
        ];

        let score = 0;
        let currentTetrimino;
        let currentPos = { x: 3, y: 0 };
        let gameOver = false;
        let nextTetrimino;
        let futureTetriminos = [];
        let gamePaused = false;
        const dropInterval = 1000;
        let lastDropTime = 0;
        let gameIntervalId;

        function drawBoard() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (gameBoard[r][c] !== 0) {
                        ctx.fillStyle = gameBoard[r][c];
                        ctx.fillRect(c * blockSize, r * blockSize, blockSize, blockSize);
                    }
                }
            }
        }

        function drawTetrimino() {
            const shape = currentTetrimino.shape;
            for (let r = 0; r < shape.length; r++) {
                for (let c = 0; c < shape[r].length; c++) {
                    if (shape[r][c] !== 0) {
                        ctx.fillStyle = currentTetrimino.color;
                        ctx.fillRect((currentPos.x + c) * blockSize, (currentPos.y + r) * blockSize, blockSize, blockSize);
                        ctx.strokeStyle = "#000";
                        ctx.lineWidth = 2;
                        ctx.strokeRect((currentPos.x + c) * blockSize, (currentPos.y + r) * blockSize, blockSize, blockSize);
                    }
                }
            }
        }

        function drawNextTetrimino(context, tetrimino) {
            const shape = tetrimino.shape;
            context.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
            for (let r = 0; r < shape.length; r++) {
                for (let c = 0; c < shape[r].length; c++) {
                    if (shape[r][c] !== 0) {
                        context.fillStyle = tetrimino.color;
                        context.fillRect(c * blockSize, r * blockSize, blockSize, blockSize);
                        context.strokeStyle = "#000";
                        context.lineWidth = 2;
                        context.strokeRect(c * blockSize, r * blockSize, blockSize, blockSize);
                    }
                }
            }
        }

        function rotateTetrimino() {
            const shape = currentTetrimino.shape;
            const rotatedShape = shape[0].map((_, index) => shape.map(row => row[index])).reverse();

            if (canMove(0, 0, rotatedShape)) {
                currentTetrimino.shape = rotatedShape;
            }
        }

        function canMove(dx, dy, shape) {
            for (let r = 0; r < shape.length; r++) {
                for (let c = 0; c < shape[r].length; c++) {
                    if (shape[r][c] !== 0) {
                        const newX = currentPos.x + c + dx;
                        const newY = currentPos.y + r + dy;

                        if (newX < 0 || newX >= cols || newY >= rows || gameBoard[newY][newX] !== 0) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }

        function placeTetrimino() {
            const shape = currentTetrimino.shape;
            for (let r = 0; r < shape.length; r++) {
                for (let c = 0; c < shape[r].length; c++) {
                    if (shape[r][c] !== 0) {
                        gameBoard[currentPos.y + r][currentPos.x + c] = currentTetrimino.color;
                    }
                }
            }
        }

        function removeFullRows() {
            let rowsRemoved = 0;
            for (let r = rows - 1; r >= 0; r--) {
                if (gameBoard[r].every(cell => cell !== 0)) {
                    gameBoard.splice(r, 1);
                    gameBoard.unshift(Array(cols).fill(0));
                    rowsRemoved++;
                    if (rowsRemoved > 0) {
                        showQuestion();
                    }
                }
            }
        }

       // Funkce pro aktualizaci skóre
function updateScore(value) {
    score += value;
    document.getElementById('score').textContent = "Score: " + score;
}

        function showQuestion() {
            gamePaused = true;

            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
            const questionTextElement = document.getElementById("questionText");
            const answerOptionsElement = document.getElementById("answerOptions");
            questionTextElement.textContent = randomQuestion.question;
            answerOptionsElement.innerHTML = "";

            randomQuestion.answers.forEach(answer => {
    const button = document.createElement('button');
    button.textContent = answer.text; // Zobrazuje text odpovědi
    button.onclick = () => handleAnswer(answer.text, randomQuestion.correct); // Porovnává text odpovědi
    answerOptionsElement.appendChild(button);
});


            document.getElementById("questionPopup").style.display = "block";
            clearInterval(gameIntervalId);
        }

        function handleAnswer(answer, correctAnswer) {
            if (answer === correctAnswer) {
                score += 10;
            }
            updateScore();
            document.getElementById("questionPopup").style.display = "none";
            gamePaused = false;
            startGame();
        }

        function startGame() {
            currentTetrimino = nextTetrimino || tetriminos[Math.floor(Math.random() * tetriminos.length)];
            nextTetrimino = futureTetriminos[0] || tetriminos[Math.floor(Math.random() * tetriminos.length)];
            futureTetriminos = [futureTetriminos[1], tetriminos[Math.floor(Math.random() * tetriminos.length)]];

            currentPos = { x: 3, y: 0 };
            drawNextTetrimino(nextCtx1, nextTetrimino);
            drawNextTetrimino(nextCtx2, futureTetriminos[1]);

            if (!gamePaused) {
                gameIntervalId = setInterval(gameLoop, dropInterval);
            }
        }

        function gameLoop() {
            if (gameOver || gamePaused) {
                return;
            }

            const now = Date.now();
            if (now - lastDropTime > dropInterval) {
                if (canMove(0, 1, currentTetrimino.shape)) {
                    currentPos.y++;
                } else {
                    placeTetrimino();
                    removeFullRows();
                    if (currentPos.y <= 0) {
    // Konec hry
    endGame();
} else {
                        startGame();
                    }
                }
                lastDropTime = now;
            }

            drawBoard();
            drawTetrimino();
        }

 // Uložení otázky
document.getElementById("saveQuestionBtn").addEventListener("click", function() {
    const questionText = document.getElementById("questionInput").value.trim();
    const answer1Text = document.getElementById("answer1").value.trim();
    const answer2Text = document.getElementById("answer2").value.trim();
    const answer3Text = document.getElementById("answer3").value.trim();
    const answer4Text = document.getElementById("answer4").value.trim();

    // Kontrola, zda je otázka vyplněná a obsahuje alespoň jednu odpověď
    if (!questionText || (!answer1Text && !answer2Text && !answer3Text && !answer4Text)) {

        return; // Neprovádí uložení, pokud není vše správně vyplněno
    }

    // Vytvoření pole odpovědí
    const answers = [
        { text: answer1Text, correct: document.getElementById("correct1").checked },
        { text: answer2Text, correct: document.getElementById("correct2").checked },
        { text: answer3Text, correct: document.getElementById("correct3").checked },
        { text: answer4Text, correct: document.getElementById("correct4").checked }
    ];

    // Filtrujeme prázdné odpovědi a vybíráme správnou odpověď
    const filteredAnswers = answers.filter(a => a.text !== "");

    // Pokud není žádná správná odpověď, zobrazíme varování
    if (!filteredAnswers.some(a => a.correct)) {

        return;
    }

    // Přidání otázky do seznamu
    questions.push({
        question: questionText,
        answers: filteredAnswers,
        correct: filteredAnswers.find(a => a.correct)?.text
    });

    // Aktualizace seznamu otázek
    updateQuestionList();

    // Po uložení vyprázdníme pole pro nové zadání
    document.getElementById("questionInput").value = "";
    document.getElementById("answer1").value = "";
    document.getElementById("answer2").value = "";
    document.getElementById("answer3").value = "";
    document.getElementById("answer4").value = "";
    document.getElementById("correct1").checked = false;
    document.getElementById("correct2").checked = false;
    document.getElementById("correct3").checked = false;
    document.getElementById("correct4").checked = false;
});





        // Aktualizace seznamu otázek
function updateQuestionList() {
    const container = document.getElementById("questionsContainer");
    container.innerHTML = ""; // Vyprazdnění seznamu před přidáním nových otázek
    questions.forEach((q, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${q.question} - <button onclick="deleteQuestion(${index})">Smazat</button>`;
        container.appendChild(li);
    });
}



        // Smazání otázky
function deleteQuestion(index) {
    // Odstranění otázky z pole
    questions.splice(index, 1);

    // Po smazání otázky aktualizujeme seznam otázek
    updateQuestionList();
}


        // Spuštění hry
        document.getElementById("startGameBtn").addEventListener("click", function() {
            startGame();
        });

        // Pohyb v hře
        document.addEventListener("keydown", event => {
            if (event.key === "ArrowLeft" && canMove(-1, 0, currentTetrimino.shape)) {
                currentPos.x--;
            } else if (event.key === "ArrowRight" && canMove(1, 0, currentTetrimino.shape)) {
                currentPos.x++;
            } else if (event.key === "ArrowDown" && canMove(0, 1, currentTetrimino.shape)) {
                currentPos.y++;
            } else if (event.key === "ArrowUp") {
                rotateTetrimino();
            }
        });

       function showGameResults() {
    const resultsPopup = document.createElement('div');
    resultsPopup.style.position = "fixed";
    resultsPopup.style.top = "50%";
    resultsPopup.style.left = "50%";
    resultsPopup.style.transform = "translate(-50%, -50%)";
    resultsPopup.style.backgroundColor = "white";
    resultsPopup.style.padding = "20px";
    resultsPopup.style.border = "2px solid black";
    resultsPopup.style.zIndex = 1000;

    // Celkové skóre
    const scoreElement = document.createElement('h2');
    scoreElement.textContent = `Celkové body: ${score}`;
    resultsPopup.appendChild(scoreElement);

    // Výsledek hodnocení (známka)
    const grade = calculateGrade(score);
    const gradeElement = document.createElement('p');
    gradeElement.textContent = `Známka: ${grade}`;
    resultsPopup.appendChild(gradeElement);

    // Seznam chybně zodpovězených otázek
    const wrongQuestions = getWrongQuestions();
    if (wrongQuestions.length > 0) {
        const wrongQuestionsList = document.createElement('ul');
        wrongQuestionsList.innerHTML = '<h3>Chybně zodpovězené otázky:</h3>';
        wrongQuestions.forEach(question => {
            const li = document.createElement('li');
            li.textContent = question;
            wrongQuestionsList.appendChild(li);
        });
        resultsPopup.appendChild(wrongQuestionsList);
    }

    // Tlačítko pro zavření výsledků
    const closeButton = document.createElement('button');
    closeButton.textContent = "Zavřít";
    closeButton.onclick = function() {
        resultsPopup.style.display = "none";
    };
    resultsPopup.appendChild(closeButton);

    document.body.appendChild(resultsPopup);
}


function calculateGrade(score) {
    if (score >= 90) return "1";
    if (score >= 75) return "2";
    if (score >= 50) return "3";
    if (score >= 25) return "4";
    return "5";
}
     function gameOverSequence() {
    // Při ukončení hry se zobrazí výsledky
    showGameResults();
}

 function exportToJSON() {
    if (questions.length === 0) {
        alert("Nemáte žádné otázky pro export!");
        return;
    }

    const jsonData = {
        questions: questions,  // Export otázek, odpovědí a bodů
        score: score,  // Export aktuálních bodů
        timeLeft: timeLeft,  // Export zbývajícího času
        playerPosition: playerPosition,  // Export pozice hráče
        isTimerEnabled: isTimerEnabled  // Stav časovače
    };

    const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'test_data.json';
    link.click();
}

// Aktualizace seznamu otázek
function updateQuestionList() {
    const container = document.getElementById("questionsContainer");
    container.innerHTML = "";
    questions.forEach((q, index) => {
        const li = document.createElement("li");

        // Zobrazí otázku
        li.innerHTML = `${q.question} - <button onclick="deleteQuestion(${index})">Smazat</button>`;

        // Zobrazí odpovědi
        const answersList = document.createElement("ul");
        q.answers.forEach((a, i) => {
            const answerItem = document.createElement("li");
            answerItem.innerHTML = `${a.text} ${a.correct ? "(Správná)" : ""} - 
                <button onclick="editAnswer(${index}, ${i})">Upravit</button>`;
            answersList.appendChild(answerItem);
        });

        li.appendChild(answersList);
        container.appendChild(li);
    });
}

// Editace odpovědi
function editAnswer(questionIndex, answerIndex) {
    const question = questions[questionIndex];
    const answer = question.answers[answerIndex];

    // Předvyplní formulář s odpovědí
    document.getElementById("questionInput").value = question.question;
    document.getElementById("answer1").value = question.answers[0].text;
    document.getElementById("correct1").checked = question.answers[0].correct;
    document.getElementById("answer2").value = question.answers[1].text;
    document.getElementById("correct2").checked = question.answers[1].correct;
    document.getElementById("answer3").value = question.answers[2].text;
    document.getElementById("correct3").checked = question.answers[2].correct;
    document.getElementById("answer4").value = question.answers[3].text;
    document.getElementById("correct4").checked = question.answers[3].correct;

    // Aktualizuje tlačítko na "Upravit" místo "Uložit"
    const saveButton = document.getElementById("saveQuestionBtn");
    saveButton.textContent = "Upravit otázku";
    saveButton.onclick = function() {
        updateQuestion(questionIndex);
    };
}

// Uložení upravené otázky
function updateQuestion(index) {
    const questionText = document.getElementById("questionInput").value;
    const answers = [
        { text: document.getElementById("answer1").value, correct: document.getElementById("correct1").checked },
        { text: document.getElementById("answer2").value, correct: document.getElementById("correct2").checked },
        { text: document.getElementById("answer3").value, correct: document.getElementById("correct3").checked },
        { text: document.getElementById("answer4").value, correct: document.getElementById("correct4").checked }
    ];

    // Aktualizace otázky v poli
    questions[index] = {
        question: questionText,
        answers: answers.filter(a => a.text !== ""),
        correct: answers.find(a => a.correct)?.text
    };

    // Aktualizace seznamu otázek
    updateQuestionList();

    // Obnoví tlačítko na "Uložit"
    document.getElementById("saveQuestionBtn").textContent = "Uložit otázku";
    document.getElementById("saveQuestionBtn").onclick = function() {
        saveQuestion();
    };
}

function showGameResults() {
    const resultsPopup = document.createElement('div');
    resultsPopup.style.position = "fixed";
    resultsPopup.style.top = "50%";
    resultsPopup.style.left = "50%";
    resultsPopup.style.transform = "translate(-50%, -50%)";
    resultsPopup.style.backgroundColor = "white";
    resultsPopup.style.padding = "20px";
    resultsPopup.style.border = "2px solid black";
    resultsPopup.style.zIndex = 1000;

    // Celkové skóre
    const scoreElement = document.createElement('h2');
    scoreElement.textContent = `Celkové body: ${score}`;
    resultsPopup.appendChild(scoreElement);

    // Výsledek hodnocení (známka)
    const grade = calculateGrade(score);
    const gradeElement = document.createElement('p');
    gradeElement.textContent = `Známka: ${grade}`;
    resultsPopup.appendChild(gradeElement);

    // Seznam chybně zodpovězených otázek
    const wrongQuestions = getWrongQuestions();
    if (wrongQuestions.length > 0) {
        const wrongQuestionsList = document.createElement('ul');
        wrongQuestionsList.innerHTML = '<h3>Chybně zodpovězené otázky:</h3>';
        wrongQuestions.forEach(question => {
            const li = document.createElement('li');
            li.textContent = question;
            wrongQuestionsList.appendChild(li);
        });
        resultsPopup.appendChild(wrongQuestionsList);
    }

    // Tlačítko pro zavření výsledků
    const closeButton = document.createElement('button');
    closeButton.textContent = "Zavřít";
    closeButton.onclick = function() {
        resultsPopup.style.display = "none";
    };
    resultsPopup.appendChild(closeButton);

    document.body.appendChild(resultsPopup);
}

function getWrongQuestions() {
    // Zde můžete přidat logiku pro získání chybně zodpovězených otázek
    return [];
}

// Funkce pro konec hry
function endGame() {
    // Zastavit běh hry (pokud používáte interval)
    clearInterval(gameIntervalId);

    // Skrytí herního plánu
    document.getElementById("gameArea").style.display = "none"; // Skrytí samotného Tetrisu

    // Zobrazení zprávy o konci hry
    document.getElementById("gameOverMessage").style.display = "block"; // Zobrazí text "Konec hry"

    // Zobrazení konečného skóre
    document.getElementById("finalScore").textContent = "Skóre: " + score;
}

function restartGame() {
    // Obnovit skóre
    score = 0;
    document.getElementById('score').textContent = "Score: 0";

    // Zobrazit herní plochu zpět
    document.getElementById("gameArea").style.display = "block"; // Zobrazí hru

    // Skrytí zprávy o konci hry
    document.getElementById("gameOverMessage").style.display = "none";

    // Obnovit další proměnné a herní stav
    // Například: resetovat herní plátno, generovat nové Tetrimino, atd.
    resetGame(); // Pokud máte funkci pro resetování herní logiky
}


function exportToMoodleXML() {
    if (questions.length === 0) {

        return;
    }

    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<quiz>\n';

    questions.forEach((item, index) => {
        xmlContent += `
        <question type="multichoice">
            <name>
                <text>Otázka ${index + 1}</text>
            </name>
            <questiontext format="html">
                <text><![CDATA[<p>${item.question}</p>]]></text>
            </questiontext>
            <answer fraction="100">
                <text><![CDATA[${item.answers.find(a => a.correct)?.text}]]></text>
            </answer>
            <feedback>
                <text>Správná odpověď!</text>
            </feedback>
            <defaultgrade>${item.points || 1}</defaultgrade>
        </question>\n`;
    });

    xmlContent += '</quiz>';

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "test_data_moodle.xml";
    a.click();
}
