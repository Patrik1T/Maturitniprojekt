let savedNotes = [];

// Funkce pro ukládání poznámky
function saveNote() {
    const noteInput = document.getElementById('note-input');
    const noteText = noteInput.value.trim();

    if (noteText === "") {
        alert("Poznámka nemůže být prázdná!");
        return;
    }

    // Uložení poznámky do pole
    savedNotes.push(noteText);
    noteInput.value = ''; // Vyprázdní textarea
    renderNotes(); // Překreslení poznámek
}

// Funkce pro vykreslení poznámek
function renderNotes() {
    const savedNotesContainer = document.getElementById('saved-notes');
    savedNotesContainer.innerHTML = '';

    savedNotes.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('saved-note');

        // Poznámka
        noteElement.innerHTML = `
            <span contenteditable="true" onblur="updateNote(${index}, this.innerText)">${note}</span>
            <div>
                <button onclick="deleteNote(${index})">Smazat</button>
            </div>
        `;

        savedNotesContainer.appendChild(noteElement);
    });
}

// Funkce pro editaci poznámky
function updateNote(index, newText) {
    if (newText !== "") {
        savedNotes[index] = newText;
    }
}

// Funkce pro smazání poznámky
function deleteNote(index) {
    if (confirm("Opravu chcete tuto poznámku smazat?")) {
        savedNotes.splice(index, 1); // Odstranění poznámky z pole
        renderNotes(); // Překreslení poznámek
    }
}

// Zavolání funkce pro inicializaci při načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    renderNotes();
});
