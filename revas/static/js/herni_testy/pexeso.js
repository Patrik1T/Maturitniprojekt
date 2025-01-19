   const questionInput = document.getElementById("question");
const answerInput = document.getElementById("answer");
const pointsInput = document.getElementById("points");
const enableTimerCheckbox = document.getElementById("enableTimer");
const timeLimitInput = document.getElementById("timeLimit");
const grade1Input = document.getElementById("grade1");
const grade2Input = document.getElementById("grade2");
const grade3Input = document.getElementById("grade3");
const grade4Input = document.getElementById("grade4");
const grade5Input = document.getElementById("grade5");
const testNameInput = document.getElementById("testName");

const gameBoardDiv = document.getElementById("gameBoard");
const scoreDiv = document.getElementById("score");
const endMessage = document.getElementById("endMessage");
const finalScoreSpan = document.getElementById("finalScore");
const gradeSpan = document.getElementById("grade");
const pairsListDiv = document.getElementById("pairsList");

let pairs = [];
let flippedCards = [];
let score = 0;
let gameActive = false;
let timer;
let totalPoints = 0;

// Funkce pro zobrazení modálního okna s chybovou zprávou
function showModal(message) {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.textContent = message;
    modal.classList.remove('hidden');  // Zobrazí modální okno
}

// Funkce pro zavření modálního okna
function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('hidden');  // Skryje modální okno
}


// Funkce pro validaci formuláře
function validateForm() {
    const testName = testNameInput.value.trim();
    const grade1 = parseInt(grade1Input.value, 10);
    const grade2 = parseInt(grade2Input.value, 10);
    const grade3 = parseInt(grade3Input.value, 10);
    const grade4 = parseInt(grade4Input.value, 10);
    const grade5 = parseInt(grade5Input.value, 10);
    const enableTimer = enableTimerCheckbox.checked;
    const timeLimit = parseInt(timeLimitInput.value, 10);

    // 1. Kontrola názvu testu
    if (testName === "") {
        showModal("Musíte zadat název testu.");
        return false;
    }

    // 2. Kontrola počtu párů (alespoň 2)
    if (pairs.length < 2) {
        showModal("Pro spuštění hry musíte zadat alespoň dva páry.");
        return false;
    }

    // 3. Kontrola bodování (bodování musí být seřazeno sestupně)
    if (isNaN(grade1) || isNaN(grade2) || isNaN(grade3) || isNaN(grade4) || isNaN(grade5)) {
        showModal("Zadejte prosím platné hodnoty pro bodování.");
        return false;
    }

    if (grade1 <= grade2 || grade2 <= grade3 || grade3 <= grade4 || grade4 <= grade5) {
        showModal("Bodování musí být seřazeno sestupně, tedy každý bod musí být menší než předchozí.");
        return false;
    }

    // 4. Kontrola časovače (pokud je zaškrtnuto, musí být zadaný časový limit)
    if (enableTimer && (isNaN(timeLimit) || timeLimit <= 0)) {
        showModal("Pokud je zaškrtnutý časovač, musíte zadat platný časový limit.");
        return false;
    }

    return true; // Vše je v pořádku
}

function addPair() {
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();
    const points = parseInt(pointsInput.value, 10);

    if (question && answer && points > 0) {
        pairs.push({ question, answer, points });
        totalPoints += points;
        updatePairsList();
        questionInput.value = "";
        answerInput.value = "";
        pointsInput.value = "";
    } else {
        showModal("Zadejte prosím otázku, odpověď a počet bodů.");
    }
}

function updatePairsList() {
    pairsListDiv.innerHTML = '';
    pairs.forEach((pair, index) => {
        const pairDiv = document.createElement("div");
        pairDiv.classList.add("pair-item");
        pairDiv.innerHTML = `${pair.question} - ${pair.answer} (Body: ${pair.points})
            <button onclick="removePair(${index})">Odstranit</button>`;
        pairsListDiv.appendChild(pairDiv);
    });
}

function removePair(index) {
    totalPoints -= pairs[index].points;
    pairs.splice(index, 1);
    updatePairsList();
}

function startGame() {
    if (pairs.length < 2) {
        showModal("Pro spuštění hry musíte zadat alespoň dva páry.");
        return;
    }

    gameActive = true;
    score = 0;
    flippedCards = [];
    gameBoardDiv.innerHTML = '';
    gameBoardDiv.classList.remove("hidden");
    endMessage.classList.add("hidden");
    scoreDiv.textContent = `Skóre: ${score}`;

    if (enableTimerCheckbox.checked) {
        const timeLimit = parseInt(timeLimitInput.value, 10);
        if (isNaN(timeLimit) || timeLimit <= 0) {
            showModal("Zadejte platný časový limit v sekundách.");
            return;
        }
        startTimer(timeLimit);
    }

    const cards = [];
    pairs.forEach((pair, index) => {
        cards.push({ content: pair.question, type: 'question', pairId: index });
        cards.push({ content: pair.answer, type: 'answer', pairId: index });
    });

    shuffle(cards);

    cards.forEach((card, index) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.dataset.index = index;
        cardDiv.dataset.content = card.content;
        cardDiv.dataset.type = card.type;
        cardDiv.dataset.pairId = card.pairId;
        cardDiv.addEventListener("click", flipCard);
        gameBoardDiv.appendChild(cardDiv);
    });
}

