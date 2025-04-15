document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
  
    // Bloquear rutas si no hay sesión
    const isProtectedRoute = !["/login", "/register"].includes(path);
    const user = JSON.parse(localStorage.getItem("sessionUser"));
  
    if (isProtectedRoute && !user) {
      window.location.href = "/login";
      return;
    }
  
    // Redirigir a dashboard si ya está logueado
    if ((path === "/login" || path === "/register") && user) {
      window.location.href = "/dashboard";
      return;
    }
  
    // Login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = loginForm.username.value.trim();
        const password = loginForm.password.value;
  
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const foundUser = users.find(u => u.username === username && u.password === password);
  
        if (foundUser) {
          localStorage.setItem("sessionUser", JSON.stringify(foundUser));
          window.location.href = "/dashboard";
        } else {
          alert("Credenciales incorrectas.");
        }
      });
    }
  
    // Registro
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = registerForm.username.value.trim();
        const password = registerForm.password.value;
  
        let users = JSON.parse(localStorage.getItem("users")) || [];
  
        if (users.some(u => u.username === username)) {
          alert("Ese usuario ya existe.");
          return;
        }
  
        const newUser = { username, password };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        alert("Usuario registrado correctamente.");
        window.location.href = "/login";
      });
    }
  });
  
  // Logout global
  function logout() {
    localStorage.removeItem("sessionUser");
    window.location.href = "/login";
  }
  