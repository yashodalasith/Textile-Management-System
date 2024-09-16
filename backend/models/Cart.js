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
      displayed_price: { type: Number, default: null },
      discount: { type: Boolean, default: false },
    },
  ],
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
