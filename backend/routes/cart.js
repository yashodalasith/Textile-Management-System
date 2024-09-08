// routes/cart.js
const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// Mock inventory data for testing
const mockInventory = [
  { productId: "1", name: "T-Shirt", price: 10, stock: 50 },
  { productId: "2", name: "Jeans", price: 20, stock: 30 },
];

// Add item to cart
router.post("/add", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  // Check mock inventory for product
  const product = mockInventory.find((item) => item.productId === productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  try {
    let cart = await Cart.findOne({ userId });

    // If the cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity, price: product.price }],
      });
    } else {
      // If cart exists, update it
      const itemIndex = cart.items.findIndex(
        (item) => item.productId === productId
      );

      if (itemIndex > -1) {
        // Item exists in the cart, update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Item does not exist in the cart, add it
        cart.items.push({ productId, quantity, price: product.price });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// View cart
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve cart" });
  }
});

// Remove item from cart
router.delete("/remove", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.productId !== productId);
    await cart.save();

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
});

module.exports = router;
