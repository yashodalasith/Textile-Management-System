// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Products = require('../models/Products');

// CREATE operation - Add a new product
router.post('/product-add', async (req, res) => {
  try {
    const {
      productId,
      productName,
      description,
      price,
      quantity,
      color,
      size,
      discount,
      discount_percentage,
      image,
      displayed_price
    } = req.body;

    // Create a new product
    const newProduct = new Products({
      productId,
      productName,
      description,
      price,
      quantity,
      color,
      size,
      discount,
      discount_percentage,
      image,
      displayed_price
    });
    console.log(newProduct);
    // Save the new product
    await newProduct.save();

    res.json("Product Added");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding product' });
  }
});

// READ operation - Get a single product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the product' });
  }
});

// READ operation - Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Products.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching products' });
  }
});



// UPDATE operation - Update a product by ID
router.put('/products-update/:id', async (req, res) => {
  try {
    const { productName, description, price, quantity, color, size, discount, discount_percentage, image,displayed_price } = req.body;
    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.id,
      { productName, description, price, quantity, color, size, discount, discount_percentage, image,displayed_price },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated', product: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE operation - Delete a product by ID
router.delete('/products-delete/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Products.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while deleting the product' });
  }
});

module.exports = router;
