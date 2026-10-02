const express = require("express");
const session = require("express-session");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);

const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(express.urlencoded({ extended: true }));

// -------------------- REDIS --------------------
const redisClient = redis.createClient();

redisClient.on("connect", () => {
  console.log("Redis Connected...");
});

redisClient.on("error", (err) => {
  console.log("Redis Error:", err);
});

// -------------------- SESSION --------------------
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "secret123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 10
    }
  })
);

// -------------------- ROUTES --------------------

// LOGIN PAGE (HOME)
app.get("/", (req, res) => {
  res.send(`
    <h2>Login Page</h2>

    <form method="POST" action="/login">
      <input type="text" name="username" placeholder="Username" required />
      <br><br>

      <input type="password" name="password" placeholder="Password" required />
      <br><br>

      <button type="submit">Login</button>
    </form>
  `);
});

// LOGIN CHECK
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "12345") {
    req.session.user = username;
    return res.redirect("/dashboard");
  }

  res.send("Invalid Credentials ❌");
});

// DASHBOARD (PROTECTED)
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.send("Unauthorized ❌ Please login first");
  }

  res.send(`
    <h2>Welcome ${req.session.user}</h2>
    <a href="/logout">Logout</a>
  `);
});

// LOGOUT
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// -------------------- START SERVER --------------------
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});