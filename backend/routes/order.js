const express = require("express");
const router = express.Router();
const Order = require("../models/Order1");
const Cart = require("../models/Cart");

// Confirm and place an order
router.post("/confirm-order", async (req, res) => {
  const { userId } = req.body;

  try {
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

// Fetch the latest order details for a user
router.get("/order-details/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
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

router.get("/orders/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch all orders for the user
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for the user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.get("/:userId/most-least-sold-item", async (req, res) => {
  const { userId } = req.params;

  try {
    // Get user orders, aggregate by productId, sum quantities, and calculate spending
    const orders = await Order.aggregate([
      { $match: { userId } }, // Match only orders for the specific user
      { $unwind: "$items" }, // Deconstruct the items array
      {
        $group: {
          _id: "$items.productId", // Group by productId
          productName: { $first: "$items.productName" },
          totalQuantity: { $sum: "$items.quantity" }, // Sum the quantity for each product
          totalAmountSpentOnItem: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          }, // Sum total price per item
          timesPurchased: { $sum: 1 }, // Count the number of times each item was purchased
        },
      },
      { $sort: { totalQuantity: 1 } }, // Sort by total quantity (ascending)
    ]);

    // If no orders found, return 404
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    // Find the most and least sold items
    const mostSold = orders[orders.length - 1]; // The last element is the most sold
    const leastSold = orders[0]; // The first element is the least sold

    // Calculate total items purchased and total amount spent
    const totalItemsPurchased = orders.reduce(
      (acc, order) => acc + order.totalQuantity,
      0
    );
    const totalAmountSpent = orders.reduce(
      (acc, order) => acc + order.totalAmountSpentOnItem,
      0
    );

    // Calculate total amount spent per month
    const dailySpending = await Order.aggregate([
      { $match: { userId } }, // Match only orders for the specific user
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group by day
          totalSpentInDay: { $sum: "$totalPrice" }, // Sum total price for each day
        },
      },
      { $sort: { _id: 1 } }, // Sort by day (ascending)
    ]);

    // Total number of orders placed
    const totalOrdersPlaced = await Order.countDocuments({ userId });

    // Average amount spent per order
    const averageAmountPerOrder = totalAmountSpent / totalOrdersPlaced;

    // Response with all the calculated data, including timesPurchased and totalAmountSpentOnItem for each product
    res.json({
      mostSold,
      leastSold,
      totalItemsPurchased,
      totalAmountSpent,
      totalOrdersPlaced,
      averageAmountPerOrder: averageAmountPerOrder.toFixed(2), // Format to 2 decimals
      dailySpending,
      itemsSummary: orders.map((order) => ({
        productId: order._id,
        productName: order.productName,
        totalQuantity: order.totalQuantity,
        totalAmountSpentOnItem: order.totalAmountSpentOnItem.toFixed(2), // Format to 2 decimals
        timesPurchased: order.timesPurchased,
      })),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching data", error: err.message });
  }
});

module.exports = router;
