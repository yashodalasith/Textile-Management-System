// models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
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
  totalPrice: { type: Number, required: true },
  paymentStatus: { type: String, default: "Pending - Cash on Delivery" },
  orderStatus: { type: String, default: "Confirmed" },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
