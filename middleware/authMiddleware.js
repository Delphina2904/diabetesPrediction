module.exports = (req, res, next) => {
  // Example authentication check (replace with real logic)
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];

      // Verify token logic here
      // If valid, call next()
      // If invalid, return 401 Unauthorized

      // For demonstration, let's assume the token is always valid
      next();
  } else {
      res.status(401).json({ message: 'Unauthorized' });
  }
};