// Funkce pro zobrazení/skrytí formuláře pro veřejný test
function togglePublicTestSettings() {
    const isPublic = document.getElementById('isPublic').checked;
    document.getElementById('publicTestSettings').style.display = isPublic ? 'block' : 'none';
}

// Funkce pro uložení testu s obrázkem a popiskem
function saveTest(type) {
    const isPublic = document.getElementById('isPublic').checked;
    if (isPublic) {
        const testImage = document.getElementById('testImage').files[0];
        const testDescription = document.getElementById('testDescription').value;
        const testButtonText = document.getElementById('testButtonText').value;

        // Uložení obrázku, popisku a dalších parametrů testu
        const formData = new FormData();
        formData.append('testImage', testImage);
        formData.append('testDescription', testDescription);
        formData.append('testButtonText', testButtonText);

        // Předpokládáme, že máme funkci pro odeslání těchto dat na server
        uploadPublicTestData(formData);
    }
    alert(`Test byl uložen jako ${type}`);
}
