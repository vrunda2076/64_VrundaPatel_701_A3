
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");


require("./config/db");
const Employee = require("./models/Employee");

const app = express();

// ---------- MIDDLEWARE ----------
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "erp123",
    resave: false,
    saveUninitialized: false
  })
);

// ---------- LOGIN PAGE ----------
app.get("/", (req, res) => {
  res.render("login");
});

// ---------- LOGIN ----------
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    req.session.admin = username;
    return res.redirect("/dashboard");
  }

  res.send("Invalid Login ❌");
});

// ---------- DASHBOARD ----------
app.get("/dashboard", (req, res) => {
  if (!req.session.admin) return res.redirect("/");
  res.render("dashboard");
});

// ---------- ADD EMPLOYEE PAGE ----------
app.get("/add", (req, res) => {
  res.render("addEmployee");
});

// ---------- CREATE EMPLOYEE ----------
app.post("/add", async (req, res) => {
  const { name, email, salary, role } = req.body;

  // VALIDATION FIX
  if (isNaN(salary)) {
    return res.send("❌ Salary must be a number");
  }

  const empId = "EMP" + Math.floor(Math.random() * 10000);
  const plainPassword = "pass123";

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await Employee.create({
    empId,
    name,
    email,
    salary: Number(salary),
    role,
    password: hashedPassword
  });

  console.log(`Email sent to ${email} with password: ${plainPassword}`);

  res.redirect("/list");
});

// ---------- LIST EMPLOYEES ----------
app.get("/list", async (req, res) => {
  const employees = await Employee.find();
  res.render("listEmployee", { employees });
});

// ---------- DELETE ----------
app.get("/delete/:id", async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.redirect("/list");
});

// ---------- EDIT PAGE ----------
app.get("/edit/:id", async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  res.render("editEmployee", { emp });
});

// ---------- UPDATE ----------
app.post("/update/:id", async (req, res) => {
  await Employee.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/list");
});

// ---------- LOGOUT ----------
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// ---------- SERVER ----------
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});