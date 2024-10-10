const express = require("express");
const {
  addBook,
  updateBook,
  deleteBook,
  getBooks,
  searchBooks,
  getBookByTitle,
  getBookByAuthor,
  getBookByISBN,
} = require("../controllers/bookController");
const { protect, authorize } = require("../middleware/auth"); // Ensure authorize is imported

const router = express.Router();

// Book routes (Only admin can add/update/delete books)
router.post("/", protect, authorize("admin"), addBook);
router.put("/:id", protect, authorize("admin"), updateBook);
router.delete("/:id", protect, authorize("admin"), deleteBook);

// Route to get books by title
router.get("/title/:title", getBookByTitle);

// Route to get books by author
router.get("/author/:author", getBookByAuthor);

// Route to get books by ISBN
router.get("/isbn/:isbn", getBookByISBN);

// Search for books by title, author, or ISBN
router.get("/search", searchBooks);

// Public route to get all books (accessible to all)
router.get("/", getBooks);

module.exports = router;
