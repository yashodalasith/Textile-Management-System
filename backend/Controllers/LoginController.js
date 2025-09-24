const User = require("../models/UserManagmentModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Fix typo

const JWT_SECRET = process.env.JWT_SECRET; // Use environment variable

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, role: user.role, userId: user._id });
  } catch (err) {
    // Log error securely without exposing details to client
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

///admin authentication
const adminAuth = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    req.user = decoded; // Attach user details to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
//InvntoryManager
const inventoryAuth = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "InventoryManager") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    req.user = decoded; // Attach user details to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const logoutUser = async (req, res, next) => {
  // For JWT-based auth, logout is handled client-side by removing the token
  res.json({ message: "Logout successful" });
};

exports.loginUser = loginUser;
exports.logoutUser = logoutUser;
exports.adminAuth = adminAuth;
exports.inventoryAuth = inventoryAuth;
