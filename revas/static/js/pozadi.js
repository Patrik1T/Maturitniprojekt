
        // Zpoždění zobrazení tabulky s tlačítky
        document.addEventListener("DOMContentLoaded", () => {
            setTimeout(() => {
                document.querySelector(".button-table").style.display = "flex";
            }, 5000); // Tabulka se zobrazí po 5 sekundách

            // Animace pozadí - kuličky
            createBackgroundAnimation();
        });

        // Funkce pro generování pohybujících se kuliček
        function createBackgroundAnimation() {
            const container = document.body;
            for (let i = 0; i < 50; i++) {
                const ball = document.createElement('div');
                ball.className = 'ball';
                ball.style.left = `${Math.random() * 100}vw`;
                ball.style.top = `${Math.random() * 100}vh`;
                ball.style.animationDuration = `${Math.random() * 5 + 3}s`;
                container.appendChild(ball);

                ball.addEventListener('mouseover', () => {
                    ball.style.transform = 'scale(0)';
                });
            }
        }
