const express = require("express");
const path = require("path");
const multer = require("multer");
const { body, validationResult } = require("express-validator");

const app = express();

// ================= MIDDLEWARE =================
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// serve static files (uploaded images)

app.use(express.static("uploads"));
app.use(express.static("public")); // for CSS (optional)


// ================= MULTER CONFIG =================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// ================= ROUTES =================

// GET FORM PAGE
app.get("/", (req, res) => {
    res.render("form", { errors: [], old: {} });
});

// POST FORM (REGISTER)
app.post(
    "/register",
    upload.fields([
        { name: "profile", maxCount: 1 },
        { name: "others", maxCount: 5 }
    ]),

    // VALIDATION
    [
        body("username").notEmpty().withMessage("Username is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("password")
            .isLength({ min: 5 })
            .withMessage("Password must be at least 5 characters"),
        body("confirm").custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        })
    ],

    (req, res) => {
        const errors = validationResult(req);

        // IF ERRORS → SHOW FORM AGAIN WITH OLD DATA
        if (!errors.isEmpty()) {
            return res.render("form", {
                errors: errors.array(),
                old: req.body
            });
        }

        // SUCCESS DATA
        const data = {
            username: req.body.username,
            email: req.body.email,
            gender: req.body.gender,
            hobbies: req.body.hobbies,

            profile: req.files["profile"]
                ? req.files["profile"][0].filename
                : null,

            others: req.files["others"]
                ? req.files["others"].map(file => file.filename)
                : []
        };

        res.render("result", { data });
    }
);

// DOWNLOAD FILE ROUTE
app.get("/download/:file", (req, res) => {
    const filePath = path.join(__dirname, "uploads", req.params.file);
    res.download(filePath);
});

// ================= SERVER START =================
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});