let words = [];
        let currentWord;
        let currentQuestion;
        let guessedLetters = [];
        let wrongGuesses = 0;
        const maxWrongGuesses = 8;

        function addWord() {
            const question = document.getElementById("questionInput").value;
            const word = document.getElementById("wordInput").value;

            if (question && word) {
                words.push({ question, word });
                displayQuestions();
                document.getElementById("questionInput").value = '';
                document.getElementById("wordInput").value = '';
            } else {
                alert("Vyplňte obě pole.");
            }
        }

        function displayQuestions() {
            const questionsList = document.getElementById("questionsList");
            questionsList.innerHTML = '';
            words.forEach((item, index) => {
                const questionItem = document.createElement("div");
                questionItem.classList.add("questionItem");
                questionItem.innerHTML = `${item.question} - ${item.word}
                    <button class="removeBtn" onclick="removeWord(${index})">Smazat</button>`;
                questionsList.appendChild(questionItem);
            });
        }

        function removeWord(index) {
            words.splice(index, 1);
            displayQuestions();
        }

        function startGame() {
            if (words.length === 0) {
                alert("Nejprve přidejte otázky a slova.");
                return;
            }

            // Vyber náhodnou otázku
            const randomIndex = Math.floor(Math.random() * words.length);
            currentWord = words[randomIndex].word.toLowerCase();
            currentQuestion = words[randomIndex].question;

            // Vyčistit předchozí data
            guessedLetters = [];
            wrongGuesses = 0;
            document.getElementById("letters").innerHTML = '';
            document.getElementById("wordDisplay").innerHTML = '';
            document.getElementById("hangmanImage").innerHTML = '';

            displayWord();
            displayLetters();
            updateAttemptsDisplay();

            // Skryt tlačítko pro začátek hry a ukázat tlačítko pro restart
            document.getElementById("startGameBtn").style.display = 'none';
            document.getElementById("restartGameBtn").style.display = 'inline-block';

            // Zobraz otázku nad slovem
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `<strong>Otázka:</strong> ${currentQuestion}`;
            document.getElementById("wordDisplay").insertBefore(questionDiv, document.getElementById("wordDisplay").firstChild);
        }

        function restartGame() {
            // Vyčistit všechny předchozí data a připravit hru k novému startu
            guessedLetters = [];
            wrongGuesses = 0;
            document.getElementById("letters").innerHTML = '';
            document.getElementById("wordDisplay").innerHTML = '';
            document.getElementById("hangmanImage").innerHTML = '';

            // Skryt tlačítko pro restart a ukázat tlačítko pro začátek nové hry
            document.getElementById("restartGameBtn").style.display = 'none';
            document.getElementById("startGameBtn").style.display = 'inline-block';
        }

        function displayWord() {
            const wordDisplay = document.getElementById("wordDisplay");
            wordDisplay.innerHTML = '';
            for (let i = 0; i < currentWord.length; i++) {
                const letterBox = document.createElement("div");
                letterBox.classList.add("letter");
                letterBox.id = `letter-${i}`;
                letterBox.innerHTML = guessedLetters.includes(currentWord[i]) ? currentWord[i].toUpperCase() : '_';
                wordDisplay.appendChild(letterBox);
            }
        }

        function displayLetters() {
    const lettersDiv = document.getElementById("letters");
    lettersDiv.innerHTML = '';

    // Česká abeceda včetně diakritických znaků
    const alphabet = 'aábcčdeéfghiíjklmnoópqrřstúüvyzž'.split('');

    alphabet.forEach(letter => {
        const letterButton = document.createElement("button");
        letterButton.classList.add("letter-button");
        letterButton.innerHTML = letter.toUpperCase(); // Zobrazení písmen s diakritikou
        letterButton.onclick = () => guessLetter(letter);
        lettersDiv.appendChild(letterButton);
    });
}


        function guessLetter(letter) {
            if (guessedLetters.includes(letter)) {
                return;
            }
            guessedLetters.push(letter);

            if (currentWord.includes(letter)) {
                updateLetterButtons(letter, true);
                displayWord();
                checkWin();
            } else {
                updateLetterButtons(letter, false);
                wrongGuesses++;
                updateHangmanImage();
                updateAttemptsDisplay();
                checkGameOver();
            }
        }

        function updateLetterButtons(letter, isCorrect) {
            const letterButtons = document.getElementsByClassName("letter-button");
            for (const button of letterButtons) {
                if (button.innerHTML.toLowerCase() === letter) {
                    button.style.backgroundColor = isCorrect ? 'green' : 'red';
                    button.disabled = true;  // Disable the button once clicked
                }
            }
        }

        function updateHangmanImage() {
            const hangmanImage = document.getElementById("hangmanImage");

            // První část: čáry šibenice a postava
            const parts = [
                'line1', 'line2', 'line3', 'head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'
            ];
            hangmanImage.innerHTML = '';

            // Postupně přidávat části těla
            hangmanImage.innerHTML += parts.slice(0, wrongGuesses).map(part =>
                `<div style="height:20px; width:200px; background-color:black;"></div>`
            ).join('');
        }

        function updateAttemptsDisplay() {
            const attemptsDisplay = document.getElementById("attemptsDisplay");
            attemptsDisplay.innerHTML = `Pokusy: ${wrongGuesses}/${maxWrongGuesses}`;
        }

        function checkWin() {
            const wordDisplay = document.getElementById("wordDisplay");
            const revealed = [...wordDisplay.getElementsByClassName("letter")].every(letterBox => letterBox.innerHTML !== '_');
            if (revealed) {
                alert("Vyhráli jste! Slovo bylo: " + currentWord.toUpperCase());
            }
        }

        function checkGameOver() {
            if (wrongGuesses >= maxWrongGuesses) {
                alert("Prohráli jste! Slovo bylo: " + currentWord.toUpperCase());
            }
        }