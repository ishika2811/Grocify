import express from 'express';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Fetch all products with optional filters
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { name, price, description, imageUrl, category, stock } = req.body;

  try {
    const product = new Product({
      name,
      price,
      description,
      imageUrl,
      category,
      stock,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  const { name, price, description, imageUrl, category, stock } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? price : product.price;
      product.description = description || product.description;
      product.imageUrl = imageUrl || product.imageUrl;
      product.category = category || product.category;
      product.stock = stock !== undefined ? stock : product.stock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
