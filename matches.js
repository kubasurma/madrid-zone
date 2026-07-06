async function loadMatches() {

    const response = await fetch(
        "http://127.0.0.1:8000/real-matches"
    );

    const data = await response.json();

    const matches = data.matches;

    const container = document.getElementById("matches-container");

    container.innerHTML = "";

    matches.forEach(match => {
        let leftTeam;
        let rightTeam;
        let leftCrest;
        let rightCrest;
        const date = new Date(match.utcDate);

        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();

        const formattedDate = `${day}.${month}.${year}`;

        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        const formattedTime = `${hours}:${minutes}`;
        let status;
        if (match.status === "SCHEDULED") {
            status = "🟢 Zaplanowany";
        } else if (match.status === "LIVE") {
            status = "🔴 Na żywo";
        } else if (match.status === "FINISHED") {
            status = "✅ Zakończony";
        } else {
            status = "❓ Nieznany status";
        }


        if (match.homeTeam.name === "Real Madrid CF") {
            leftTeam = match.homeTeam.name;
            rightTeam = match.awayTeam.name;

            leftCrest = match.homeTeam.crest
            rightCrest = match.awayTeam.crest
        } else {
            leftTeam = match.awayTeam.name;
            rightTeam = match.homeTeam.name;

            leftCrest = match.awayTeam.crest;
            rightCrest = match.homeTeam.crest;
        }

        container.innerHTML += `
            <div class="match-card-modern">
                <div class="teams">

                    <div class="team">
                        <img src="${leftCrest}" alt="${leftTeam}">
                        <p>${leftTeam}</p>
                    </div>

                    <div class="match-center">
                        <div class="vs">VS</div>

                        <div class="match-details">
                            <p><strong>📅 Data:</strong> ${formattedDate}</p>
                            <p><strong>🏆 Rozgrywki:</strong> ${match.competition.name}</p>
                            <p><strong>🕒 Godzina:</strong> ${formattedTime}</p>
                            <p><strong>Status:</strong> ${status}</p>
                        </div>
                    </div>

                    <div class="team">
                        <img src="${rightCrest}" alt="${rightTeam}">
                        <p>${rightTeam}</p>
                    </div>

                </div>
            </div>
        `;
    });
}

loadMatches();