// Funkce pro uložení poznámky do localStorage
function saveNote() {
    const noteInput = document.getElementById('note-input');
    const noteText = noteInput.value.trim();

    if (noteText) {
        let savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
        savedNotes.push(noteText);
        localStorage.setItem('notes', JSON.stringify(savedNotes));
        noteInput.value = ''; // Vymazání textového pole po uložení
        displayNotes(); // Obnovení seznamu poznámek
    }
}

// Funkce pro zobrazení uložených poznámek
function displayNotes() {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    const savedNotesContainer = document.getElementById('saved-notes');

    savedNotesContainer.innerHTML = ''; // Vyprázdnění předchozích poznámek

    if (savedNotes.length > 0) {
        savedNotes.forEach((note, index) => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('saved-note');
            noteElement.textContent = note;
            savedNotesContainer.appendChild(noteElement);
        });
    } else {
        savedNotesContainer.innerHTML = '<p>Žádné poznámky k zobrazení.</p>';
    }
}

// Zavolání funkce pro zobrazení poznámek při načtení stránky
document.addEventListener('DOMContentLoaded', displayNotes);
