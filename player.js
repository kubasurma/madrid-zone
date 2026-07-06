async function loadPlayer() {
    const params = new URLSearchParams(window.location.search);
    const playerId = params.get("id");

    const response = await fetch(
        `http://127.0.0.1:8000/players/${playerId}`
    );

    const player = await response.json();

    const externalResponse = await fetch(
        `http://127.0.0.1:8000/players/${playerId}/external`
    );

    const externalPlayer = await externalResponse.json();

    let formattedBirthDate = "Brak danych";
    let age = "Brak danych";

    if (externalPlayer.birth_date) {
        const [year, month, day] = externalPlayer.birth_date.split("-");

        formattedBirthDate = `${day}.${month}.${year}`;

        const today = new Date();

        age = today.getFullYear() - Number(year);

        const birthdayHasNotHappenedYet =
            today.getMonth() + 1 < Number(month) ||
            (
                today.getMonth() + 1 === Number(month) &&
                today.getDate() < Number(day)
            );

        if (birthdayHasNotHappenedYet) {
            age--;
        }
    }

    const positionTranslations = {
    "Goalkeeper": "Bramkarz",
    "Centre-Back": "Środkowy obrońca",
    "Left-Back": "Lewy obrońca",
    "Right-Back": "Prawy obrońca",
    "Defensive Midfield": "Defensywny pomocnik",
    "Central Midfield": "Środkowy pomocnik",
    "Attacking Midfield": "Ofensywny pomocnik",
    "Left Winger": "Lewy skrzydłowy",
    "Right Winger": "Prawy skrzydłowy",
    "Centre-Forward": "Środkowy napastnik"
};

const statusTranslations = {
    "Active": "Aktywny"
};

const translatedPosition =
    positionTranslations[externalPlayer.external_position]
    ?? externalPlayer.external_position
    ?? "Brak danych";

const translatedStatus =
    statusTranslations[externalPlayer.status]
    ?? externalPlayer.status
    ?? "Brak danych";



    const container = document.getElementById("player-profile-container");

    container.innerHTML = `
        <div class="player-profile-card">
            <div class="player-profile-image">
                <img src="images/${player.image}" alt="${player.name}">
            </div>

            <div class="player-profile-info">
                <span class="player-profile-number">#${player.number}</span>
                <h2>${player.name}</h2>

                <p><strong>Pozycja:</strong> ${player.position}</p>
                <p><strong>Narodowość:</strong> ${externalPlayer.nationality ?? "Brak danych"}</p>
                <p><strong>Data urodzenia:</strong> ${formattedBirthDate}</p>
                <p><strong>Wiek:</strong> ${age} lat</p>
                <p><strong>Pozycja:</strong> ${translatedPosition}</p>
                <p><strong>Status:</strong> ${translatedStatus}</p>
                <a href="players.html" class="back-to-squad">
                    ← Wróć do kadry
                </a>
            </div>
        </div>
    `;
}

loadPlayer();