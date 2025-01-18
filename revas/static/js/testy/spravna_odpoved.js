  let pairs = [];
    let connections = [];
    let currentQuestion = null;

    function addPair() {
        const questionInput = document.getElementById('questionInput');
        const answerInput = document.getElementById('answerInput');
        const pointsInput = document.getElementById('pointsInput');
        const questionText = questionInput.value;
        const answerText = answerInput.value;
        const points = parseInt(pointsInput.value);

       if (questionText && answerText && !isNaN(points)) {
    pairs.push({ question: questionText, answer: answerText, points: points });

    const pairDiv = document.createElement('div');
    pairDiv.classList.add('pair');
    pairDiv.innerHTML = `<strong>Otázka:</strong> ${questionText} <strong>Odpověď:</strong> ${answerText} <strong>Bodová hodnota:</strong> ${points}`;
    document.getElementById('pairsList').appendChild(pairDiv);

    questionInput.value = '';
    answerInput.value = '';
    pointsInput.value = '';
} else {
    alert('Vyplňte prosím otázku, odpověď a bodovou hodnotu!');
}

    }

    function startTest() {
        if (pairs.length < 1) {
            alert('Musíte přidat alespoň jeden pár!');
            return;
        }

        // Zamíchejte otázky a odpovědi samostatně
        const shuffledQuestions = [...pairs].map(pair => pair.question).sort(() => Math.random() - 0.5);
        const shuffledAnswers = [...pairs].map(pair => pair.answer).sort(() => Math.random() - 0.5);

        const testContentDiv = document.getElementById('testContent');
        testContentDiv.innerHTML = '';

        const testContainer = document.createElement('div');
        testContainer.classList.add('test-container');

        const questionsContainer = document.createElement('div');
        const answersContainer = document.createElement('div');
        questionsContainer.classList.add('test-item');
        answersContainer.classList.add('test-item');

        shuffledQuestions.forEach(question => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('draggable');
            questionElement.textContent = question;
            questionElement.setAttribute('data-type', 'question');
            questionElement.onclick = handleClick;
            questionsContainer.appendChild(questionElement);
        });

        shuffledAnswers.forEach(answer => {
            const answerElement = document.createElement('div');
            answerElement.classList.add('draggable');
            answerElement.textContent = answer;
            answerElement.setAttribute('data-type', 'answer');
            answerElement.onclick = handleClick;
            answersContainer.appendChild(answerElement);
        });

        testContainer.appendChild(questionsContainer);
        testContainer.appendChild(answersContainer);
        testContentDiv.appendChild(testContainer);

        document.getElementById('testSection').style.display = 'block';
        document.getElementById('pairsList').style.display = 'none';
    }

    function handleClick(event) {
        const element = event.target;
        const type = element.getAttribute('data-type');

        if (type === 'question') {
            if (currentQuestion) {
                currentQuestion.style.backgroundColor = '';
            }
            currentQuestion = element;
            element.style.backgroundColor = '#ffcccb';
        } else if (type === 'answer' && currentQuestion) {
            // Vytvoření propojení
            const connection = { question: currentQuestion.textContent, answer: element.textContent };
            connections.push(connection);

            // Vizuální zobrazení propojení
            const connectionLine = document.createElement('div');
            connectionLine.classList.add('connection-line');
            connectionLine.innerHTML = `
                ${connection.question} ↔ ${connection.answer}
                <button class="remove-btn" onclick="removeConnection('${connection.question}', '${connection.answer}', this)">Odstranit</button>
            `;

            document.getElementById('testContent').appendChild(connectionLine);

            // Resetování aktuální otázky
            currentQuestion.style.backgroundColor = '';
            currentQuestion = null;
        }
    }

    function removeConnection(question, answer, buttonElement) {
        // Odstranění propojení z pole connections
        connections = connections.filter(connection =>
            !(connection.question === question && connection.answer === answer)
        );

        // Odstranění vizuálního zobrazení propojení
        buttonElement.parentElement.remove();
    }

    function checkTest() {
        let totalPoints = 0;
        let correctPoints = 0;

        connections.forEach(connection => {
            const pair = pairs.find(pair => pair.question === connection.question && pair.answer === connection.answer);
            if (pair) {
                correctPoints += pair.points;
            }
        });

        totalPoints = pairs.reduce((sum, pair) => sum + pair.points, 0);

        const grade = calculateGrade(correctPoints, totalPoints);
        displayResults(correctPoints, totalPoints, grade);
    }

    function calculateGrade(correctPoints, totalPoints) {
        const percentage = (correctPoints / totalPoints) * 100;

        // Načteme hodnoty z formuláře pro bodování
        const grade1 = parseInt(document.getElementById('grade1').value);
        const grade2 = parseInt(document.getElementById('grade2').value);
        const grade3 = parseInt(document.getElementById('grade3').value);
        const grade4 = parseInt(document.getElementById('grade4').value);
        const grade5 = parseInt(document.getElementById('grade5').value);

        // Určování známky na základě procenta a bodových prahů
        if (percentage >= grade1) return '1';
        if (percentage >= grade2) return '2';
        if (percentage >= grade3) return '3';
        if (percentage >= grade4) return '4';
        return '5';
    }

    function displayResults(correctPoints, totalPoints, grade) {
        const resultTablesDiv = document.getElementById('resultTables');
        resultTablesDiv.innerHTML = '';

        const resultTable = document.createElement('table');
        resultTable.innerHTML = `
            <thead>
                <tr>
                    <th>Otázka</th>
                    <th>Odpověď</th>
                    <th>Výsledek</th>
                    <th>Bodová hodnota</th>
                </tr>
            </thead>
            <tbody>
                ${connections.map(connection => {
                    const pair = pairs.find(pair => pair.question === connection.question && pair.answer === connection.answer);
                    const isCorrect = pair ? 'Správně' : 'Špatně';
                    return `
                        <tr style="background-color: ${isCorrect === 'Správně' ? 'lightgreen' : 'lightcoral'}">
                            <td>${connection.question}</td>
                            <td>${connection.answer}</td>
                            <td>${isCorrect}</td>
                            <td>${pair ? pair.points : 0}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        `;

        resultTablesDiv.appendChild(resultTable);
        document.getElementById('testResult').textContent = `Počet správně spojených bodů: ${correctPoints} z ${totalPoints}`;
        document.getElementById('testGrade').textContent = `Známka: ${grade}`;
        document.getElementById('resultSection').style.display = 'block';
    }

    function restartTest() {
        connections = [];
        startTest();
    }

    function saveToHTML() {
    const testName = document.getElementById('testName').value;
    const testDescription = document.getElementById('testDescription').value;

    let htmlContent = `
        <html>
            <head><title>${testName}</title></head>
            <body>
                <h1>${testName}</h1>
                <p>${testDescription}</p>
                <h2>Otázky a Odpovědi:</h2>
                <ul>
    `;

    pairs.forEach(pair => {
        htmlContent += `
            <li>
                <strong>Otázka:</strong> ${pair.question}<br>
                <strong>Odpověď:</strong> ${pair.answer}<br>
                <strong>Bodová hodnota:</strong> ${pair.points}
            </li>
        `;
    });

    htmlContent += `
        </ul>
    </body>
    </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${testName}.html`;
    link.click();
}


function saveToJSON() {
    const testName = document.getElementById('testName').value;
    const testDescription = document.getElementById('testDescription').value;

    const data = {
        name: testName,
        description: testDescription,
        questionsAndAnswers: pairs
    };

    const jsonContent = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${testName}.json`;
    link.click();
}


function saveToXML() {
    const testName = document.getElementById('testName').value;
    const testDescription = document.getElementById('testDescription').value;

    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<quiz>
    <name>${testName}</name>
    <description>${testDescription}</description>
`;

    pairs.forEach(pair => {
        xmlContent += `
    <question type="multichoice">
        <name>
            <text>${pair.question}</text>
        </name>
        <questiontext format="html">
            <text><![CDATA[${pair.question}]]></text>
        </questiontext>
        <answer fraction="100">
            <text>${pair.answer}</text>
        </answer>
        <feedback>
            <text>Správná odpověď!</text>
        </feedback>
        <defaultgrade>${pair.points}</defaultgrade>
    </question>
`;
    });

    xmlContent += `</quiz>`;

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${testName}.xml`;
    link.click();
}