async function loadNextMatch() {
    const container = document.getElementById("home-next-match");

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/real-matches"
        );

        const data = await response.json();

        const nextMatch = data.matches.find(match =>
            match.status === "SCHEDULED" ||
            match.status === "TIMED"
        );

        if (!nextMatch) {
            container.innerHTML = `
                <p class="home-loading">
                    Brak informacji o nadchodzącym meczu.
                </p>
            `;

            return;
        }

        const realIsHome = nextMatch.homeTeam.name === "Real Madrid CF";

        const leftTeam = realIsHome
            ? nextMatch.homeTeam
            : nextMatch.awayTeam;

        const rightTeam = realIsHome
            ? nextMatch.awayTeam
            : nextMatch.homeTeam;

        const date = new Date(nextMatch.utcDate);

        const formattedDate = date.toLocaleDateString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });

        const formattedTime = date.toLocaleTimeString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Europe/Warsaw"
        });

        container.innerHTML = `
            <div class="home-match-card">

                <div class="home-match-team">
                    <img src="${leftTeam.crest}" alt="${leftTeam.name}">
                    <h3>${leftTeam.name}</h3>
                </div>

                <div class="home-match-center">
                    <div class="home-vs">VS</div>

                    <p>${formattedDate} • ${formattedTime}</p>
                    <p>${nextMatch.competition.name}</p>

                    <a href="matches.html">
                        Wszystkie mecze →
                    </a>
                </div>

                <div class="home-match-team">
                    <img src="${rightTeam.crest}" alt="${rightTeam.name}">
                    <h3>${rightTeam.name}</h3>
                </div>

            </div>
        `;
    } catch (error) {
        container.innerHTML = `
            <p class="home-loading">
                Nie udało się pobrać meczu.
            </p>
        `;
    }
}


async function loadHomeStandings() {
    const container = document.getElementById("home-standings");

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/laliga-standings"
        );

        const data = await response.json();

        const table = data.standings?.[0]?.table ?? [];

        const real = table.find(team =>
            team.team.name === "Real Madrid CF"
        );

        if (!real) {
            container.innerHTML = `
                <p class="home-loading">
                    Nie znaleziono Realu w tabeli.
                </p>
            `;

            return;
        }

        container.innerHTML = `
            <div class="home-standing-team">
                <img src="${real.team.crest}" alt="${real.team.name}">

                <div>
                    <h3>${real.team.name}</h3>
                    <p>Sezon 2026/27</p>
                </div>
            </div>

            <div class="home-standing-values">
                <div>
                    <span>${real.position}</span>
                    <p>Pozycja</p>
                </div>

                <div>
                    <span>${real.points}</span>
                    <p>Punkty</p>
                </div>

                <div>
                    <span>${real.playedGames}</span>
                    <p>Mecze</p>
                </div>
            </div>
        `;
    } catch (error) {
        container.innerHTML = `
            <p class="home-loading">
                Nie udało się pobrać tabeli.
            </p>
        `;
    }
}


async function loadHomeNews() {
    const container = document.getElementById("home-news");

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/real-news"
        );

        const news = await response.json();

        const latestNews = news.slice(0, 3);

        container.innerHTML = "";

        latestNews.forEach(article => {
            const date = new Date(article.published_at);

            const formattedDate = date.toLocaleDateString("pl-PL", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });

            const image = article.image || "images/real.jpg";

            container.innerHTML += `
                <article class="home-news-card">
                    <img src="${image}" alt="${article.title}">

                    <div class="home-news-content">
                        <span>${article.source ?? "Źródło zewnętrzne"}</span>

                        <h3>${article.title}</h3>

                        <div class="home-news-footer">
                            <p>${formattedDate}</p>

                            <a
                                href="${article.url}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Czytaj →
                            </a>
                        </div>
                    </div>
                </article>
            `;
        });
    } catch (error) {
        container.innerHTML = `
            <p class="home-loading">
                Nie udało się pobrać aktualności.
            </p>
        `;
    }
}


loadNextMatch();
loadHomeStandings();
loadHomeNews();