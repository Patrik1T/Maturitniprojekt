  let questionCount = 0;
    let timerInterval;
    let totalTime = 0;
    let timeRemaining = 0;
    let totalPoints = 0;
    let correctAnswers = 0;

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
                <label><input type="radio" name="question${questionCount}_answer" value="Ano" required> Ano</label>
                <label><input type="radio" name="question${questionCount}_answer" value="Ne" required> Ne</label>
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
                        <label>
                            <input type="radio" name="question${index + 1}_answer" value="Ano">
                            Ano
                        </label>
                        <label>
                            <input type="radio" name="question${index + 1}_answer" value="Ne">
                            Ne
                        </label>
                    </div>
                </div>`;
        });

        testContent += `<button type="button" onclick="submitTest()">Odeslat test</button></form>`;
        document.getElementById('testContent').innerHTML = testContent;
        document.getElementById('previewTest').style.display = 'block';
    }

    // Funkce pro odeslání testu
    function submitTest() {
        const answers = getAnswers();
        const score = calculateScore(answers);
        const grade = getGrade(score);

        document.getElementById('scoreDisplay').innerText = `Počet bodů: ${score}`;
        document.getElementById('gradeDisplay').innerText = `Známka: ${grade}`;
        document.getElementById('resultsSection').style.display = 'block';
    }

    // Funkce pro získání odpovědí
    function getAnswers() {
        const answers = [];
        const questions = document.querySelectorAll('.question-wrapper');
        questions.forEach((question, index) => {
            const answer = document.querySelector(`input[name="question${index + 1}_answer"]:checked`);
            if (answer) {
                answers.push(answer.value);
            }
        });
        return answers;
    }

    // Funkce pro výpočet skóre
    function calculateScore(answers) {
        totalPoints = 0;
        correctAnswers = 0;

        answers.forEach(answer => {
            if (answer === 'Ano') {
                totalPoints += 1;
                correctAnswers += 1;
            }
        });

        return correctAnswers;
    }

    // Funkce pro získání hodnocení
    function getGrade(score) {
        if (score >= parseInt(document.getElementById('grade1').value)) {
            return '1';
        } else if (score >= parseInt(document.getElementById('grade2').value)) {
            return '2';
        } else if (score >= parseInt(document.getElementById('grade3').value)) {
            return '3';
        } else if (score >= parseInt(document.getElementById('grade4').value)) {
            return '4';
        } else {
            return '5';
        }
    }

    // Funkce pro uložení testu
    function saveTest(testType) {
        const testName = document.getElementById('testName').value;
        const questions = getQuestions();

        if (!testName || questions.length === 0) {
            alert('Přidejte otázky a název testu');
            return;
        }

        const test = {
            name: testName,
            questions: questions
        };

        const testList = JSON.parse(localStorage.getItem(testType)) || [];
        testList.push(test);
        localStorage.setItem(testType, JSON.stringify(testList));

        alert('Test byl úspěšně uložen');
    }

    // Funkce pro získání otázek
    function getQuestions() {
        const questions = [];
        const questionElements = document.querySelectorAll('.question-wrapper');
        questionElements.forEach((questionElement, index) => {
            const questionText = questionElement.querySelector(`input[name="question${index + 1}_text"]`).value;
            const points = parseInt(questionElement.querySelector(`input[name="question${index + 1}_points"]`).value);
            questions.push({
                text: questionText,
                points: points
            });
        });
        return questions;
    }


