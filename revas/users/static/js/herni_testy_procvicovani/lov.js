     let questions = [];
        let treasures = [];
        let score = 0;
        let answeredTreasures = 0;

        // Přidání odpovědi
        function addAnswer() {
            const answerDiv = document.createElement('div');
            answerDiv.innerHTML = `
                <input type="text" placeholder="Odpověď">
                <input type="checkbox"> Správná
                <button onclick="this.parentElement.remove()">Odstranit</button>
            `;
            document.getElementById('answersContainer').appendChild(answerDiv);
        }

        // Uložení otázky
        function saveQuestion() {
            const questionText = document.getElementById('newQuestion').value;
            const answers = Array.from(document.querySelectorAll('#answersContainer div')).map(div => ({
                text: div.querySelector('input[type="text"]').value,
                correct: div.querySelector('input[type="checkbox"]').checked
            }));
            if (!questionText || answers.length < 2 || !answers.some(a => a.correct)) {
                alert('Zadejte platnou otázku a odpovědi!');
                return;
            }
            questions.push({ text: questionText, answers });
            renderQuestions();
            document.getElementById('newQuestion').value = '';
            document.getElementById('answersContainer').innerHTML = '';
        }

        // Zobrazení seznamu otázek
        function renderQuestions() {
            const questionList = document.getElementById('questionList');
            questionList.innerHTML = questions.map((q, i) => `
                <li>
                    ${q.text} (Správné: ${q.answers.filter(a => a.correct).map(a => a.text).join(', ')})
                    <button onclick="editQuestion(${i})">Upravit</button>
                    <button onclick="deleteQuestion(${i})">Smazat</button>
                </li>
            `).join('');
        }

        // Editace otázky
        function editQuestion(index) {
            const question = questions[index];
            document.getElementById('newQuestion').value = question.text;
            document.getElementById('answersContainer').innerHTML = question.answers.map(a => `
                <div>
                    <input type="text" value="${a.text}">
                    <input type="checkbox" ${a.correct ? 'checked' : ''}> Správná
                    <button onclick="this.parentElement.remove()">Odstranit</button>
                </div>
            `).join('');
            questions.splice(index, 1);
        }

        // Smazání otázky
        function deleteQuestion(index) {
            questions.splice(index, 1);
            renderQuestions();
        }

        // Zahájení hry
        function startGame() {
            document.getElementById('settings').style.display = 'none';
            document.getElementById('gameArea').style.display = 'block';
            generateTreasures();
        }

        // Generování pokladů
        function generateTreasures() {
            const gameArea = document.getElementById('gameArea');
            treasures = [];
            const totalTreasures = questions.length;
            const totalFakeTreasures = totalTreasures * 5; // 5 falešných pokladů na skutečný poklad

            // Vytvoření skutečných pokladů (otázky)
            for (let i = 0; i < totalTreasures; i++) {
                const treasure = document.createElement('div');
                treasure.className = 'treasure';
                treasure.style.top = `${Math.random() * (gameArea.clientHeight - 30)}px`;
                treasure.style.left = `${Math.random() * (gameArea.clientWidth - 30)}px`;
                treasure.innerHTML = '?';
                treasure.setAttribute('data-question-index', i); // Uložení indexu otázky
                treasure.setAttribute('data-fake', 'false'); // Označení skutečného pokladu
                gameArea.appendChild(treasure);
                treasures.push(treasure);
            }

            // Vytvoření falešných pokladů (bez otázky)
            for (let i = 0; i < totalFakeTreasures; i++) {
                const fakeTreasure = document.createElement('div');
                fakeTreasure.className = 'treasure';
                fakeTreasure.style.top = `${Math.random() * (gameArea.clientHeight - 30)}px`;
                fakeTreasure.style.left = `${Math.random() * (gameArea.clientWidth - 30)}px`;
                fakeTreasure.innerHTML = '?';
                fakeTreasure.setAttribute('data-fake', 'true'); // Označení falešného pokladu
                gameArea.appendChild(fakeTreasure);
                treasures.push(fakeTreasure);
            }

            document.addEventListener('keydown', (e) => movePlayer(e));
        }

        // Pohyb hráče
        function movePlayer(e) {
            const player = document.querySelector('.player');
            const step = 10;
            const bounds = player.parentElement.getBoundingClientRect();
            const rect = player.getBoundingClientRect();

            switch (e.key) {
                case 'ArrowUp':
                    if (rect.top > bounds.top) player.style.top = `${player.offsetTop - step}px`;
                    break;
                case 'ArrowDown':
                    if (rect.bottom < bounds.bottom) player.style.top = `${player.offsetTop + step}px`;
                    break;
                case 'ArrowLeft':
                    if (rect.left > bounds.left) player.style.left = `${player.offsetLeft - step}px`;
                    break;
                case 'ArrowRight':
                    if (rect.right < bounds.right) player.style.left = `${player.offsetLeft + step}px`;
                    break;
            }
            checkTreasureCollision(player);
        }

        // Kolize s pokladem
        function checkTreasureCollision(player) {
            treasures.forEach(treasure => {
                const playerRect = player.getBoundingClientRect();
                const treasureRect = treasure.getBoundingClientRect();

                if (
                    playerRect.top < treasureRect.bottom &&
                    playerRect.bottom > treasureRect.top &&
                    playerRect.left < treasureRect.right &&
                    playerRect.right > treasureRect.left &&
                    !treasure.hasAttribute('data-answered') // Nezodpovězený poklad
                ) {
                    if (treasure.getAttribute('data-fake') === 'true') {
                        // Falešný poklad - neudělej nic
                        console.log('Falešný poklad nalezen.');
                    } else {
                        // Skutečný poklad - zobrazí otázku na kartě
                        showQuestion(treasure);
                    }
                }
            });
        }

        // Zobrazení otázky na kartě
        function showQuestion(treasure) {
            const questionIndex = treasure.getAttribute('data-question-index');
            const question = questions[questionIndex];
            const questionCard = document.getElementById('questionCard');
            const questionText = document.getElementById('questionText');
            const answerOptions = document.getElementById('answerOptions');

            questionText.innerText = question.text;
            answerOptions.innerHTML = '';

            question.answers.forEach(answer => {
                const button = document.createElement('button');
                button.innerText = answer.text;
                button.onclick = () => {
                    if (answer.correct) {
                        score += 10; // Případné zvýšení skóre
                        document.getElementById('score').innerText = `Body: ${score}`;
                    }
                    treasure.setAttribute('data-answered', 'true');
                    questionCard.style.display = 'none';

                    // Po zodpovězení pokladu inkrementuj počet zodpovězených pokladů
                    answeredTreasures++;

                    // Kontrola, zda všechny skutečné poklady byly zodpovězeny
                    if (answeredTreasures === questions.length) {
                        endGame(); // Konec hry
                    }
                };
                answerOptions.appendChild(button);
            });

            questionCard.style.display = 'block';
        }

        // Konec hry
        function endGame() {
            const gameOverModal = document.getElementById('gameOverModal');
            const finalScore = document.getElementById('finalScore');
            finalScore.innerText = `Skóre: ${score}`;
            gameOverModal.style.display = 'flex';
        }

        // Restartování hry
        function restartGame() {
            location.reload(); // Restartování celé stránky pro novou hru
        }
        function saveToHTML() {
    let htmlContent = '<h1>Otázky a odpovědi</h1><ul>';
    questions.forEach(question => {
        htmlContent += `<li><strong>${question.text}</strong><ul>`;
        question.answers.forEach(answer => {
            htmlContent += `<li>${answer.text} - ${answer.correct ? 'Správná' : 'Nesprávná'}</li>`;
        });
        htmlContent += '</ul></li>';
    });
    htmlContent += '</ul>';

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'otazky.html';
    link.click();
}
function saveToXML() {
    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?><quiz>';

    questions.forEach((question, index) => {
        xmlContent += `<question type="multichoice">
            <name>
                <text>${question.text}</text>
            </name>
            <questiontext format="html">
                <text>${question.text}</text>
            </questiontext>
            <answer fraction="100">
                <text>${question.answers.filter(a => a.correct)[0].text}</text>
            </answer>`;

        question.answers.forEach(answer => {
            if (!answer.correct) {
                xmlContent += `<answer fraction="0">
                    <text>${answer.text}</text>
                </answer>`;
            }
        });

        xmlContent += '</question>';
    });

    xmlContent += '</quiz>';

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'otazky.xml';
    link.click();
}
function saveToJSON() {
    const jsonContent = JSON.stringify(questions, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'otazky.json';
    link.click();
}
