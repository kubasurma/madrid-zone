async function loadNews() {
    const response = await fetch(
        "http://127.0.0.1:8000/real-news"
    );

    const news = await response.json();

    const container = document.getElementById("news-container");

    container.innerHTML = "";

    news.forEach(article => {
        const date = new Date(article.published_at);

        const formattedDate = date.toLocaleDateString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });

        const image = article.image || "images/real.jpg";

        container.innerHTML += `
            <article class="news-card external-news-card">
                <img src="${image}" alt="${article.title}">

                <div class="news-card-content">
                    <span class="news-source">
                        ${article.source ?? "Źródło zewnętrzne"}
                    </span>

                    <h3>${article.title}</h3>

                    <p>${article.description ?? "Brak opisu artykułu."}</p>

                    <div class="news-card-footer">
                        <span>${formattedDate}</span>

                        <a href="${article.url}" target="_blank" rel="noopener noreferrer">
                            Czytaj więcej →
                        </a>
                    </div>
                </div>
            </article>
        `;
    });
}

loadNews();