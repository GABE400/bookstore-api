const express = require("express");
const { getProfile } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Get profile (protected route)
router.get("/profile", protect, getProfile);

// Admin-only route (example of role-based protection)
router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.status(200).json({ message: "Welcome Admin!" });
});

module.exports = router;
