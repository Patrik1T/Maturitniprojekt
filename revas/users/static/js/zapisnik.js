 function addNote() {
            const noteInput = document.getElementById('noteInput');
            const notesContainer = document.getElementById('notesContainer');

            if (noteInput.value.trim() === '') {
                alert('Nelze uložit prázdnou poznámku!');
                return;
            }

            const noteDiv = document.createElement('div');
            noteDiv.className = 'note';

            const noteText = document.createElement('div');
            noteText.className = 'note-text';
            noteText.textContent = noteInput.value;

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = function () {
                const newText = prompt('Upravit text:', noteText.textContent);
                if (newText !== null) {
                    noteText.textContent = newText;
                }
            };

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Smazat';
            deleteButton.onclick = function () {
                notesContainer.removeChild(noteDiv);
            };

            noteDiv.appendChild(noteText);
            noteDiv.appendChild(editButton);
            noteDiv.appendChild(deleteButton);

            notesContainer.appendChild(noteDiv);

            noteInput.value = '';
        }