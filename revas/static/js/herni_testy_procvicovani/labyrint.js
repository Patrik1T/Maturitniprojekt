        let questions = [];
        let score = 0;
        let answeredQuestions = 0;
        let playerPosition = { x: 0, y: 0 };  // Inicializace pozice hráče
        let gridSize = 15;  // Velikost mřížky
        let gameArea;
        let questionTiles = [];
        let obstacles = [];
        let exitTile = { x: gridSize - 1, y: gridSize - 1 };  // Výstupní bod

        function addAnswer() {
            const answerDiv = document.createElement('div');
            answerDiv.innerHTML = `
                <input type="text" placeholder="Odpověď">
                <input type="checkbox"> Správná
                <button onclick="this.parentElement.remove()">Odstranit</button>
            `;
            document.getElementById('answersContainer').appendChild(answerDiv);
        }

        function saveQuestion() {
            const questionText = document.getElementById('newQuestion').value;
            const answers = Array.from(document.querySelectorAll('#answersContainer div')).map(div => ({
                text: div.querySelector('input[type="text"]').value,
                correct: div.querySelector('input[type="checkbox"]').checked
            }));
            if (!questionText || answers.length < 2 || !answers.some(a => a.correct)) {

                return;
            }
            questions.push({ text: questionText, answers });
            renderQuestions();
            document.getElementById('newQuestion').value = '';
            document.getElementById('answersContainer').innerHTML = '';
        }

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

        function deleteQuestion(index) {
            questions.splice(index, 1);
            renderQuestions();
        }

        function startGame() {
            document.getElementById('settings').style.display = 'none';
            document.getElementById('gameArea').style.display = 'block';
            gameArea = document.getElementById('gameArea');
            generateMaze();
            renderPlayer();
            document.addEventListener('keydown', handleMovement);
        }

     function generateMaze() {
    const tileSize = gameArea.clientWidth / gridSize;
    questionTiles = [];
    obstacles = [];

    // Vytvoření herního pole
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.style.top = `${y * tileSize}px`;
            tile.style.left = `${x * tileSize}px`;

            // Náhodně generujeme překážky (černé čtverečky)
            if (Math.random() < 0.2) {
                const obstacle = document.createElement('div');
                obstacle.classList.add('obstacle');
                obstacle.style.top = `${y * tileSize}px`;
                obstacle.style.left = `${x * tileSize}px`;
                gameArea.appendChild(obstacle);
                obstacles.push({ x, y });
            }

            gameArea.appendChild(tile);
        }
    }

    // Generování náhodných šedých čtverečků s otázkami
    while (questionTiles.length < questions.length) {
        const randomX = Math.floor(Math.random() * gridSize);
        const randomY = Math.floor(Math.random() * gridSize);
        if (!obstacles.some(obs => obs.x === randomX && obs.y === randomY) && !questionTiles.some(qt => qt.x === randomX && qt.y === randomY)) {
            questionTiles.push({ x: randomX, y: randomY });
            const questionTile = document.createElement('div');
            questionTile.classList.add('questionTile');
            questionTile.style.top = `${randomY * 40}px`;
            questionTile.style.left = `${randomX * 40}px`;
            questionTile.setAttribute('data-index', questionTiles.length - 1);  // Přidání indexu
            gameArea.appendChild(questionTile);
        }
    }

    // Generování výstupního čtverce
    const exitTileElement = document.createElement('div');
    exitTileElement.classList.add('exitTile');
    exitTileElement.style.top = `${exitTile.y * 40}px`;
    exitTileElement.style.left = `${exitTile.x * 40}px`;
    gameArea.appendChild(exitTileElement);
}


        function renderPlayer() {
            const playerElement = document.querySelector('.player');
            const tileSize = gameArea.clientWidth / gridSize;
            playerElement.style.top = `${playerPosition.y * tileSize}px`;
            playerElement.style.left = `${playerPosition.x * tileSize}px`;
        }

        function handleMovement(event) {
            const tileSize = gameArea.clientWidth / gridSize;
            switch (event.key) {
                case 'ArrowUp':   // Nahoru
                    if (playerPosition.y > 0 && !isObstacle(playerPosition.x, playerPosition.y - 1)) playerPosition.y--;
                    break;
                case 'ArrowDown': // Doleva
                    if (playerPosition.y < gridSize - 1 && !isObstacle(playerPosition.x, playerPosition.y + 1)) playerPosition.y++;
                    break;
                case 'ArrowLeft': // Doleva
                    if (playerPosition.x > 0 && !isObstacle(playerPosition.x - 1, playerPosition.y)) playerPosition.x--;
                    break;
                case 'ArrowRight': // Vpravo
                    if (playerPosition.x < gridSize - 1 && !isObstacle(playerPosition.x + 1, playerPosition.y)) playerPosition.x++;
                    break;
            }

            renderPlayer();

            // Zkontroluj, jestli hráč stál na otázkovém čtverci
            questionTiles.forEach((tile, index) => {
                if (tile.x === playerPosition.x && tile.y === playerPosition.y) {
                    showQuestion(index);
                }
            });

            // Zkontroluj, jestli hráč došel na výstup
            if (playerPosition.x === exitTile.x && playerPosition.y === exitTile.y) {
                endGame();
            }
        }

        function isObstacle(x, y) {
            return obstacles.some(obs => obs.x === x && obs.y === y);
        }

   function showQuestion(index) {
    const question = questions[index];
    const questionCard = document.getElementById('questionCard');
    const questionText = document.getElementById('questionText');
    const answerOptions = document.getElementById('answerOptions');
    const questionTile = gameArea.querySelector(`.questionTile[data-index="${index}"]`);

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
            answeredQuestions++;
            // Označení čtverce jako zodpovězeného
            questionTile.style.backgroundColor = '#d3d3d3';  // Například šedý
            if (answeredQuestions === questions.length) {
                endGame(); // Konec hry
            }
            questionCard.style.display = 'none';
        };
        answerOptions.appendChild(button);
    });

    questionCard.style.display = 'block';
}

 function endGame() {
    const resultCard = document.createElement('div');
    resultCard.style.position = 'fixed';
    resultCard.style.top = '50%';
    resultCard.style.left = '50%';
    resultCard.style.transform = 'translate(-50%, -50%)';
    resultCard.style.backgroundColor = '#fff';
    resultCard.style.padding = '20px';
    resultCard.style.borderRadius = '10px';
    resultCard.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    resultCard.style.width = '300px';
    resultCard.style.textAlign = 'center';
    resultCard.innerHTML = `
        <h2>Gratulujeme!</h2>
        <p>Vaše skóre je: ${score}</p>
        <button onclick="location.reload()">Zkuste to znovu</button>
    `;
    document.body.appendChild(resultCard);
}

  // Funkce pro uložení testu jako HTML soubor
        function saveTestAsHTML() {
            const testName = document.getElementById('testName').value;
            const testDescription = document.getElementById('testDescription').value;
            const htmlContent = `
                <html lang="cs">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>${testName}</title>
                    </head>
                    <body>
                        <h1>${testName}</h1>
                        <p>${testDescription}</p>
                    </body>
                </html>
            `;
            downloadFile(htmlContent, `${testName}.html`, 'text/html');
        }

        // Funkce pro uložení testu jako XML soubor ve formátu Moodle
        function saveTestAsXML() {
            const testName = document.getElementById('testName').value;
            const testDescription = document.getElementById('testDescription').value;

            const xmlContent = `
                <?xml version="1.0" encoding="UTF-8"?>
                <quiz>
                    <question type="category">
                        <category>
                            <text>$course$/default</text>
                        </category>
                    </question>
                    <question type="general">
                        <name>
                            <text>${testName}</text>
                        </name>
                        <questiontext format="html">
                            <text><![CDATA[${testDescription}]]></text>
                        </questiontext>
                    </question>
                </quiz>
            `;
            downloadFile(xmlContent, `${testName}.xml`, 'application/xml');
        }

        // Funkce pro uložení testu jako JSON soubor
        function saveTestAsJSON() {
            const testName = document.getElementById('testName').value;
            const testDescription = document.getElementById('testDescription').value;

            const jsonContent = JSON.stringify({
                name: testName,
                description: testDescription
            }, null, 2); // formátování pro lepší čitelnost

            downloadFile(jsonContent, `${testName}.json`, 'application/json');
        }

        // Funkce pro vytvoření souboru a jeho stažení
        function downloadFile(content, fileName, mimeType) {
            const blob = new Blob([content], { type: mimeType });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
        }