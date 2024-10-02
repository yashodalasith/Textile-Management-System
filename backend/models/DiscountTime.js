const mongoose = require("mongoose");

const discountScheduleSchema = new mongoose.Schema({
  appliedAt: { type: Date, required: true },
});

module.exports = mongoose.model("DiscountSchedule", discountScheduleSchema);
