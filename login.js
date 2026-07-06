const form = document.getElementById("login-form");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });

    const data = await response.json();

    if (data.token) {

    localStorage.setItem("token", data.token);

    alert("Zalogowano!");

    window.location.href = "admin.html";

} else {

    alert(data.message);

}

    console.log(data);
});

