    let tables = [];
        let allAnswers = [];
        let timerInterval;
        let timeLeft = 0;

        // Funkce pro přidání tabulky
        function addTable() {
            const tableId = `table-${tables.length + 1}`;
            const tableContainer = document.createElement('div');
            tableContainer.classList.add('table-container');
            tableContainer.id = tableId;

            tableContainer.innerHTML = `
                <label for="tableName-${tableId}">Název tabulky:</label>
                <input type="text" id="tableName-${tableId}" placeholder="Zadejte název tabulky">
                <br>
                <label for="answer-${tableId}">Odpověď:</label>
                <input type="text" id="answer-${tableId}" placeholder="Zadejte odpověď">
                <br>
                <button onclick="addAnswer('${tableId}')">Přidat odpověď</button>
                <ul id="answersList-${tableId}"></ul>
            `;

            document.getElementById('tablesContainer').appendChild(tableContainer);
            tables.push({ id: tableId, name: '', answers: [] });
        }

        // Funkce pro přidání odpovědi do tabulky
        function addAnswer(tableId) {
            const answerInput = document.getElementById(`answer-${tableId}`).value;
            const tableNameInput = document.getElementById(`tableName-${tableId}`).value;
            const answersList = document.getElementById(`answersList-${tableId}`);

            if (answerInput.trim() !== '') {
                const table = tables.find(t => t.id === tableId);
                table.name = tableNameInput.trim() || `Tabulka ${tableId}`;

                const answerObj = { id: `answer-${table.answers.length + 1}`, text: answerInput };
                table.answers.push(answerObj);

                const answerItem = document.createElement('li');
                answerItem.id = answerObj.id;
                answerItem.innerHTML = `${answerObj.text}`;

                // Add remove button to each answer
                const removeButton = document.createElement('button');
                removeButton.classList.add('remove-btn');
                removeButton.textContent = 'Smazat';
                removeButton.onclick = () => removeAnswer(answerItem, tableId, answerObj);

                answerItem.appendChild(removeButton);
                answersList.appendChild(answerItem);

                document.getElementById(`answer-${tableId}`).value = '';
            }
        }

        // Funkce pro odstranění odpovědi
        function removeAnswer(answerItem, tableId, answerObj) {
            // Remove the answer from the list and table
            const table = tables.find(t => t.id === tableId);
            table.answers = table.answers.filter(a => a.id !== answerObj.id);
            answerItem.remove();
        }

        // Funkce pro náhled testu
        function previewTest() {
            // Pokud je povolený časomíra, nastavíme odpočítávání
            if (document.getElementById('enableTimer').checked) {
                timeLeft = parseInt(document.getElementById('timer').value) * 60; // převedení minut na sekundy
                startTimer();
            }

            const answersListContainer = document.getElementById('answersList');
            answersListContainer.innerHTML = '';
            allAnswers = [];

            tables.forEach(table => {
                table.answers.forEach(answer => {
                    allAnswers.push(answer.text);
                });
            });

            // Náhodně zamíchejte odpovědi
            allAnswers = shuffleArray(allAnswers);

            allAnswers.forEach(answer => {
                const answerElement = document.createElement('div');
                answerElement.classList.add('answer-item');
                answerElement.setAttribute('draggable', true);
                answerElement.textContent = answer;
                answerElement.ondragstart = drag;
                answersListContainer.appendChild(answerElement);
            });

            // Vytvoření tabulek pro přiřazování odpovědí
            const tablesForDrag = document.getElementById('tablesForDrag');
            tablesForDrag.innerHTML = '';

            tables.forEach((table, index) => {
                const dropArea = document.createElement('div');
                dropArea.classList.add('drop-area');
                dropArea.setAttribute('id', `dropArea-${index}`);
                dropArea.setAttribute('ondrop', 'drop(event)');
                dropArea.setAttribute('ondragover', 'allowDrop(event)');

                dropArea.innerHTML = `<h3>${table.name}</h3>`;
                tablesForDrag.appendChild(dropArea);
            });

            document.getElementById('testPreview').style.display = 'block';
        }

        // Funkce pro zamíchání odpovědí
        function shuffleArray(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }

        // Funkce pro povolení dropu
        function allowDrop(event) {
            event.preventDefault();
        }

        // Funkce pro dragování
        function drag(event) {
            event.dataTransfer.setData('text', event.target.textContent);
        }

        // Funkce pro spuštění dropu
        function drop(event) {
            event.preventDefault();
            const answerText = event.dataTransfer.getData('text');
            const dropArea = event.target.closest('.drop-area');
            if (!dropArea) return;

            // Přidání odpovědi do tabulky
            const resultItem = document.createElement('div');
            resultItem.textContent = answerText;

            // Přidání tlačítka pro smazání
            const removeButton = document.createElement('button');
            removeButton.classList.add('remove-btn');
            removeButton.textContent = 'Smazat';
            removeButton.onclick = () => resultItem.remove();

            resultItem.appendChild(removeButton);
            dropArea.appendChild(resultItem);
        }

        // Funkce pro odeslání testu a zobrazení výsledků
      function submitTest() {
    let correctAnswers = 0;
    let totalAnswers = 0;

    tables.forEach((table, index) => {
        const dropArea = document.getElementById(`dropArea-${index}`);
        const assignedAnswers = Array.from(dropArea.children)
            .map(child => child.textContent.replace('Smazat', '').trim());

        table.answers.forEach(answer => {
            totalAnswers++;
            if (assignedAnswers.includes(answer.text)) {
                correctAnswers++;
            }
        });
    });

    const incorrectAnswers = totalAnswers - correctAnswers;

    // Výpočet známky
    const grade = calculateGrade(correctAnswers);

    // Zobrazení výsledků
    const resultContent = document.getElementById('resultContent');
    resultContent.innerHTML = `
        <p>Celkem: ${totalAnswers} odpovědí</p>
        <p>Správně: ${correctAnswers} odpovědí</p>
        <p>Špatně: ${incorrectAnswers} odpovědí</p>
        <p>Vaše známka: ${grade}</p>
    `;
    document.getElementById('results').style.display = 'block';

    if (timerInterval) {
        clearInterval(timerInterval);
    }
}


        // Funkce pro výpočet známky na základě počtu správných odpovědí
        function calculateGrade(correctAnswers) {
            const grade1 = parseInt(document.getElementById('grade1').value);
            const grade2 = parseInt(document.getElementById('grade2').value);
            const grade3 = parseInt(document.getElementById('grade3').value);
            const grade4 = parseInt(document.getElementById('grade4').value);
            const grade5 = parseInt(document.getElementById('grade5').value);

            if (correctAnswers >= grade1) return "1 (výborný)";
            if (correctAnswers >= grade2) return "2 (chvalitebný)";
            if (correctAnswers >= grade3) return "3 (dobrý)";
            if (correctAnswers >= grade4) return "4 (dostatečný)";
            return "5 (nedostatečný)";
        }

        // Funkce pro spuštění časomíry
        function startTimer() {
            timerInterval = setInterval(function() {
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    alert("Čas vypršel!");
                } else {
                    timeLeft--;
                    let minutes = Math.floor(timeLeft / 60);
                    let seconds = timeLeft % 60;
                    document.getElementById('timerDisplay').textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;
                }
            }, 1000);
        }

        // Funkce pro formátování času na MM:SS
        function formatTime(time) {
            return time < 10 ? `0${time}` : time;
        }

 function exportToJson() {
    const testData = {
        tables: tables.map(table => ({
            name: table.name,
            answers: table.answers.map(answer => answer.text)
        }))
    };
    const jsonString = JSON.stringify(testData, null, 2);
    saveAs(new Blob([jsonString], { type: 'application/json' }), 'test.json');
}

