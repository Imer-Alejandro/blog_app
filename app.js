const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(expressLayouts);
app.set('layout', 'layout'); 

// Configuración
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cors());

// Rutas
app.get("/", (req, res) => res.redirect("/login"));

app.get("/login", (req, res) => res.render("login", { title: 'Iniciar sesión', showLogout: false }));
app.get("/register", (req, res) => res.render("register", { title: 'Registro de usuarios', showLogout: false }));
app.get("/dashboard", (req, res) => res.render("dashboard", { title: 'Inicio Blog', showLogout: false }));
app.get("/post/new", (req, res) => res.render("new-post", { title: 'Crear post', showLogout: false }));
app.get("/post/edit/:id", (req, res) => res.render("edit-post", {title: 'Gestion de categorias', id: req.params.id }));
app.get("/categories", (req, res) => res.render("categories", { title: 'Gestion de categorias', showLogout: false }));

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
