const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Initialize express
const app = express();

// Middleware for JSON parsing
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); // Auth routes
app.use("/api/admin", adminRoutes); // Admin routes
app.use("/api/reviews", reviewRoutes); // Review routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/books", require("./routes/bookRoutes"));

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
