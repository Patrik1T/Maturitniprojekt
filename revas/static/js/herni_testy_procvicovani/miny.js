 const questions = [];
        let score = 0;
        let maxClicks = 0;
        let remainingClicks = 0;
        let timer = null;
        let timeLeft = 0;

        function addAnswer() {
            const answersDiv = document.getElementById('answers');
            const answerContainer = document.createElement('div');
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Enter an answer';

            const checkbox = document.createElement('input');
            checkbox.type = 'radio';
            checkbox.name = 'correct-answer';

            answerContainer.appendChild(input);
            answerContainer.appendChild(checkbox);
            answersDiv.appendChild(answerContainer);
        }

     function saveQuestion() {
    const questionText = document.getElementById('question').value;
    const answerContainers = document.querySelectorAll('#answers div');

    const answers = Array.from(answerContainers).map(container => {
        const input = container.querySelector('input[type="text"]');
        const checkbox = container.querySelector('input[type="radio"]');
        return { text: input.value, correct: checkbox.checked };
    }).filter(a => a.text);

    if (!questionText || answers.length === 0 || !answers.some(a => a.correct)) {

        return;
    }

    const question = { question: questionText, answers, answered: false };
    questions.push(question);
    renderQuestionList();
    updateQuestionCount(); // Aktualizuje zobrazení počtu otázek

    // Resetuje vstupy po uložení otázky
    document.getElementById('question').value = '';
    document.getElementById('answers').innerHTML = '';
}



function renderQuestionList() {
    const list = document.querySelector('#question-list ul');
    list.innerHTML = '';
    questions.forEach((q, index) => {
        const li = document.createElement('li');
        const correctAnswer = q.answers.find(a => a.correct)?.text || 'None';
        li.textContent = `${q.question} (Correct: ${correctAnswer})`;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => {
            questions.splice(index, 1);
            renderQuestionList();
        };
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
}


        function toggleTimerOptions() {
            const timerInput = document.getElementById('timer-value');
            timerInput.style.display = document.getElementById('enable-timer').checked ? 'inline' : 'none';
        }

        function startGame() {
            const board = document.querySelector('.game-board');
            board.innerHTML = '';
            board.style.gridTemplateColumns = `repeat(10, 50px)`;

            maxClicks = parseInt(document.getElementById('max-clicks').value) || 0;
            remainingClicks = maxClicks;
            updateClickDisplay();

            if (document.getElementById('enable-timer').checked) {
                timeLeft = parseInt(document.getElementById('timer-value').value) || 0;
                startTimer();
            }

            const cells = Array.from({ length: 100 }, (_, i) => {
                const div = document.createElement('div');
                div.className = 'cell';
                div.onclick = () => handleCellClick(i, cells);
                board.appendChild(div);
                return div;
            });

            // Randomly place questions
            questions.forEach(q => {
                const index = Math.floor(Math.random() * cells.length);
                cells[index].dataset.question = JSON.stringify(q);
                cells[index].classList.add('question-cell');
            });
        }

function handleCellClick(index, cells) {
    if (remainingClicks <= 0) return;

    remainingClicks--;
    updateClickDisplay();

    const cell = cells[index];
    const questionData = cell.dataset.question;

    if (questionData) {
        showQuestionModal(JSON.parse(questionData), cell);
    } else {
        const gridSize = 10; // Předpokládáme mřížku 10x10
        let nearestDistance = Infinity;
        let hasEqualDistance = false;

        // Najdeme nejbližší otázku do vzdálenosti 5
        questions.forEach((_, questionIndex) => {
            cells.forEach((cell, cellIndex) => {
                if (cell.dataset.question) {
                    const x1 = index % gridSize;
                    const y1 = Math.floor(index / gridSize);
                    const x2 = cellIndex % gridSize;
                    const y2 = Math.floor(cellIndex / gridSize);

                    const distance = Math.abs(x1 - x2) + Math.abs(y1 - y2);
                    if (distance <= 5 && distance < nearestDistance) {
                        nearestDistance = distance;
                        hasEqualDistance = false;
                    } else if (distance === nearestDistance) {
                        hasEqualDistance = true;
                    }
                }
            });
        });

        if (nearestDistance <= 5) {
            // Zobrazíme nejbližší otázku nebo indikaci stejné vzdálenosti
            cell.textContent = hasEqualDistance ? `${nearestDistance}` : `${nearestDistance}`;
        } else {
            // Pokud není otázka v dosahu, zobrazíme 0
            cell.textContent = 0;
        }

        cell.style.backgroundColor = '#f0f0f0';
    }

    if (remainingClicks === 0) {
        endGame('No clicks remaining!');
    }
}




        function showQuestionModal(question, cell) {
            document.querySelector('.overlay').style.display = 'block';
            const modal = document.querySelector('.question-modal');
            modal.style.display = 'block';
            modal.dataset.cellIndex = Array.from(document.querySelectorAll('.cell')).indexOf(cell);
            document.getElementById('modal-question').textContent = question.question;

            const answersDiv = document.getElementById('modal-answers');
            answersDiv.innerHTML = '';
            question.answers.forEach((a, i) => {
                const label = document.createElement('label');
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'answer';
                input.value = i;
                label.appendChild(input);
                label.appendChild(document.createTextNode(a.text));
                answersDiv.appendChild(label);
                answersDiv.appendChild(document.createElement('br'));
            });
        }

        function submitAnswer() {
            const selected = document.querySelector('input[name="answer"]:checked');
            const modal = document.querySelector('.question-modal');
            const cellIndex = modal.dataset.cellIndex;
            const cell = document.querySelectorAll('.cell')[cellIndex];

            if (!selected) {

                return;
            }

            const questionData = JSON.parse(cell.dataset.question);
            const selectedAnswerIndex = parseInt(selected.value, 10);
            const isCorrect = questionData.answers[selectedAnswerIndex].correct;

            if (isCorrect) {
                score++;
                cell.classList.add('correct');
            } else {
                cell.classList.add('incorrect');
            }

            document.getElementById('results').textContent = `Score: ${score}`;

            document.querySelector('.overlay').style.display = 'none';
            modal.style.display = 'none';

            checkEndGame();
        }

        function updateClickDisplay() {
            document.getElementById('remaining-clicks').textContent = `Remaining Clicks: ${remainingClicks}`;
        }

        function startTimer() {
            const timerDisplay = document.getElementById('timer-display');
            timer = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = `Time Left: ${timeLeft}`;

                if (timeLeft <= 0) {
                    clearInterval(timer);
                    endGame('Time is up!');
                }
            }, 1000);
        }


 function endGame(reason) {
    clearInterval(timer);

    // Zobrazí zprávu o konci hry
    const gameOverMessage = document.getElementById('game-over-message');
    const finalScoreText = document.getElementById('final-score');

    finalScoreText.textContent = `Your final score: ${score}`;
    gameOverMessage.style.display = 'block'; // Zobrazí sekci s konečnou zprávou

    // Aktualizuje skóre v sekci výsledků
    document.getElementById('results').textContent = `Game Over! ${reason} Final Score: ${score}`;
}


