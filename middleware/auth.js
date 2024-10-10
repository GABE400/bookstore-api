const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes (authentication required)
exports.protect = async (req, res, next) => {
  let token;

  // Check if the token is present in the headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Extract the token
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token is provided, return an error
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the ID in the token
    req.user = await User.findById(decoded.userId);

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next(); // Move on to the next middleware or route handler
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// Authorize based on roles (admin or other roles)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. You do not have permission." });
    }
    next();
  };
};
