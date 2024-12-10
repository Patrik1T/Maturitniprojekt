let cards = [];
let flippedCards = [];
let matchedCards = [];
let score = 0;
let pointsPerPair = 1;
let timeRemaining = 60;
let timerInterval;

function addPairInput() {
    const pairInfoContainer = document.getElementById('pairInfoContainer');
    const input1 = document.createElement('input');
    const input2 = document.createElement('input');

    input1.type = 'text';
    input1.placeholder = 'Zadejte otázku';
    input2.type = 'text';
    input2.placeholder = 'Zadejte odpověď';

    pairInfoContainer.appendChild(input1);
    pairInfoContainer.appendChild(input2);
}

function startGame() {
    const numPairs = parseInt(document.getElementById('numPairs').value);
    const pairInputs = document.querySelectorAll('#pairInfoContainer input');
    let pairs = [];

    // Vytváření párů (otázka a odpověď)
    for (let i = 0; i < pairInputs.length; i += 2) {
        if (pairInputs[i] && pairInputs[i + 1]) {
            pairs.push([pairInputs[i].value.trim(), pairInputs[i + 1].value.trim()]);
        }
    }

    // Vytváření karet
    cards = [];
    pairs.forEach((pair, index) => {
        cards.push({ text: pair[0], flipped: false, pairId: index }); // Přidání otázky
        cards.push({ text: pair[1], flipped: false, pairId: index }); // Přidání odpovědi
    });

    // Zamíchání karet
    cards.sort(() => Math.random() - 0.5);
    drawCards();
    startTimer();
}

function drawCards() {
    const grid = document.getElementById('grid');
    grid.innerHTML = ''; // Vyprázdní grid před každým vykreslením

    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card' + (card.flipped ? ' flipped' : '');
        cardElement.textContent = card.flipped ? card.text : ''; // Zobrazí text pouze, pokud je karta otočená
        cardElement.dataset.index = index;

        cardElement.addEventListener('click', () => flipCard(index));

        grid.appendChild(cardElement);
    });

    document.getElementById('score').innerText = `Skóre: ${score}`;
}

function flipCard(index) {
    // Zabráníme otočení karty, která je už otočená nebo když jsou už dvě karty otočené
    if (cards[index].flipped || flippedCards.length === 2) return;

    cards[index].flipped = true;
    flippedCards.push(index);
    drawCards();

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [firstIndex, secondIndex] = flippedCards;
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];

    if (firstCard.pairId === secondCard.pairId) { // Pokud páry odpovídají
        matchedCards.push(firstIndex, secondIndex);
        score += pointsPerPair;
    } else { // Pokud páry neodpovídají
        setTimeout(() => {
            firstCard.flipped = false;
            secondCard.flipped = false;
            drawCards();
        }, 1000); // Karty se otočí zpět po 1 sekundě
    }

    flippedCards = []; // Vyprázdníme pole otočených karet

    if (matchedCards.length === cards.length) {
        clearInterval(timerInterval);
        alert('Hra skončila! Vaše skóre: ' + score);
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert('Čas vypršel! Hra skončila.');
        }
    }, 1000);
}

function previewTest() {
    startGame();
}
