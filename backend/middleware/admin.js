module.exports = function (req, res, next) {
  // Check if role is admin
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access Denied: You do not have administrator permissions.' });
  }
  next();
};
