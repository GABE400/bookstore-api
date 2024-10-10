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

// Search for books by title, author, or ISBN
exports.searchBooks = async (req, res) => {
  const { query } = req.query;

  try {
    // Perform a case-insensitive search by title, author, or ISBN
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { isbn: { $regex: query, $options: "i" } },
      ],
    });

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }

    res.status(200).json(books);
  } catch (error) {
    console.error("Error searching for books:", error);
    res.status(500).json({ message: "Server error" });
  }
};
