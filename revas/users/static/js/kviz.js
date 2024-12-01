let questionCount = 0;
    let timerInterval;
    let totalTime = 0;
    let timeRemaining = 0;
    let totalPoints = 0;
    let correctAnswers = 0;
    let questions = [];

    function addQuestionField() {
        questionCount++;
        const questionTemplate = `
        <div class="question-wrapper" id="question${questionCount}">
            <div class="question">
                <label for="question${questionCount}_text">Otázka ${questionCount}:</label>
                <input type="text" name="question${questionCount}_text" placeholder="Zadejte otázku" required>
            </div>
            <div class="answer-wrapper">
                <div class="answer-square-container">
                    <span>Počet čtverečků:</span>
                    <input type="number" min="1" value="5" onchange="updateSquares(this)">
                </div>
                <div class="squares"></div>
            </div>
            <div class="secret-answer">
                <span>Tajenka:</span>
                <input type="text" placeholder="Zadejte tajenku" required>
            </div>
            <button type="button" class="delete-question-btn" onclick="deleteQuestion(${questionCount})">Smazat otázku</button>
        </div>`;
        document.getElementById('questionsContainer').insertAdjacentHTML('beforeend', questionTemplate);
        updateSquares({ value: 5 });
    }

    function updateSquares(input) {
        const answerWrapper = input.closest('.question-wrapper').querySelector('.answer-wrapper');
        const squareCount = parseInt(input.value);
        const squaresContainer = answerWrapper.querySelector('.squares');

        squaresContainer.innerHTML = '';
        for (let i = 0; i < squareCount; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.onclick = () => toggleSquare(square);
            squaresContainer.appendChild(square);
        }
    }

    function toggleSquare(square) {
        square.classList.toggle('active');
    }

    function deleteQuestion(questionId) {
        const questionElement = document.getElementById(`question${questionId}`);
        questionElement.remove();
    }

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
                        ${question.options.map((option, i) => `
                            <label>
                                <input type="radio" name="question${index + 1}_answer" value="${i + 1}">
                                ${option}
                            </label>`).join('')}
                    </div>
                </div>`;
        });

        testContent += `<button type="button" onclick="submitTest()">Hotovo</button></form>`;
        document.getElementById('testContent').innerHTML = testContent;
        document.getElementById('previewTest').style.display = 'block';

        if (document.getElementById('enableTimer').checked) {
            startTimer();
        }
    }

    function getQuestions() {
        const questions = [];
        const questionWrappers = document.querySelectorAll('.question-wrapper');
        questionWrappers.forEach(wrapper => {
            const questionText = wrapper.querySelector('input[type="text"]:first-of-type').value.trim();
            const secretAnswer = wrapper.querySelector('input[type="text"]:last-of-type').value.trim();
            if (questionText && secretAnswer) {
                const options = Array.from(wrapper.querySelectorAll('.square'))
                    .map(square => square.classList.contains('active') ? 'Correct' : 'Incorrect');
                questions.push({ text: questionText, options });
            }
        });
        return questions;
    }

    function saveAsHtml() {
        const testHtml = document.getElementById('quizForm').outerHTML;
        const blob = new Blob([testHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${document.getElementById('testName').value || 'test'}.html`;
        a.click();
    }

    function startTimer() {
        totalTime = parseInt(document.getElementById('timer').value) * 60;
        timeRemaining = totalTime;
        document.getElementById('timerCount').innerText = formatTime(timeRemaining);
        document.getElementById('timerDisplay').style.display = 'block';
        timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        timeRemaining--;
        document.getElementById('timerCount').innerText = formatTime(timeRemaining);
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert('Čas vypršel!');
        }
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function submitTest() {
        // Calculate score and grade
        const answers = getAnswersFromPreview();
        let score = 0;
        answers.forEach(answer => {
            if (answer.correct) score++;
        });

        document.getElementById('scoreDisplay').innerText = `Skóre: ${score}`;
        document.getElementById('gradeDisplay').innerText = `Hodnocení: ${getGrade(score)}`;
        document.getElementById('resultsSection').style.display = 'block';
    }

    function getAnswersFromPreview() {
        const form = document.getElementById('previewForm');
        return Array.from(form.querySelectorAll('input[type="radio"]:checked'))
            .map(input => ({ correct: input.value === 'Correct' }));
    }

    function getGrade(score) {
        if (score === questionCount) return 'A';
        if (score > questionCount * 0.75) return 'B';
        if (score > questionCount * 0.5) return 'C';
        return 'D';
    }

    function endTest() {
        document.getElementById('previewTest').style.display = 'none';
    }
