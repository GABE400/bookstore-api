const Review = require("../models/Review");
const Book = require("../models/Book");

// Add a new review (logged-in users only)
exports.addReview = async (req, res) => {
  const { bookId, rating, comment } = req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Ensure that the user is attached to the review (from req.user)
    const review = new Review({
      book: bookId,
      user: req.user._id, // This should be set from the logged-in user's ID
      rating,
      comment,
    });

    await review.save();
    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get reviews for a specific book
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId }).populate(
      "user",
      "email"
    );
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a review (logged-in users can update their own reviews)
exports.updateReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const review = await Review.findOne({
      _id: req.params.reviewId,
      user: req.user._id,
    });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();
    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a review (logged-in users can delete their own reviews)
exports.deleteReview = async (req, res) => {
  try {
    // Find the review by ID and ensure the user owns the review
    const review = await Review.findOne({
      _id: req.params.reviewId,
      user: req.user._id,
    });

    if (!review) {
      return res
        .status(404)
        .json({
          message: "Review not found or you are not authorized to delete it",
        });
    }

    // Delete the review
    await review.deleteOne();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error" });
  }
};
