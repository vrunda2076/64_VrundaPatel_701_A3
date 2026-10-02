const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// SESSION SETUP (FILE STORE)
app.use(session({
    store: new FileStore({ path: "./sessions" }),
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false
}));

// Middleware (Protected Route)
function isAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/");
    }
}

// LOGIN PAGE
app.get("/", (req, res) => {
    res.render("login", { error: null });
});

// LOGIN PROCESS
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "123") {
        req.session.user = username;
        res.redirect("/dashboard");
    } else {
        res.render("login", { error: "Invalid credentials" });
    }
});

// PROTECTED ROUTE 1
app.get("/dashboard", isAuth, (req, res) => {
    res.render("dashboard", { user: req.session.user });
});

// PROTECTED ROUTE 2
app.get("/profile", isAuth, (req, res) => {
    res.render("profile", { user: req.session.user });
});

// LOGOUT
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

// SERVER
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});