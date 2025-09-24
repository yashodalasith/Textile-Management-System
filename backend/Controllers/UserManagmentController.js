const User = require("../models/UserManagmentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is set in your environment

const addUser = async (req, res, next) => {
  const { name, email, phone, address, password, ConfirmPassword } = req.body;

  // Check if passwords match
  if (password !== ConfirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  // Check if user already exists
  const oldUser = await User.findOne({ email });
  if (oldUser) {
    return res.status(400).json({ error: "Registration failed" });
  }

  let user;
  try {
    user = new User({
      name,
      email,
      phone,
      address,
      password: encryptedPassword,
      ConfirmPassword,
    });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id }, // Payload
      JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiration time
    );

    // Send response with user and token
    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
      token, // Include the token in the response
    });
  } catch (error) {
    console.error("Add user error:", error.message);
    return res.status(500).json({ error: "Registration failed" });
  }
};

const getAllUser = async (req, res, next) => {
  let users;
  //get all users
  try {
    users = await User.find();
  } catch (error) {
    console.error("Get users error:", error.message);
  }
  //not found
  if (!users) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ users });
};

const getById = async (req, res, next) => {
  const id = req.params.id;

  let user;
  try {
    user = await User.findById(id);
  } catch (error) {
    console.error("Get user by ID error:", error.message);
  }
  if (!user) {
    return res.status(404).json({ message: "user not found!" });
  }
  return res.status(200).json({ user });
};

const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  let user;

  try {
    user = await User.findByIdAndDelete(id);
  } catch (error) {
    console.error("Delete user error:", error.message);
  }
  if (!user) {
    return res.status(404).json({ message: "unable to delete user!" });
  }
  return res.status(200).json({ user });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, password, ConfirmPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update non-sensitive fields only if provided
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    // Handle password change (optional)
    if (password !== undefined && password !== "") {
      // 1) Confirm match
      if (password !== ConfirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      // 2) Basic strength gate (optional but recommended)
      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }
      // 3) Hash
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);
      // 4) Optional: mark password changed time for JWT invalidation logic
      user.passwordChangedAt = new Date();
    }

   

    await user.save();

    // Remove sensitive fields from response
    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(200).json({ user: safeUser });
  } catch (err) {
    console.error("Update user error:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getAllUser = getAllUser;
exports.addUser = addUser;
exports.deleteUser = deleteUser;
exports.getById = getById;
exports.updateUser = updateUser;
