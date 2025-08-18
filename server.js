require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const { google } = require("googleapis");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Google Sheets setup
const spreadsheetId = process.env.SPREADSHEET_ID;

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.TEACHER_USER && password === process.env.TEACHER_PASS) {
    req.session.authenticated = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.get("/attendance", (req, res) => {
  if (!req.session.authenticated) {
    return res.redirect("/");
  }
  res.sendFile(path.join(__dirname, "views", "attendance.html"));
});

app.post("/submit", async (req, res) => {
  if (!req.session.authenticated) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const { students } = req.body;
    // Here you would implement Google Sheets writing
    console.log("Attendance data:", students);
    res.json({ success: true, message: "Attendance saved successfully" });
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ message: "Error saving attendance" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
