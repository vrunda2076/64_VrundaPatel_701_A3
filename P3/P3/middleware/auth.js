function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.send("❌ Unauthorized! Please login first.");
  }
}

module.exports = isAuthenticated;