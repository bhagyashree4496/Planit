const jwt = require("jsonwebtoken");

// Middleware to protect routes and verify user authentication
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: "Authentication token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret
    console.log(decoded);
    req.user = decoded; // Attach user info to the request
    req.user = { id: decoded.id, email: decoded.email };
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authenticateUser;
