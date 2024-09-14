const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  // Check for authorization header and ensure it starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token from the header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID in the decoded token and attach it to the request object
      req.user = await User.findById(decoded.id).select("-password");

      // Move on to the next middleware or route handler
      return next();
    } catch (error) {
      // Handle invalid token
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // If no token is provided, return an error
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
