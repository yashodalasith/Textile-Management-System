// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // This loads environment variables
const discountRoutes = require("./routes/DiscountRoutes");
const adminDiscountRoutes = require("./routes/AdminDiscount");

const app = express();
app.use(cors());
app.use(express.json());

const productRoutes = require("./routes/productRoutes.js");
app.use("/Products", productRoutes);

const PORT = process.env.PORT || 3001;
const URL = process.env.MONGODB_URL;

// Import Routes
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

const loginRoutes = require("./routes/UserLoginRoute.js");
const userRouter = require("./routes/UserManagmentRoute.js");
const userProfile = require("./routes/UserProfileRoutes.js");

// Use Routes
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);

// Example route
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// Configure CORS options to recieve requests from frontend
const corsOptions = {
  origin: "http://localhost:5173/",
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200,
};

// Discount routes
app.use("/api/discount", discountRoutes);
app.use("/api/admindis", adminDiscountRoutes);

//user route
app.use("/login", loginRoutes);
app.use("/user", userRouter);
app.use("/userProfile", userProfile);

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
