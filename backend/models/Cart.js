// models/Cart.js
const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      productName: { type: String, required: true },
    },
  ],
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
