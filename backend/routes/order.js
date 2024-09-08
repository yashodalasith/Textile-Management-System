// routes/order.js
const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Cart = require("../models/Cart");

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

    // Calculate total price
    const totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
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

module.exports = router;
