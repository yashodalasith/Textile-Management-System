const User = require("../models/UserManagmentModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Fix typo

const JWT_SECRET = process.env.JWT_SECRET; // Use environment variable

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User not found!!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials!" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set session data
    req.session.userId = user._id;
    req.session.userRole = user.role;
    req.session.userEmail = user.email;

    res.json({ token, role: user.role, userId: user._id });
  } catch (err) {
    console.log(err);
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
  // Clear session data
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Could not log out" });
    }
    res.json({ message: "Logout successful" });
  });
};

exports.loginUser = loginUser;
exports.logoutUser = logoutUser;
exports.adminAuth = adminAuth;
exports.inventoryAuth = inventoryAuth;
