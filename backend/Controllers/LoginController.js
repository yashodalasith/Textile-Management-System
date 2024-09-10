const User = require("../Model/UserManagmentModel");
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
            return res.status(401).json({ error: "Incorrect Password!" });  
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "5h",
        });
        res.json({ token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.loginUser = loginUser;
