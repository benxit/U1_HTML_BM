const API_URL = 'http://localhost:3000/api';

document.getElementById("loginForm").addEventListener("submit", async function(e) {

    e.preventDefault();

    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();
    const error = document.getElementById("error");

    error.textContent = "";

    try {

        const response = await fetch(`${API_URL}/auth/login`, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                email: correo,
                password: password
            })

        });

        const data = await response.json();

        if (!response.ok) {

            error.textContent =
                data.message || "Correo o contraseña incorrectos";

            return;
        }

        localStorage.setItem("token", data.data.token);

        localStorage.setItem("user", JSON.stringify(data.data.user));

        const role = data.data.user.role;

        if (role === "admin") {

            window.location.href = "pagina-admin/adminweb.html";

        } else if (role === "coach") {

            window.location.href = "pagina-coach/coachweb.html";

        } else {

            window.location.href = "pagina-usuarios/usuarioweb.html";

        }

    } catch (err) {

        error.textContent = "No se pudo conectar con la API";

        console.error(err);

    }

});