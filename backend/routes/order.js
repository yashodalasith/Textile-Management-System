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

//
router.get("/order-details/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if user exists (mock data example)
    if (mockUser.userId !== userId) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the latest order based on `createdAt` for the user
    const latestOrder = await Order.findOne({ userId }).sort({ createdAt: -1 });

    if (!latestOrder) {
      console.log("Order not found");
      return res.status(404).json({ message: "No orders found for the user" });
    }

    res.status(200).json(latestOrder);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
});

module.exports = router;