function startTimer(seconds) {
    let timeRemaining = seconds;
    const timerDiv = document.createElement("div");
    timerDiv.id = "timerDiv";
    timerDiv.textContent = `Zbývající čas: ${timeRemaining}s`;
    timerDiv.style.fontSize = "20px";
    document.body.insertBefore(timerDiv, gameBoardDiv);

    timer = setInterval(() => {
        timeRemaining--;
        timerDiv.textContent = `Zbývající čas: ${timeRemaining}s`;

        if (timeRemaining <= 0) {
            clearInterval(timer);
            timerDiv.remove();
            endGame();
        }
    }, 1000);
}

function flipCard(event) {
    if (!gameActive || flippedCards.length === 2) {
        return;
    }

    const card = event.target;
    if (card.classList.contains("flipped") || card.classList.contains("matched")) {
        return;
    }

    card.classList.add("flipped");
    card.textContent = card.dataset.content;

    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.dataset.pairId === secondCard.dataset.pairId) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        const pairId = parseInt(firstCard.dataset.pairId, 10);
        score += pairs[pairId].points;
        scoreDiv.textContent = `Skóre: ${score}`;
        flippedCards = [];

        if (document.querySelectorAll(".matched").length === document.querySelectorAll(".card").length) {
            endGame();
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard.textContent = '';
            secondCard.textContent = '';
            flippedCards = [];
        }, 1000);
    }
}

function calculateGrade(score, totalPoints) {
    const grade1 = parseInt(grade1Input.value, 10) || 90;
    const grade2 = parseInt(grade2Input.value, 10) || 75;
    const grade3 = parseInt(grade3Input.value, 10) || 50;
    const grade4 = parseInt(grade3Input.value, 10) / 2 || 25;

    const percentage = (score / totalPoints) * 100;

    if (percentage >= grade1) return "1 (Výborný)";
    if (percentage >= grade2) return "2 (Chvalitebný)";
    if (percentage >= grade3) return "3 (Dobrý)";
    if (percentage >= grade4) return "4 (Dostatečný)";
    return "5 (Nedostatečný)";
}

function endGame() {
    gameActive = false;
    if (timer) {
        clearInterval(timer);
        const timerDiv = document.getElementById("timerDiv");
        if (timerDiv) timerDiv.remove();
    }
    finalScoreSpan.textContent = score;
    const grade = calculateGrade(score, totalPoints);
    gradeSpan.textContent = grade;
    endMessage.classList.remove("hidden");
}

function resetGame() {
    pairs = [];
    score = 0;
    totalPoints = 0;
    gameActive = false;
    flippedCards = [];
    gameBoardDiv.classList.add("hidden");
    endMessage.classList.add("hidden");
    scoreDiv.textContent = `Skóre: ${score}`;
    updatePairsList();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}



// Získání názvu testu nebo výchozí hodnoty
function getTestName() {
    const testName = document.getElementById("testName").value.trim();
    return testName ? testName : "test";
}

// Uložit jako HTML
function exportToHTML() {
    if (pairs.length === 0) {
        alert("Nemáte žádné vytvořené otázky pro export!");
        return;
    }

    const testName = getTestName();
    let htmlContent = `
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <title>${testName}</title>
</head>
<body>
    <h1>${testName}</h1>
    <p>${document.getElementById("testDescription").value || "Popis testu"}</p>
    <ul>
`;

    pairs.forEach(pair => {
        htmlContent += `<li>${pair.question} - ${pair.answer} (Body: ${pair.points})</li>\n`;
    });

    htmlContent += `
    </ul>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${testName}.html`;
    link.click();
}

// Uložit jako JSON
function exportToJSON() {
    if (pairs.length === 0) {
        alert("Nemáte žádné vytvořené otázky pro export!");
        return;
    }

    const testName = getTestName();
    const jsonData = {
        name: testName,
        description: document.getElementById("testDescription").value || "Popis testu",
        pairs: pairs
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${testName}.json`;
    link.click();
}

// Uložit jako Moodle XML
function exportToMoodleXML() {
    if (pairs.length === 0) {

        return;
    }

    const testName = getTestName();
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<quiz>\n`;

    pairs.forEach((pair, index) => {
        xmlContent += `
    <question type="shortanswer">
        <name>
            <text>Otázka ${index + 1}</text>
        </name>
        <questiontext format="html">
            <text><![CDATA[<p>${pair.question}</p>]]></text>
        </questiontext>
        <answer fraction="100">
            <text>${pair.answer}</text>
        </answer>
        <defaultgrade>${pair.points}</defaultgrade>
    </question>`;
    });

    xmlContent += `\n</quiz>`;

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${testName}.xml`;
    link.click();
}