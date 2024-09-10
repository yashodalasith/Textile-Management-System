// models/Product.js
const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true
  },
  productName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  discount: {
    type: Boolean,
    default: false
  },
  discount_percentage: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    required: true
  },
  displayed_price: { 
    type: Number,
     default: null }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
