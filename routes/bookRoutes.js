const express = require("express");
const {
  addBook,
  updateBook,
  deleteBook,
  getBooks,
} = require("../controllers/bookController");
const { protect, authorize } = require("../middleware/auth"); // Ensure authorize is imported

const router = express.Router();

// Book routes (Only admin can add/update/delete books)
router.post("/", protect, authorize("admin"), addBook);
router.put("/:id", protect, authorize("admin"), updateBook);
router.delete("/:id", protect, authorize("admin"), deleteBook);

// Public route to get all books (accessible to all)
router.get("/", getBooks);

module.exports = router;
