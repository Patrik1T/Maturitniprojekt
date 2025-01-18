    function toggleContent(card) {
        const content = card.querySelector('.card-content');
        const isVisible = content.style.display === 'block';

        // Zavřít všechny karty
        document.querySelectorAll('.card-content').forEach((el) => {
            el.style.display = 'none';
        });

        // Otevřít pouze aktuální kartu (pokud nebyla otevřená)
        if (!isVisible) {
            content.style.display = 'block';
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Ujistíme se, že všechny karty jsou při načtení skryté
    document.querySelectorAll('.card-content').forEach((el) => {
        el.style.display = 'none';
    });