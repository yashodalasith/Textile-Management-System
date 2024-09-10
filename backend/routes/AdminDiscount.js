const express = require("express");
const router = express.Router();
const Order = require("../models/Order1"); // Replace with your actual Order model path
const Products = require("../models/Products"); // Replace with your actual Products model path

router.get("/dashboard", async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(todayStart.getDate() + 1);

    // Sales for today
    const salesToday = await Order.find({
      createdAt: { $gte: todayStart, $lt: tomorrowStart },
    });

    // Sales per hour
    let hourlySales = new Array(24).fill(0);
    salesToday.forEach((sale) => {
      const saleHour = new Date(sale.createdAt).getHours();
      hourlySales[saleHour]++;
    });

    // Discounted items (previous day applied today)
    const discountedItems = await Products.find({ discountApplied: true });

    // Hours when discounts were applied (previous day)
    const discountedHours = discountedItems
      .map((item) => item.discountedHours)
      .flat();

    // Most/Least sold items and hours for the current day to apply next day
    const itemSales = {};
    salesToday.forEach((sale) => {
      const itemId = sale.itemId; // Adjust based on your schema
      if (!itemSales[itemId]) itemSales[itemId] = { soldCount: 0 };
      itemSales[itemId].soldCount++;
    });

    const sortedItems = Object.entries(itemSales).sort(
      (a, b) => b[1].soldCount - a[1].soldCount
    );
    const mostSoldItem = sortedItems[0] ? sortedItems[0][0] : null;
    const leastSoldItem = sortedItems[sortedItems.length - 1]
      ? sortedItems[sortedItems.length - 1][0]
      : null;

    // Most/Least sales hours
    const salesPerHour = hourlySales.map((count, hour) => ({ hour, count }));
    salesPerHour.sort((a, b) => b.count - a.count);
    const mostSalesHour = salesPerHour[0] ? salesPerHour[0].hour : null;
    const leastSalesHour = salesPerHour[salesPerHour.length - 1]
      ? salesPerHour[salesPerHour.length - 1].hour
      : null;

    // Send all item sales data
    const itemSalesData = Object.entries(itemSales).map(([itemId, data]) => ({
      item_id: itemId,
      soldCount: data.soldCount,
    }));

    res.status(200).json({
      hourlySales,
      discountedItems,
      discountedHours,
      mostSoldItem,
      leastSoldItem,
      mostSalesHour,
      leastSalesHour,
      itemSales: itemSalesData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
