// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // This loads environment variables

const app = express();
app.use(cors());
app.use(express.json());

const productRoutes = require('./routes/productRoutes.js');
app.use('/Products', productRoutes);

const PORT = process.env.PORT || 3001;
const URL = process.env.MONGODB_URL;

// Example route
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});


mongoose
  .connect(URL)
  .then(() => {
    app.listen(PORT, () => console.log('Server running on port ${PORT}'));
  })
  .catch((error) => console.log(error.message));

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongodb Connection Success!");
});