const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const isAuthenticated = require("../middleware/auth");

// dummy user (password = 12345)
const user = {
  username: "admin",
  password: bcrypt.hashSync("12345", 10)
};

// login page
router.get("/", (req, res) => {
  res.render("login");
});

// login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username === user.username) {
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      req.session.user = username;
      return res.redirect("/dashboard");
    }
  }

  res.send("❌ Invalid Credentials");
});

// protected route 1
router.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.session.user });
});

// protected route 2
router.get("/profile", isAuthenticated, (req, res) => {
  res.render("profile", { user: req.session.user });
});

// logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.send("✅ Logged out successfully");
  });
});

module.exports = router;