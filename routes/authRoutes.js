const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController"); // Ensure the import is correct

const router = express.Router();

// Register route
router.post("/register", registerUser); // Ensure registerUser is defined and imported correctly

// Login route
router.post("/login", loginUser); // Ensure loginUser is defined and imported correctly

module.exports = router;
