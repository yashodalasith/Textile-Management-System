const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserSchema = new schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    ConfirmPassword: {
        type: String,
        required: true,
    }, role: {
        type: String,
        enum: ['user', 'admin', 'InventoryManager'],
        default: 'user' // Default role is a regular user fjfjj
    }
})

module.exports = mongoose.model("User", UserSchema);