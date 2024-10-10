const Book = require("../models/Book");

// Get all books (available to everyone)
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("addedBy", "email"); // Populate addedBy with the user's email
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "addedBy",
      "email"
    );
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new book (admin only)
exports.addBook = async (req, res) => {
  const { title, author, isbn, publishedDate, genre } = req.body;

  if (!title || !author || !isbn) {
    return res
      .status(400)
      .json({ message: "Please provide title, author, and ISBN" });
  }

  try {
    const book = new Book({
      title,
      author,
      isbn,
      publishedDate,
      genre,
      addedBy: req.user.userId, // Logged-in user who adds the book
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a book by ID (admin only)
exports.updateBook = async (req, res) => {
  const { title, author, isbn, publishedDate, genre } = req.body;

  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.isbn = isbn || book.isbn;
    book.publishedDate = publishedDate || book.publishedDate;
    book.genre = genre || book.genre;

    await book.save();
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a book by ID (admin only)
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Use findByIdAndDelete to delete the book
    await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Search for books by title, author, or ISBN using Promises
exports.searchBooks = (req, res) => {
  const { query } = req.query;

  console.log("Search query:", query); // Log the search query for debugging

  // Perform a case-insensitive search by title, author, or ISBN
  Book.find({
    $or: [
      { title: { $regex: query, $options: "i" } }, // Search by title using regex (case-insensitive)
      { author: { $regex: query, $options: "i" } }, // Search by author using regex (case-insensitive)
      { isbn: { $regex: query, $options: "i" } }, // Search by ISBN using regex (case-insensitive)
    ],
  })
    .then((books) => {
      if (books.length === 0) {
        return res.status(404).json({ message: "No books found" });
      }
      res.status(200).json(books);
    })
    .catch((error) => {
      console.error("Error searching for books:", error);
      res.status(500).json({ message: "Server error" });
    });
};

// Get books by title (case-insensitive)
exports.getBookByTitle = async (req, res) => {
  const { title } = req.params;

  try {
    // Find books by title using case-insensitive regex
    const books = await Book.find({ title: { $regex: title, $options: "i" } });

    if (books.length === 0) {
      return res
        .status(404)
        .json({ message: "No books found with the given title" });
    }

    res.status(200).json(books);
  } catch (error) {
    console.error("Error getting books by title:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get books by author (case-insensitive)
exports.getBookByAuthor = async (req, res) => {
  const { author } = req.params;

  try {
    // Find books by author using case-insensitive regex
    const books = await Book.find({
      author: { $regex: author, $options: "i" },
    });

    if (books.length === 0) {
      return res
        .status(404)
        .json({ message: "No books found with the given author" });
    }

    res.status(200).json(books);
  } catch (error) {
    console.error("Error getting books by author:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get books by ISBN (exact match)
exports.getBookByISBN = async (req, res) => {
  const { isbn } = req.params;

  try {
    // Find books by ISBN (exact match)
    const books = await Book.find({ isbn });

    if (books.length === 0) {
      return res
        .status(404)
        .json({ message: "No books found with the given ISBN" });
    }

    res.status(200).json(books);
  } catch (error) {
    console.error("Error getting books by ISBN:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// // Search for books by title, author, or ISBN
// exports.searchBooks = async (req, res) => {
//   const { query } = req.query;

//   try {
//     // Perform a case-insensitive search by title, author, or ISBN
//     const books = await Book.find({
//       $or: [
//         { title: { $regex: query, $options: "i" } },
//         { author: { $regex: query, $options: "i" } },
//         { isbn: { $regex: query, $options: "i" } },
//       ],
//     });

//     if (books.length === 0) {
//       return res.status(404).json({ message: "No books found" });
//     }

//     res.status(200).json(books);
//   } catch (error) {
//     console.error("Error searching for books:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