function resetGame() {
    clearInterval(timer);
    score = 0;
    remainingClicks = maxClicks;
    document.getElementById('results').textContent = 'Score: 0';
    document.getElementById('timer-display').textContent = 'Time Left: -';
    updateClickDisplay();
    startGame();

    // Skrytí zprávy o konci hry při restartu
    document.getElementById('game-over-message').style.display = 'none';

    // Seznam otázek a odpovědí zůstane zachován, jen resetujeme herní hodnoty
}

function checkEndGame() {
    if (remainingClicks <= 0) {
        endGame('No clicks remaining!');
    } else if (questions.every(q => q.answered)) {
        endGame('All questions answered!');
    }
}

function updateQuestionCount() {
    const totalQuestions = questions.length;
    const answeredQuestions = questions.filter(q => q.answered).length;

    document.getElementById('total-questions').textContent = totalQuestions;
    document.getElementById('answered-questions').textContent = answeredQuestions;
}

    // Funkce pro export do HTML
        function exportToHTML() {
            const testName = document.getElementById('testName').value || 'test'; // Získání názvu testu
            let htmlContent = `
                <html>
                    <head>
                        <title>${testName}</title>
                    </head>
                    <body>
                        <h1>${testName}</h1>
                        <ul>
                            ${questions.map(q => `
                                <li>
                                    <p><strong>Question:</strong> ${q.question}</p>
                                    <ul>
                                        ${q.answers.map(a => `
                                            <li>${a.text} ${a.correct ? '(Correct)' : ''}</li>
                                        `).join('')}
                                    </ul>
                                </li>
                            `).join('')}
                        </ul>
                    </body>
                </html>
            `;

            const blob = new Blob([htmlContent], { type: 'text/html' });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `${testName}_test_data.html`;
            a.click();
        }

        // Funkce pro export do JSON
        function exportToJSON() {
            const testName = document.getElementById('testName').value || 'test'; // Získání názvu testu
            const jsonContent = JSON.stringify(questions, null, 2);
            const blob = new Blob([jsonContent], { type: 'application/json' });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `${testName}_test_data.json`;
            a.click();
        }

        // Funkce pro export do Moodle XML
        function exportToMoodleXML() {
            const testName = document.getElementById('testName').value || 'test'; // Získání názvu testu
            let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
            <quiz>
                ${questions.map(q => `
                    <question type="multichoice">
                        <name>
                            <text>${q.question}</text>
                        </name>
                        <questiontext format="html">
                            <text>${q.question}</text>
                        </questiontext>
                        <answer fraction="100">
                            <text>${q.answers.find(a => a.correct)?.text || ''}</text>
                        </answer>
                        ${q.answers.filter(a => !a.correct).map(a => `
                            <answer fraction="0">
                                <text>${a.text}</text>
                            </answer>
                        `).join('')}
                    </question>
                `).join('')}
            </quiz>`;

            const blob = new Blob([xmlContent], { type: 'application/xml' });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `${testName}_test_data.xml`;
            a.click();
        }