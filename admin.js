const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const form = document.getElementById("news-form");
const newsList = document.getElementById("admin-news-list");

let editedNewsId = null;


async function loadAdminNews() {
    const response = await fetch("http://127.0.0.1:8000/news");
    const news = await response.json();

    newsList.innerHTML = "";

    news.forEach(article => {
        newsList.innerHTML += `
            <div class="admin-news-card">
                <img src="images/${article.image}" alt="News">

                <div>
                    <h3>${article.title}</h3>
                    <p>${article.category}</p>

                    <button onclick="startEditNews(${article.id}, '${article.title}', '${article.category}', '${article.image}')">
                        Edytuj
                    </button>

                    <button onclick="deleteNews(${article.id})">
                        Usuń
                    </button>
                </div>
            </div>
        `;
    });
}


form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const image = document.getElementById("image").value;

    let url = "http://127.0.0.1:8000/news";
    let method = "POST";

    if (editedNewsId !== null) {
        url = `http://127.0.0.1:8000/news/${editedNewsId}`;
        method = "PUT";
    }

    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            category: category,
            image: image
        })
    });

    const data = await response.json();

    alert(data.message);

    form.reset();
    editedNewsId = null;
    form.querySelector("button").textContent = "Dodaj news";

    loadAdminNews();
});


function startEditNews(id, title, category, image) {
    editedNewsId = id;

    document.getElementById("title").value = title;
    document.getElementById("category").value = category;
    document.getElementById("image").value = image;

    form.querySelector("button").textContent = "Zapisz zmiany";
}


async function deleteNews(id) {
    const response = await fetch(`http://127.0.0.1:8000/news/${id}`, {
        method: "DELETE"
    });

    const data = await response.json();

    alert(data.message);

    loadAdminNews();
}


const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", function() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});


loadAdminNews();