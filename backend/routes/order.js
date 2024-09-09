// routes/order.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order1");
const Cart = require("../models/Cart");
const mongoose = require("mongoose");

// Mock user data
const mockUser = {
  userId: "mockUser123",
  name: "John Doe",
};

// Confirm and place an order
router.post("/confirm-order", async (req, res) => {
  const { userId } = req.body;

  try {
    // Use mock user ID for now
    const user = mockUser; // Replace this with the actual user service later
    if (user.userId !== userId)
      return res.status(404).json({ message: "User not found" });

    // Fetch the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Calculate total price by ensuring price and quantity are numbers
    const totalPrice = cart.items.reduce(
      (acc, item) => acc + parseFloat(item.price) * parseInt(item.quantity, 10),
      0
    );

    // Create the order
    const order = new Order({
      userId,
      items: cart.items,
      totalPrice,
      paymentStatus: "Pending - Cash on Delivery",
      orderStatus: "Confirmed",
    });

    await order.save();

    // Clear the user's cart
    await Cart.deleteOne({ userId });

    res.status(200).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ error: "Failed to place order" });
  }
});

router.get("/order-details/:userId/:orderId", async (req, res) => {
  const { userId, orderId } = req.params;

  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid orderId format" });
    }

    // Check if user exists (mock data example)
    if (mockUser.userId !== userId) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the order
    const order = await Order.findOne({ userId, _id: orderId });
    if (!order) {
      console.log("Order not found");
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
});

module.exports = router;
