const jwt = require("jsonwebtoken");

function getBearerToken(req) {
  const raw = req.get("authorization"); // case-insensitive
  if (!raw || typeof raw !== "string") return null;

  // Support extra spaces and case-insensitive "Bearer"
  const [scheme, ...rest] = raw.trim().split(/\s+/);
  if (!scheme || scheme.toLowerCase() !== "bearer") return null;

  const token = rest.join(" ");
  // Guard against 'null' / 'undefined' string values
  if (!token || token.toLowerCase() === "null" || token.toLowerCase() === "undefined") return null;

  return token;
}


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


///admin authentication
const adminAuth = (req, res, next) => {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // Fail closed if misconfigured
      return res.status(500).json({ message: "Server config error" });
    }
    const decoded = jwt.verify(token, secret);

    // Enforce role
    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Attach user to request for downstream handlers
    req.user = decoded;
    return next();
  } catch (err) {
    // Normalize errors without leaking details
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const inventoryAuth = (req, res, next) => {
 
  try {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // Fail closed if misconfigured
      return res.status(500).json({ message: "Server config error" });
    }
    const decoded = jwt.verify(token, secret);

    if (decoded.role !== "InventoryManager") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    req.user = decoded; // Attach user details to request
    return next();
  } catch (error) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { auth, adminAuth, inventoryAuth };
