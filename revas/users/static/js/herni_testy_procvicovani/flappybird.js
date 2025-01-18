    let questions = []; // Pole otázek
    let score = 0;
    let gameInterval;
    let pipes = [];
    const pipeWidth = 50;
    const pipeGap = 200;
    const bird = { x: 100, y: 150, width: 30, height: 30, gravity: 0.5, lift: -10, velocity: 0, alive: true };
    let currentQuestion;
    let editIndex = null; // Ukládá index aktuálně upravované otázky

    function startGame() {
        if (gameInterval) return;
        score = 0;
        pipes = [];
        bird.alive = true;
        bird.y = 150;
        bird.velocity = 0;
        gameInterval = setInterval(gameLoop, 1000 / 60);
    }

    function flap() {
        if (bird.alive && bird.velocity >= 0) bird.velocity = bird.lift;
    }

    window.addEventListener('keydown', (event) => {
        if (event.code === 'Space') flap();
    });

    window.addEventListener('click', flap);

    function gameLoop() {
        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (bird.y + bird.height >= canvas.height) {
            bird.y = canvas.height - bird.height;
            bird.velocity = 0;
        }

        pipes.forEach(pipe => {
            pipe.x -= 2;
            if (
                bird.x + bird.width > pipe.x &&
                bird.x < pipe.x + pipeWidth &&
                (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap)
            ) {
                endGame();
            }
            if (bird.x + bird.width > pipe.x + pipeWidth && !pipe.passed) {
                pipe.passed = true;
                askQuestion(pipe);
            }
        });

        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 150) createPipe();

        drawBird(ctx);
        drawPipes(ctx);

        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText(`Skóre: ${score}`, 20, 30);
    }

    function createPipe() {
        const canvas = document.getElementById("gameCanvas");
        const height = Math.floor(Math.random() * (canvas.height - pipeGap - 60)) + 30;
        pipes.push({ x: canvas.width, y: height, passed: false });
    }

    function drawBird(ctx) {
        ctx.fillStyle = "#FFD700";
        ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    }

    function drawPipes(ctx) {
        ctx.fillStyle = "#228B22";
        pipes.forEach(pipe => {
            ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);
            ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, ctx.canvas.height - pipe.y - pipeGap);
        });
    }

    function askQuestion() {
        clearInterval(gameInterval);
        currentQuestion = questions[Math.floor(Math.random() * questions.length)];
        if (!currentQuestion) return;

        const questionPopup = document.getElementById("questionPopup");
        const questionText = document.getElementById("questionText");
        const answerOptions = document.getElementById("answerOptions");

        questionText.textContent = currentQuestion.question;
        answerOptions.innerHTML = "";
        currentQuestion.answers.forEach(answer => {
            const button = document.createElement("button");
            button.textContent = answer.text;
            button.onclick = () => {
                if (answer.correct) score += 10;
                closeQuestion();
            };
            answerOptions.appendChild(button);
        });
        questionPopup.style.display = "block";
    }

    function addAnswer() {
        const container = document.getElementById("answersContainer");
        const answerDiv = document.createElement("div");
        answerDiv.classList.add("answer");
        answerDiv.innerHTML = `
            <input type="text" placeholder="Odpověď">
            <input type="checkbox"> Správná odpověď
            <button onclick="removeAnswer(this)">Odebrat</button>`;
        container.appendChild(answerDiv);
    }

    function removeAnswer(button) {
        button.parentElement.remove();
    }

function addQuestion() {
    const questionInput = document.getElementById("newQuestion");
    const answersContainer = document.getElementById("answersContainer");
    const questionText = questionInput.value.trim();

    if (!questionText) {

        return;
    }

    const answers = [];
    answersContainer.querySelectorAll(".answer").forEach(answerDiv => {
        const answerText = answerDiv.querySelector("input[type='text']").value.trim();
        const isCorrect = answerDiv.querySelector("input[type='checkbox']").checked;

        if (answerText) {
            answers.push({ text: answerText, correct: isCorrect });
        }
    });

    if (answers.length === 0) {

        return;
    }

    if (editIndex !== null) {
        // Pokud upravujeme, aktualizujeme otázku
        questions[editIndex] = { question: questionText, answers };
        editIndex = null;

    } else {
        // Jinak přidáváme novou otázku
        questions.push({ question: questionText, answers });

    }

    questionInput.value = "";
    answersContainer.innerHTML = `
        <div class="answer">
            <input type="text" placeholder="Odpověď">
            <input type="checkbox"> Správná odpověď
            <button onclick="removeAnswer(this)">Odebrat</button>
        </div>`;
    updateQuestionList();
}

