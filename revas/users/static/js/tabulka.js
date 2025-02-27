 let tableCount = 0;
    let questionCount = 0;
    let timerInterval;
    let totalTime = 0;
    let timeRemaining = 0;

    // Funkce pro přidání tabulky
    function addTable() {
        tableCount++;
        const tableTemplate = `
        <div class="table-wrapper" id="table${tableCount}">
            <div class="table-name">
                <label for="table${tableCount}_name">Název tabulky:</label>
                <input type="text" id="table${tableCount}_name" placeholder="Zadejte název tabulky" required>
            </div>
            <div class="questions-container" id="table${tableCount}_questions"></div>
            <button type="button" class="add-question-btn" onclick="addQuestion(${tableCount})">Přidat otázku do tabulky</button>
            <button type="button" class="delete-question-btn" onclick="deleteTable(${tableCount})">Smazat tabulku</button>
        </div>`;
        document.getElementById('tablesContainer').insertAdjacentHTML('beforeend', tableTemplate);
    }

    // Funkce pro smazání tabulky
    function deleteTable(tableId) {
        const tableElement = document.getElementById(`table${tableId}`);
        tableElement.remove();
    }

    // Funkce pro přidání otázky do tabulky
    function addQuestion(tableId) {
        questionCount++;
        const questionTemplate = `
        <div class="question-wrapper" id="question${questionCount}">
            <div class="question">
                <label for="question${questionCount}_text">Otázka ${questionCount}:</label>
                <input type="text" name="question${questionCount}_text" placeholder="Zadejte otázku" required>
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
        </div>`;
        document.getElementById(`table${tableId}_questions`).insertAdjacentHTML('beforeend', questionTemplate);
    }

    // Funkce pro náhled testu
    function previewTest() {
        const testName = document.getElementById('testName').value;
        const tables = getTables();

        if (!testName || tables.length === 0) {
            alert('Přidejte tabulky a název testu');
            return;
        }

        let testContent = `<h3>${testName}</h3>`;
        tables.forEach((table, index) => {
            testContent += `<h4>${table.name}</h4><ul>`;
            table.questions.forEach(question => {
                testContent += `
                <li>
                    <p>${question.text}</p>
                    <ul>
                        <li>${question.options[0]}</li>
                        <li>${question.options[1]}</li>
                        <li>${question.options[2]}</li>
                        <li>${question.options[3]}</li>
                    </ul>
                </li>`;
            });
            testContent += `</ul>`;
        });

        document.getElementById('testContent').innerHTML = testContent;
        document.getElementById('previewTest').style.display = 'block';
    }

    // Funkce pro získání tabulek a jejich dat
    function getTables() {
        const tables = [];
        for (let i = 1; i <= tableCount; i++) {
            const tableName = document.getElementById(`table${i}_name`).value;
            const questions = [];
            const questionWrappers = document.querySelectorAll(`#table${i} .question-wrapper`);

            questionWrappers.forEach(questionWrapper => {
                const questionText = questionWrapper.querySelector('input[name$="_text"]').value;
                const options = [
                    questionWrapper.querySelector('input[name$="_option1"]').value,
                    questionWrapper.querySelector('input[name$="_option2"]').value,
                    questionWrapper.querySelector('input[name$="_option3"]').value,
                    questionWrapper.querySelector('input[name$="_option4"]').value
                ];
                questions.push({ text: questionText, options });
            });

            if (tableName && questions.length > 0) {
                tables.push({ name: tableName, questions });
            }
        }
        return tables;
    }

    // Funkce pro uložení testu
    function saveTest(type) {
        const testName = document.getElementById('testName').value;
        const tables = getTables();

        if (!testName || tables.length === 0) {
            alert('Přidejte tabulky a název testu');
            return;
        }

        // Zde můžete uložit test na server nebo do souboru
        console.log('Ukládám test jako ' + type, testName, tables);
    }

    // Funkce pro uložení testu jako HTML
    function saveAsHtml() {
        const testName = document.getElementById('testName').value;
        const tables = getTables();

        if (!testName || tables.length === 0) {
            alert('Přidejte tabulky a název testu');
            return;
        }

        let htmlContent = `
        <!DOCTYPE html>
        <html lang="cs">
        <head><meta charset="UTF-8"><title>${testName}</title></head>
        <body>
        <h1>${testName}</h1>`;

        tables.forEach(table => {
            htmlContent += `<h2>${table.name}</h2><ul>`;
            table.questions.forEach(question => {
                htmlContent += `<li><strong>${question.text}</strong><ul>`;
                question.options.forEach(option => {
                    htmlContent += `<li>${option}</li>`;
                });
                htmlContent += `</ul></li>`;
            });
            htmlContent += `</ul>`;
        });

        htmlContent += `</body></html>`;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${testName}.html`;
        link.click();
    }

    // Funkce pro ukončení testu
    function endTest() {
        alert("Test byl ukončen.");
        document.getElementById('previewTest').style.display = 'none';
    }