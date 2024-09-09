const express = require("express");
const router = express.Router();
const Products = require("../models/Product");
const Order = require("../models/Order1");

// Helper function to calculate displayed price
const calculateDisplayedPrice = (price, discountPercentage) => {
  return price - (price * discountPercentage) / 100;
};

// Reset and Apply Discounts Every 24 Hours
router.post("/reset-discount", async (req, res) => {
  try {
    const last24Hours = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

    // Fetch sales from the last 24 hours
    const sales = await Order.find({ createdAt: { $gte: last24Hours } });
    let salesData = {};

    sales.forEach((sale) => {
      const itemId = sale.productId;
      const soldCount = sale.sold_count;

      if (!salesData[itemId]) {
        salesData[itemId] = {
          soldCount: 0,
          Discounted: sale.Discounted,
        };
      }
      salesData[itemId].soldCount += soldCount;
    });

    // Step 2: Sort items by sales count
    let sortedItems = Object.entries(salesData).sort(
      (a, b) => b[1].soldCount - a[1].soldCount
    );
    const mostSoldItems = sortedItems.slice(0, 2); // 2 most sold items
    const leastSoldItems = sortedItems.slice(-3); // 3 least sold items

    // Step 3: Update inventory for the most and least sold items
    const allItems = [...mostSoldItems, ...leastSoldItems];
    for (const [itemId, data] of allItems) {
      const item = await Products.findOne({ item_id: itemId });

      // Apply discounts only to items not already discounted
      if (!data.discount) {
        const discountPercentage = data.soldCount > 0 ? 5 : 10; // 5% for most, 10% for least
        const displayedPrice = calculateDisplayedPrice(
          item.price,
          discountPercentage
        );

        await Inventory.updateOne(
          { item_id: itemId },
          {
            discount: true,
            discount_percentage: discountPercentage,
            price: displayedPrice,
          }
        );
      }
    }

    res.status(200).json({
      message: "Discounts applied successfully for the last 24 hours",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply Discount (24-hour reset and "Give Discount Now")
router.post("/apply-discount", async (req, res) => {
  const { type } = req.body; // 'most' or 'least'

  try {
    const last24Hours = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    const sales = await Order.find({ createdAt: { $gte: last24Hours } });

    let salesData = {};
    sales.forEach((sale) => {
      const itemId = sale.productId;
      const soldCount = sale.sold_count;

      if (!salesData[itemId]) {
        salesData[itemId] = { soldCount: 0, Discounted: sale.Discounted };
      }
      salesData[itemId].soldCount += soldCount;
    });

    // Sort by sales count
    let sortedItems = Object.entries(salesData).sort(
      (a, b) => b[1].soldCount - a[1].soldCount
    );
    const items =
      type === "most" ? sortedItems.slice(0, 2) : sortedItems.slice(-3);

    // Apply discount
    for (const [itemId, data] of items) {
      const item = await Products.findOne({ productId: itemId });
      if (!data.discount) {
        const discountPercentage = data.soldCount > 0 ? 5 : 10; // 5% for most, 10% for least
        const displayedPrice = calculateDisplayedPrice(
          item.price,
          discountPercentage
        );

        await Products.updateOne(
          { productId: itemId },
          {
            discount: true,
            discount_percentage: discountPercentage,
            price: displayedPrice,
          }
        );
      }
    }

    res.status(200).json({ message: "Discount applied successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