function updateQuestionList() {
    const questionList = document.getElementById("savedQuestionsList");
    questionList.innerHTML = "";

    questions.forEach((q, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${q.question}</strong>
            <ul>
                ${q.answers.map(a => `<li>${a.text} ${a.correct ? "(Správná)" : ""}</li>`).join("")}
            </ul>
            <button onclick="editQuestion(${index})">Upravit</button>
            <button onclick="deleteQuestion(${index})">Smazat</button>
        `;
        questionList.appendChild(li);
    });
}

function deleteQuestion(index) {
    questions.splice(index, 1); // Odstraní otázku ze seznamu
    updateQuestionList(); // Aktualizuje zobrazený seznam
}

function editQuestion(index) {
    editIndex = index; // Uloží index aktuálně upravované otázky
    const question = questions[index];

    // Předvyplnění otázky a odpovědí do formuláře
    const questionInput = document.getElementById("newQuestion");
    const answersContainer = document.getElementById("answersContainer");

    questionInput.value = question.question;
    answersContainer.innerHTML = "";

    question.answers.forEach(answer => {
        const answerDiv = document.createElement("div");
        answerDiv.classList.add("answer");
        answerDiv.innerHTML = `
            <input type="text" value="${answer.text}">
            <input type="checkbox" ${answer.correct ? "checked" : ""}> Správná odpověď
            <button onclick="removeAnswer(this)">Odebrat</button>`;
        answersContainer.appendChild(answerDiv);
    });


}


    function closeQuestion() {
        document.getElementById("questionPopup").style.display = "none";
        gameInterval = setInterval(gameLoop, 1000 / 60);
    }

    function endGame() {
        bird.alive = false;
        clearInterval(gameInterval);

        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FFF";
        ctx.font = "36px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Hra skončila!", canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillText(`Skóre: ${score}`, canvas.width / 2, canvas.height / 2 + 20);

        const restartButton = document.createElement("button");
        restartButton.textContent = "Restartovat hru";
        restartButton.classList.add("button");
        restartButton.onclick = restartGame;
        document.body.appendChild(restartButton);
    }

    function restartGame() {
        bird.alive = true;
        bird.y = 150;
        bird.velocity = 0;
        score = 0;
        pipes = [];
        document.querySelector(".button").remove();
        gameInterval = setInterval(gameLoop, 1000 / 60);
    }

    function exportToHTML() {
    const testName = document.getElementById("testName").value.trim();
    if (!testName) {
        alert("Please enter a test name.");
        return;
    }

    let htmlContent = `
        <html>
        <head>
            <title>${testName}</title>
        </head>
        <body>
            <h1>${testName}</h1>
            <ul>
    `;

    questions.forEach(q => {
        htmlContent += `<li><strong>${q.question}</strong><ul>`;
        q.answers.forEach(a => {
            htmlContent += `<li>${a.text} ${a.correct ? "(Correct)" : ""}</li>`;
        });
        htmlContent += `</ul></li>`;
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
function exportToJSON() {
    const testName = document.getElementById("testName").value.trim();
    if (!testName) {
        alert("Please enter a test name.");
        return;
    }

    const testData = {
        title: testName,
        questions: questions.map(q => ({
            question: q.question,
            answers: q.answers.map(a => ({
                text: a.text,
                correct: a.correct
            }))
        }))
    };

    const jsonContent = JSON.stringify(testData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${testName}.json`;
    link.click();
}
function exportToXML() {
    const testName = document.getElementById("testName").value.trim();
    if (!testName) {
        alert("Please enter a test name.");
        return;
    }

    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
    <quiz>
        <title>${testName}</title>
        <questions>
    `;

    questions.forEach(q => {
        xmlContent += `<question>
            <text>${q.question}</text>
            <answers>
        `;
        q.answers.forEach(a => {
            xmlContent += `<answer correct="${a.correct}">
                ${a.text}
            </answer>`;
        });
        xmlContent += `</answers>
        </question>`;
    });

    xmlContent += `
        </questions>
    </quiz>
    `;

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${testName}.xml`;
    link.click();
}
