async function loadPlayers() {
    const response = await fetch("http://127.0.0.1:8000/players");
    const players = await response.json();

    players.forEach(player => {
        let container;

        if (player.position === "Bramkarz") {
            container = document.getElementById("goalkeepers");
        } else if (player.position === "Obrońca") {
            container = document.getElementById("defenders");
        } else if (player.position === "Pomocnik") {
            container = document.getElementById("midfielders");
        } else {
            container = document.getElementById("forwards");
        }

        container.innerHTML += `
            <div class="player-card-modern" data-player-id="${player.id}">
                <img src="images/${player.image}" alt="${player.name}">

                <div class="player-info">
                    <span class="player-number">${player.number ?? "-"}</span>
                    <h3>${player.name}</h3>
                </div>
            </div>
        `;
    });

    const playerCards = document.querySelectorAll(".player-card-modern");

    playerCards.forEach(card => {
        card.addEventListener("click", () => {
            const playerId = card.dataset.playerId;

            window.location.href = `player.html?id=${playerId}`;
        });
    });
}

loadPlayers();