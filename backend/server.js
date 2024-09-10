<<<<<<< HEAD
// server.js
=======
>>>>>>> sayun_payment
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // This loads environment variables
<<<<<<< HEAD
const discountRoutes = require("./routes/DiscountRoutes");
const adminDiscountRoutes = require("./routes/AdminDiscount");
=======
>>>>>>> sayun_payment

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const URL = process.env.MONGODB_URL;
<<<<<<< HEAD
=======

// Import Routes
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

// Use Routes
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
>>>>>>> sayun_payment

// Example route
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

<<<<<<< HEAD
// Discount routes
app.use("/api/discount", discountRoutes);
app.use("/api/admindis", adminDiscountRoutes);

=======
>>>>>>> sayun_payment
mongoose
  .connect(URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log(error.message));

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongodb Connection Success!");
});
