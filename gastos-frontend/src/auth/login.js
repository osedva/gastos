import { apiFetch } from "../utils/api.js";
import { setToken } from "../utils/auth.js";
import { clearToken } from "../utils/auth.js";

async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  try {
    const response = await apiFetch("/auth/login", "POST", { email, password });
    setToken(response.token);
    alert("Inicio de sesión exitos. Redirigiendo a la página principal");

    window.location.href = "categories.html";
  } catch (error) {
    alert(`Error al iniciar sesión: ${error.message}`);
    console.error("Error en el login", error);
  }

}

document.getElementById("loginForm").addEventListener("submit", handleLogin);

clearToken();





