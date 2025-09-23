const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized - Please login first",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
};

const adminAuth = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized - Please login first",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden - Admin access required",
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
};

module.exports = { auth, adminAuth };
