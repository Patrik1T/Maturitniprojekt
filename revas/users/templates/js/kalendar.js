// Pole názvů měsíců
const months = [
    "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
    "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
];

let currentDate = new Date();

// Funkce pro změnu měsíce
function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderCalendar();
}

// Funkce pro zobrazení kalendáře
function renderCalendar() {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const calendarDays = document.getElementById('calendar-days');
    const calendarTitle = document.getElementById('calendar-title');

    // Nastavení názvu měsíce
    calendarTitle.innerText = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    // Vyprázdnění dřívějších dní
    calendarDays.innerHTML = '';

    // Vytváření prázdných buněk před začátkem měsíce
    let dayCell = '';
    for (let i = 0; i < firstDay; i++) {
        dayCell += '<td></td>';
    }

    // Vytváření dní v měsíci
    for (let day = 1; day <= daysInMonth; day++) {
        if ((firstDay + day - 1) % 7 === 0 && day !== 1) {
            calendarDays.innerHTML += `<tr>${dayCell}</tr>`;
            dayCell = '';
        }
        dayCell += `<td>${day}</td>`;
    }

    if (dayCell !== '') {
        calendarDays.innerHTML += `<tr>${dayCell}</tr>`;
    }
}

// Funkce pro zobrazení aktuálního času
function displayTime() {
    const time = new Date().toLocaleTimeString();
    document.getElementById('current-time').innerText = `Aktuální čas: ${time}`;
}

// Zavolání funkce pro vykreslení kalendáře při načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    renderCalendar();
    setInterval(displayTime, 1000); // Aktualizace času každou sekundu
});