function exportToHtml() {
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="cs">
    <head>
        <meta charset="UTF-8">
        <title>Test s přiřazováním odpovědí</title>
    </head>
    <body>
        <h1>Test s přiřazováním odpovědí</h1>`;

    tables.forEach(table => {
        htmlContent += `
        <h2>${table.name}</h2>
        <ul>`;
        table.answers.forEach(answer => {
            htmlContent += `<li>${answer.text}</li>`;
        });
        htmlContent += `</ul>`;
    });

    htmlContent += `
    </body>
    </html>`;

    saveAs(new Blob([htmlContent], { type: 'text/html' }), 'test.html');
}
function exportToXml() {
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<quiz>\n`;

    tables.forEach(table => {
        xmlContent += `
        <question type="matching">
            <name>
                <text>${table.name}</text>
            </name>
            <questiontext format="html">
                <text><![CDATA[<p>${table.name}</p>]]></text>
            </questiontext>
            <shuffleanswers>true</shuffleanswers>
            <subquestions>`;

        table.answers.forEach(answer => {
            xmlContent += `
                <subquestion>
                    <text><![CDATA[${answer.text}]]></text>
                    <answer><![CDATA[${answer.text}]]></answer>
                </subquestion>`;
        });

        xmlContent += `
            </subquestions>
        </question>`;
    });

    xmlContent += `\n</quiz>`;
    saveAs(new Blob([xmlContent], { type: 'application/xml' }), 'test.xml');
}