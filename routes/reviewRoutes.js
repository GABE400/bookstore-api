const express = require("express");
const {
  addReview,
  getReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/auth"); // Middleware to protect routes for logged-in users

const router = express.Router();

// Add a review (logged-in users only)
router.post("/", protect, addReview);

// Get reviews for a book
router.get("/:bookId", getReviews);

// Update a review (logged-in users only)
router.put("/:reviewId", protect, updateReview);

// Delete a review (logged-in users only)
router.delete("/:reviewId", protect, deleteReview);

module.exports = router;
