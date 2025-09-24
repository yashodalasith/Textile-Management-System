const User = require("../models/UserManagmentModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Fix typo

const JWT_SECRET = process.env.JWT_SECRET; // Use environment variable
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET; // Use environment variable
function issueTokens(payload) {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "10m",
  });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
}

const loginUser = async (req, res, next) => {
 const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payload = { sub: user.id, role: user.role };
  const { accessToken, refreshToken } = issueTokens(payload);

  // Set refresh token cookie (HttpOnly, Secure, SameSite)
  res.cookie("rt", refreshToken, {
    httpOnly: true,         // true in production (HTTPS)
    sameSite: "Strict",    // or "Lax" if you need cross-site GET navigations
    path: "/login/refresh", // cookie only sent to refresh endpoint
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Return only access token + minimal public profile in body
  res.json({
    accessToken,
    user: { id: user.id, name: user.name, role: user.role },
  });
};

const refreshTokens = (req, res) => {
  const token = req.cookies?.rt;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const { accessToken, refreshToken } = issueTokens({ sub: decoded.sub, role: decoded.role });

    // rotate refresh token
    res.cookie("rt", refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      path: "/login/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch {
    res.status(401).json({ message: "Invalid refresh token" });
  }
}

///admin authentication


const logoutUser = async (req, res, next) => {
  res.clearCookie("rt", { path: "/login/refresh" });
  res.status(204).end();
  
};

exports.loginUser = loginUser;
exports.logoutUser = logoutUser;
exports.refreshTokens = refreshTokens;
