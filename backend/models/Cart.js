// models/Cart.js
const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Temporary mock userId
  items: [
    {
      productId: { type: String, required: true }, // Use String temporarily, not ObjectId
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }, // Price included in cart
    },
  ],
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
