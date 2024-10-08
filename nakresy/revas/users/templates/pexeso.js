let cards = [];
let cardImages = [];
let selectedCards = [];
let matchedCards = [];
let totalPairs = 8;
let flippedCount = 0;
let canFlip = true;

function preload() {

    for (let i = 0; i < totalPairs; i++) {
        cardImages[i] = loadImage(`images/card${i + 1}.png`);
    }
}

function setup() {
    createCanvas(400, 400);
    resetGame();
}

function draw() {
    background(200);
    drawCards();
}

function drawCards() {
    let cardWidth = width / 4;
    let cardHeight = height / 4;

    for (let i = 0; i < cards.length; i++) {
        let x = (i % 4) * cardWidth;
        let y = floor(i / 4) * cardHeight;

        if (cards[i].flipped || matchedCards.includes(i)) {
            image(cardImages[cards[i].imageIndex], x, y, cardWidth, cardHeight);
        } else {
            fill(100);
            rect(x, y, cardWidth, cardHeight);
        }
    }
}

function mousePressed() {
    if (canFlip) {
        let cardWidth = width / 4;
        let cardHeight = height / 4;

        let i = floor(mouseX / cardWidth) + floor(mouseY / cardHeight) * 4;

        if (!cards[i].flipped && !matchedCards.includes(i)) {
            cards[i].flipped = true;
            selectedCards.push(i);
            flippedCount++;

            if (flippedCount === 2) {
                canFlip = false;
                checkMatch();
            }
        }
    }
}

function checkMatch() {
    let firstCardIndex = selectedCards[0];
    let secondCardIndex = selectedCards[1];

    if (cards[firstCardIndex].imageIndex === cards[secondCardIndex].imageIndex) {
        matchedCards.push(firstCardIndex);
        matchedCards.push(secondCardIndex);
    } else {
        setTimeout(() => {
            cards[firstCardIndex].flipped = false;
            cards[secondCardIndex].flipped = false;
            canFlip = true;
        }, 1000);
    }
    selectedCards = [];
    flippedCount = 0;
}

function resetGame() {
    cards = [];
    matchedCards = [];
    selectedCards = [];
    flippedCount = 0;
    canFlip = true;

    for (let i = 0; i < totalPairs; i++) {
        cards.push({ imageIndex: i, flipped: false });
        cards.push({ imageIndex: i, flipped: false });
    }


    shuffle(cards, true);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = floor(random(i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}