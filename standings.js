async function loadStandings() {
    const response = await fetch(
        "http://127.0.0.1:8000/laliga-standings"
    );

    const data = await response.json();

    const table = data.standings[0].table;

    const container = document.getElementById("standings-container");

    container.innerHTML = `
        <div class="standing-row standing-header">
            <div>Poz.</div>
            <div>Drużyna</div>
            <div>M</div>
            <div>W</div>
            <div>R</div>
            <div>P</div>
            <div>RB</div>
            <div>PKT</div>
        </div>
    `;

    table.forEach(team => {
        let realClass = "";

        if (team.team.name === "Real Madrid CF") {
            realClass = "real-row";
        }
        container.innerHTML += `
            <div class="standing-row ${realClass}">
                <div class="standing-position">
                    ${team.position}
                </div>

                <div class="standing-team">
                    <img src="${team.team.crest}" alt="${team.team.name}">
                    <span>${team.team.name}</span>
                </div>

                <div>${team.playedGames}</div>
                <div>${team.won}</div>
                <div>${team.draw}</div>
                <div>${team.lost}</div>
                <div>${team.goalDifference}</div>
                <div class="standing-points">${team.points}</div>
            </div>
        `;
    });
}

loadStandings();