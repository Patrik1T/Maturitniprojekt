    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timeLeft;
    let timerId;
    let playerPosition = { x: 185, y: 300 };

    const player = document.getElementById('player');
    const questionDisplay = document.getElementById('question');
    const gameArea = document.getElementById('gameArea');
    const timerDisplay = document.getElementById('timer');

    function addAnswer() {
        const answersContainer = document.getElementById('answersContainer');
        const answerCount = answersContainer.children.length;

        if (answerCount >= 5) {
            alert('Můžete přidat maximálně 5 odpovědí.');
            return;
        }

        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer';
        answerDiv.innerHTML = `
            <input type="text" placeholder="Odpověď" class="newAnswer">
            <input type="radio" name="correctAnswer" /> Správná odpověď
            <button class="delete-answer" onclick="deleteAnswer(this)">Smazat</button>
        `;
        answersContainer.appendChild(answerDiv);
    }

    function deleteAnswer(button) {
        button.parentElement.remove();
    }

    function addQuestion() {
        const questionText = document.getElementById('newQuestion').value.trim();
        const answers = [];
        let correctAnswer = '';

        const answerElements = document.querySelectorAll('.answer');
        answerElements.forEach(element => {
            const answerText = element.querySelector('.newAnswer').value.trim();
            const isCorrect = element.querySelector('input[type="radio"]').checked;
            if (answerText) {
                answers.push(answerText);
                if (isCorrect) correctAnswer = answerText;
            }
        });

        if (!questionText || answers.length < 2 || !correctAnswer) {
            alert('Zadejte otázku a alespoň dvě odpovědi, přičemž jedna musí být správná.');
            return;
        }

        questions.push({ question: questionText, answers, correctAnswer });
        updateQuestionList();

        document.getElementById('newQuestion').value = '';
        document.getElementById('answersContainer').innerHTML = '';
    }

    function updateQuestionList() {
        const questionList = document.getElementById('questionList');
        questionList.innerHTML = '';

        questions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.innerHTML = `
                <strong>${q.question}</strong>
                <ul>${q.answers.map(answer => `<li>${answer}${answer === q.correctAnswer ? ' (správná)' : ''}</li>`).join('')}</ul>
                <button class="delete-btn" onclick="deleteQuestion(${index})">Smazat otázku</button>
            `;
            questionList.appendChild(questionDiv);
        });
    }

    function deleteQuestion(index) {
        questions.splice(index, 1);
        updateQuestionList();
    }

    function startGame() {
        if (questions.length === 0) {
            alert('Přidejte alespoň jednu otázku.');
            return;
        }

        currentQuestionIndex = 0;
        score = 0;
        timeLeft = parseInt(document.getElementById('timerInput').value, 10);

        resetPlayerPosition();
        displayQuestion();
        startTimer();

        document.addEventListener('keydown', handleMovement);
    }

    function startTimer() {
        timerDisplay.textContent = `Čas: ${timeLeft}s`;
        timerId = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Čas: ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timerId);
                endGame();
            }
        }, 1000);
    }

    function displayQuestion() {
        const { question, answers } = questions[currentQuestionIndex];
        questionDisplay.textContent = question;

        gameArea.querySelectorAll('.door').forEach(door => door.remove());
        const doorWidth = 100;
        const gap = (gameArea.offsetWidth - answers.length * doorWidth) / (answers.length + 1);

        answers.forEach((answer, index) => {
            const door = document.createElement('div');
            door.className = 'door';
            door.textContent = answer;
            door.style.left = `${gap + index * (doorWidth + gap)}px`;
            door.style.top = '50px';
            door.dataset.answer = answer;
            gameArea.appendChild(door);
        });
    }

    function handleMovement(event) {
        const speed = 20;
        const bounds = gameArea.getBoundingClientRect();
        const playerBounds = player.getBoundingClientRect();

        if (event.key === 'ArrowUp' && playerBounds.top > bounds.top) playerPosition.y -= speed;
        if (event.key === 'ArrowDown' && playerBounds.bottom < bounds.bottom) playerPosition.y += speed;
        if (event.key === 'ArrowLeft' && playerBounds.left > bounds.left) playerPosition.x -= speed;
        if (event.key === 'ArrowRight' && playerBounds.right < bounds.right) playerPosition.x += speed;

        player.style.left = `${playerPosition.x}px`;
        player.style.top = `${playerPosition.y}px`;

        checkDoorCollision();
    }

    function checkDoorCollision() {
        const doors = gameArea.querySelectorAll('.door');
        doors.forEach(door => {
            const doorRect = door.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();

            if (
                playerRect.left < doorRect.right &&
                playerRect.right > doorRect.left &&
                playerRect.top < doorRect.bottom &&
                playerRect.bottom > doorRect.top
            ) {
                evaluateAnswer(door.dataset.answer);
            }
        });
    }

    function evaluateAnswer(selectedAnswer) {
        const { correctAnswer } = questions[currentQuestionIndex];
        if (selectedAnswer === correctAnswer) {
            score += 10;
            alert('Správně!');
        } else {
            alert('Špatně!');
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            resetPlayerPosition();
            displayQuestion();
        } else {
            endGame();
        }
    }

    function resetPlayerPosition() {
        playerPosition.x = 185;
        playerPosition.y = 300;
        player.style.left = `${playerPosition.x}px`;
        player.style.top = `${playerPosition.y}px`;
    }

    function endGame() {
        clearInterval(timerId);
        alert(`Hra skončila! Získali jste ${score} bodů.`);
        document.removeEventListener('keydown', handleMovement);
        questionDisplay.textContent = '';
    }