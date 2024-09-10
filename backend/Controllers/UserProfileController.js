const User = require('../Model/UserManagmentModel')
const jwt = require("jsonwebtoken");
const { get } = require('../Routes/UserLoginRoute');
const JWT_SECRET = process.env.JWT_SECRET;


const getProfile = async (req, res, next) => {
   const {token} = req.body;

    // if (!token) {
    //     return res.status(401).json({ status: "error", message: "No token provided" });
    // }

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userId = decodedToken.userId;

        const user = await User.findById(userId);

        if (user) {
            res.status(200).json({ status: "ok", user });
        } else {
            res.status(404).json({ status: "error", message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(401).json({ status: "error", message: "Invalid Token" });
    }
};
exports.getProfile = getProfile;