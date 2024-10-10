// Get logged-in user's profile
exports.getProfile = (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};
