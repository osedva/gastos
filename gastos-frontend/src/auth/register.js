import { apiFetch } from "../utils/api.js";

async function handleRegister(event) {
  event.preventDefault(); //Evitar recargar la página
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value.trim();

  try {
    //Llamar a la API
    const response = await apiFetch("/auth/register", "POST", {
      name,
      email,
      password,
    });

    alert("Registro exitoso. Redirigiendo a la pagina de login...");
    window.location.href = "login.html";
  } catch (error) {
    alert(`Error en el registro: ${error.message}`);
    console.error("Error en registro:", error);
  }
}

document
  .getElementById("registerForm")
  .addEventListener("submit", handleRegister);
