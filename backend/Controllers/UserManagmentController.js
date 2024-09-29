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
        return res.status(400).json({ error: "User already exists" });
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
                address: user.address
            },
            token // Include the token in the response
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Unable to add user" });
    }
}


const getAllUser = async (req, res, next) => {

    let users;
    //get all users
    try {
        users = await User.find();
    } catch (error) {
        console.log(err);
    }
    //not found
    if (!users) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ users });

}

const getById = async (req, res, next) => {
    const id = req.params.id;

    let user;
    try {
        user = await User.findById(id);
    } catch (error) {
        console.log(error);
    }
    if (!user) {
        return res.status(404).json({ message: "user not found!" });
    }
    return res.status(200).json({ user });
}

const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    let user;

    try {
        user = await User.findByIdAndDelete(id);
    } catch (error) {
        console.log(error);

    }
    if (!user) {
        return res.status(404).json({ message: "unable to delete user!" });
    }
    return res.status(200).json({ user });
}

const updateUser = async (req, res, next) => {
    const id = req.params.id;
    const { name, email, phone, address, password, ConfirmPassword } = req.body;
    let users;

    try {
        users = await User.findByIdAndUpdate(id, {
            name: name,
            email: email,
            address: address,
            phone: phone,
            password: password,
            ConfirmPassword: ConfirmPassword,
        });
        users = await users.save();
    } catch (error) {
        console.log(error);

    }
    if (!users) {
        return res.status(404).json({ message: "Unable to Update users Details" });
    }
    return res.status(200).json({ users });
};


exports.getAllUser = getAllUser;
exports.addUser = addUser;
exports.deleteUser = deleteUser;
exports.getById = getById;
exports.updateUser = updateUser;
