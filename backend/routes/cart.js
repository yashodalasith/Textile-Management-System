const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// dummy data for testing
const mockInventory = [
  { productId: "Item1", productName: "T-Shirt", price: 1000, stock: 50 },
  { productId: "Item2", productName: "Jeans", price: 2000, stock: 30 },
  { productId: "Item3", productName: "Pants", price: 1500, stock: 30 },
  { productId: "Item4", productName: "Trunks", price: 4800, stock: 30 },
  { productId: "Item5", productName: "Shorts", price: 3000, stock: 30 },
];

// Add item to cart
router.post("/add", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  // Remove
  const product = mockInventory.find((item) => item.productId === productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const { productName, price } = product; // remove this prt

  try {
    let cart = await Cart.findOne({ userId });

    // Convert quantity to a number
    const parsedQuantity = parseInt(quantity, 10);

    //  cart doesn't exist create one
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, productName, quantity: parsedQuantity, price }],
      });
    } else {
      // If cart exists, update it
      const itemIndex = cart.items.findIndex(
        (item) => item.productId === productId
      );

      if (itemIndex > -1) {
        // Item exists update quantity
        cart.items[itemIndex].quantity += parsedQuantity;
      } else {
        // Item does not exist  add it
        cart.items.push({
          productId,
          productName,
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

// Remove item  cart
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

    // Clear  the cart
    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

module.exports = router;
