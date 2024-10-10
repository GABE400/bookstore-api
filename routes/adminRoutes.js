const express = require("express");
const {
  getAllUsers,
  updateUser,
  deleteUser,
  createUser,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth"); // Ensure this import is correct

const router = express.Router();

// All routes in this file should be protected and only accessible by admins
router.use(protect); // All routes below will require authentication
router.use(authorize("admin")); // All routes below will require the 'admin' role

// Admin routes for user management
router.get("/users", getAllUsers); // Admin can get all users
router.post("/users", createUser); // Admin can create new users
router.put("/users/:id", updateUser); // Admin can update users
router.delete("/users/:id", deleteUser); // Admin can delete users

module.exports = router;
