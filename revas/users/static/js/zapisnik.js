// Funkce pro uložení poznámky
function saveNote() {
    const noteInput = document.getElementById("note-input");
    const noteText = noteInput.value.trim();

    if (noteText === "") {
        alert("Poznámka nemůže být prázdná!");
        return;
    }

    savedNotes.push(noteText);
    noteInput.value = ""; // Vyprázdnění textarea
    renderNotes(); // Aktualizace zobrazení poznámek
}

// Funkce pro vykreslení poznámek
function renderNotes() {
    const savedNotesContainer = document.getElementById("saved-notes");
    savedNotesContainer.innerHTML = ""; // Vyprázdnění

    savedNotes.forEach((note, index) => {
        const noteElement = document.createElement("div");
        noteElement.className = "saved-note";

        const noteText = document.createElement("span");
        noteText.innerText = note;

        const editButton = document.createElement("button");
        editButton.innerText = "Upravit";
        editButton.onclick = () => editNotePrompt(index);

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Smazat";
        deleteButton.onclick = () => deleteNote(index);

        noteElement.appendChild(noteText);
        noteElement.appendChild(editButton);
        noteElement.appendChild(deleteButton);

        savedNotesContainer.appendChild(noteElement);
    });
}

// Funkce pro úpravu poznámky
function editNotePrompt(index) {
    const updatedNote = prompt("Upravte poznámku:", savedNotes[index]);
    if (updatedNote !== null && updatedNote.trim() !== "") {
        savedNotes[index] = updatedNote.trim();
        renderNotes();
    } else if (updatedNote === "") {
        alert("Poznámka nemůže být prázdná!");
    }
}

// Funkce pro smazání poznámky
function deleteNote(index) {
    if (confirm("Opravdu chcete tuto poznámku smazat?")) {
        savedNotes.splice(index, 1);
        renderNotes();
    }
}

// Zavolání při načtení stránky
window.addEventListener("DOMContentLoaded", renderNotes);

