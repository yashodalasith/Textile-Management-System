const express = require("express");
const cron = require("node-cron");
const router = express.Router();
const Product = require("../models/Products");
const Order = require("../models/Order1");

// Reset and apply discounts every 24 hours at the most and least sales hours
router.post("/reset-discount", async (req, res) => {
  try {
    // Schedule the task to run every 24 hours
    cron.schedule("0 0 * * *", async () => {
      console.log("Running daily discount reset...");
      // Apply discount based on the previous day's data
      await applyDiscount();
    });

    res.status(200).json({ message: "Daily discount reset scheduled." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manually apply discount for the current hour for one hour
router.post("/apply-discount", async (req, res) => {
  try {
    const currentHour = new Date().getHours();

    console.log(`Applying discount for current hour (${currentHour}:00)`);

    // Apply discount
    await applyDiscount();

    // Schedule to remove the discount in the next hour
    cron.schedule(`0 ${currentHour + 1} * * *`, async () => {
      console.log(`Removing discount for hour ${currentHour + 1}:00`);
      await removeDiscount();
    });

    res.status(200).json({
      message: `Discount applied for the current hour (${currentHour}:00)`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to apply discounts
async function applyDiscount() {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfDay = new Date(yesterday.setHours(0, 0, 0, 0));
    const endOfDay = new Date(yesterday.setHours(23, 59, 59, 999));

    // Fetch sales from yesterday
    const salesYesterday = await Order.find({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    let salesData = {};
    salesYesterday.forEach((sale) => {
      sale.items.forEach((item) => {
        const itemId = item.productId;
        const soldCount = item.quantity;
        const isDiscounted = item.Discounted;

        if (!salesData[itemId]) {
          salesData[itemId] = { soldCount: 0 };
          salesData[itemId] = { Discounted: isDiscounted };
        }
        salesData[itemId].soldCount += soldCount;
      });
    });

    let sortedItems = Object.entries(salesData).sort(
      (a, b) => b[1].soldCount - a[1].soldCount
    );

    const mostSoldItems = sortedItems.slice(0, 2); // 2 most sold items
    const leastSoldItems = sortedItems.slice(-3); // 3 least sold items

    // Apply discount to most and least sold items
    const allItems = [...mostSoldItems, ...leastSoldItems];
    for (const [itemId, data] of allItems) {
      const item = await Product.findOne({ productId: itemId });
      if (!item.discount) {
        const discountPercentage = data.soldCount > 0 ? 5 : 10; // 5% for most, 10% for least
        const displayedPrice = item.price * (1 - discountPercentage / 100);

        await Product.updateOne(
          { productId: itemId },
          {
            discount: true,
            discount_percentage: discountPercentage,
            displayed_price: displayedPrice,
          }
        );
      }
    }

    console.log("Discount applied to eligible products.");
  } catch (error) {
    console.error("Error applying discount:", error.message);
  }
}

// Function to remove discounts
async function removeDiscount() {
  try {
    const discountedProducts = await Product.find({ discount: true });

    for (const product of discountedProducts) {
      product.discount = false;
      product.displayed_price = product.price;
      await product.save();
    }

    console.log("Discounts removed from products.");
  } catch (error) {
    console.error("Error removing discounts:", error.message);
  }
}

module.exports = router;
