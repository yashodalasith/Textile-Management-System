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
// Add item to cart
router.post("/add", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  // Check mock inventory for product
  const product = mockInventory.find((item) => item.productId === productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const { name, price } = product; // Extract name and price from product

  try {
    let cart = await Cart.findOne({ userId });

    // Convert quantity to a number to prevent string concatenation
    const parsedQuantity = parseInt(quantity, 10);

    // If the cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, name, quantity: parsedQuantity, price }],
      });
    } else {
      // If cart exists, update it
      const itemIndex = cart.items.findIndex(
        (item) => item.productId === productId
      );

      if (itemIndex > -1) {
        // Item exists in the cart, update quantity
        cart.items[itemIndex].quantity += parsedQuantity;
      } else {
        // Item does not exist in the cart, add it
        cart.items.push({
          productId,
          name, // Use extracted name here
          quantity: parsedQuantity,
          price,
        });
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
    if (!cart) return res.status(404).json({ message: "bruh Cart not found" });

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

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex > -1) {
      // If item quantity is more than 1, decrease the quantity by 1
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        // If item quantity is 1, remove the item from the cart
        cart.items = cart.items.filter((item) => item.productId !== productId);
      }

      await cart.save();
      res.status(200).json({ message: "Item quantity updated/removed", cart });
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update item quantity" });
  }
});

// Clear cart
router.delete("/clear", async (req, res) => {
  const { userId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Clear all items in the cart
    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

module.exports = router;
