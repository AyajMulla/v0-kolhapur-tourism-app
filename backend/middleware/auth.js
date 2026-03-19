const jwt = require('jsonwebtoken');

// Middleware to protect routes that require authentication
module.exports = function (req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Extract token from "Bearer <token>" string
    const decoded = jwt.verify(token.split(' ')[1] || token, process.env.JWT_SECRET || 'supersecretkey');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
