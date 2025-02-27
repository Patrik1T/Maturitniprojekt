      const questionInput = document.getElementById("question");
        const answerInput = document.getElementById("answer");
        const gameBoardDiv = document.getElementById("gameBoard");
        const scoreDiv = document.getElementById("score");
        const endMessage = document.getElementById("endMessage");
        const finalScoreSpan = document.getElementById("finalScore");
        const pairsListDiv = document.getElementById("pairsList");

        let pairs = [];
        let flippedCards = [];
        let score = 0;
        let gameActive = false;

        // Funkce pro přidání páru otázek a odpovědí
        function addPair() {
            const question = questionInput.value.trim();
            const answer = answerInput.value.trim();

            if (question && answer) {
                pairs.push({ question, answer });
                updatePairsList();
                questionInput.value = "";
                answerInput.value = "";
            } else {
                alert("Zadejte prosím otázku a odpověď.");
            }
        }

        // Funkce pro aktualizaci seznamu přidaných párů
        function updatePairsList() {
            pairsListDiv.innerHTML = '';
            pairs.forEach((pair, index) => {
                const pairDiv = document.createElement("div");
                pairDiv.classList.add("pair-item");
                pairDiv.innerHTML = `${pair.question} - ${pair.answer}
                    <button onclick="removePair(${index})">Odstranit</button>`;
                pairsListDiv.appendChild(pairDiv);
            });
        }

        // Funkce pro odstranění specifického páru
        function removePair(index) {
            pairs.splice(index, 1);
            updatePairsList();
        }

        // Funkce pro zahájení hry
function startGame() {
    if (pairs.length < 1) {
        alert("Pro spuštění hry je potřeba alespoň 1 pár!");
        return;
    }

    gameActive = true;
    score = 0;
    flippedCards = [];
    gameBoardDiv.innerHTML = '';
    gameBoardDiv.classList.remove("hidden");
    endMessage.classList.add("hidden");
    scoreDiv.textContent = `Skóre: ${score}`;

    // Vytvoření karet pro pexeso (dvojice otázek a odpovědí)
    const cards = [];
    pairs.forEach((pair, index) => {
        cards.push({ content: pair.question, type: 'question', pairId: index });
        cards.push({ content: pair.answer, type: 'answer', pairId: index });
    });

    // Zamíchání karet
    shuffle(cards);

    // Vytvoření karet na herní desce
    cards.forEach((card, index) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.dataset.index = index;
        cardDiv.dataset.content = card.content;
        cardDiv.dataset.type = card.type;
        cardDiv.dataset.pairId = card.pairId;  // Přidání pairId
        cardDiv.addEventListener("click", flipCard);
        gameBoardDiv.appendChild(cardDiv);
    });
}

        // Funkce pro otočení karty
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

       // Funkce pro kontrolu, zda jsou dvě otočené karty správně spárované
function checkMatch() {
    const [firstCard, secondCard] = flippedCards;

    // Porovnáme pairId místo obsahu
    if (firstCard.dataset.pairId === secondCard.dataset.pairId) {
        // Správný pár
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        score += 10;
        scoreDiv.textContent = `Skóre: ${score}`;
        flippedCards = [];
        if (document.querySelectorAll(".matched").length === document.querySelectorAll(".card").length) {
            endGame();
        }
    } else {
        // Nesprávný pár, skrytí karet
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard.textContent = '';
            secondCard.textContent = '';
            flippedCards = [];
        }, 1000);
    }
}


        // Funkce pro zamíchání políčka
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        // Funkce pro dokončení hry
        function endGame() {
            gameActive = false;
            finalScoreSpan.textContent = score;
            endMessage.classList.remove("hidden");
        }

        // Funkce pro resetování hry
        function resetGame() {
            pairs = [];
            score = 0;
            gameActive = false;
            flippedCards = [];
            gameBoardDiv.classList.add("hidden");
            endMessage.classList.add("hidden");
            scoreDiv.textContent = `Skóre: ${score}`;
            updatePairsList();
        }