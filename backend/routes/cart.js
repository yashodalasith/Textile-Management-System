// routes/cart.js
const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// dummy data for testing
// const mockInventory = [
//   { productId: "Item1", productName: "T-Shirt", price: 1000, stock: 50 },
//   { productId: "Item2", productName: "Jeans", price: 2000, stock: 30 },
//   { productId: "Item3", productName: "Pants", price: 1500, stock: 30 },
//   { productId: "Item4", productName: "Trunks", price: 4800, stock: 30 },
//   { productId: "Item5", productName: "Shorts", price: 3000, stock: 30 },
// ];

/// Add item to cart
router.post("/add", async (req, res) => {
  const {
    userId,
    productId,
    productName,
    quantity,
    price,
    displayed_price,
    discount,
  } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    // Convert quantity to a number
    const parsedQuantity = parseInt(quantity, 10);

    // If cart doesn't exist, create one
    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            productName,
            quantity: parsedQuantity,
            price,
            displayed_price: displayed_price || price, // Use displayed_price if available
            discount: discount || false,
          },
        ],
      });
    } else {
      // If cart exists, update it
      const itemIndex = cart.items.findIndex(
        (item) => item.productId === productId
      );

      if (itemIndex > -1) {
        // Item exists; update quantity
        cart.items[itemIndex].quantity += parsedQuantity;
      } else {
        // Item does not exist; add it
        cart.items.push({
          productId,
          productName,
          quantity: parsedQuantity,
          price,
          displayed_price: displayed_price || price, // Use displayed_price if available
          discount: discount || false,
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

//update cart
router.put("/update-quantities", async (req, res) => {
  const { userId, updatedCart } = req.body;

  try {
    // Logic to update the cart quantities in the database
    const updatedCartData = await Cart.updateMany(
      { userId },
      { $set: { items: updatedCart } }
    );
    res.status(200).json({
      message: "Cart updated successfully",
      updatedCart: updatedCartData,
    });
  } catch (error) {
    console.error("Error updating cart quantities:", error);
    res.status(500).json({ message: "Failed to update cart" });
  }
});

// Remove entire item from cart
router.delete("/remove-item", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Filter out the item with the matching productId
    const updatedItems = cart.items.filter(
      (item) => item.productId !== productId
    );

    // If no changes were made, the item wasn't found in the cart
    if (updatedItems.length === cart.items.length) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items = updatedItems;
    await cart.save();

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
});

module.exports = router;
