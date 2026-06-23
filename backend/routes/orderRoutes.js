import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    // Create the order
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalPrice,
      paymentMethod: 'Cash on Delivery',
    });

    const createdOrder = await order.save();

    // Deduct stock for each item ordered
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = Math.max(0, product.stock - item.qty);
        await product.save();
      }
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get admin dashboard stats
// @route   GET /api/orders/dashboard/stats
// @access  Private/Admin
router.get('/dashboard/stats', protect, admin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    // Calculate total revenue
    const orders = await Order.find({});
    const totalSales = orders.reduce((sum, order) => {
      // only count if not cancelled
      return order.orderStatus !== 'Cancelled' ? sum + order.totalPrice : sum;
    }, 0);

    // Group order statuses
    const statusCounts = {
      Pending: 0,
      Processing: 0,
      'Out for Delivery': 0,
      Delivered: 0,
      Cancelled: 0,
    };
    orders.forEach(order => {
      if (statusCounts[order.orderStatus] !== undefined) {
        statusCounts[order.orderStatus]++;
      }
    });

    // Get recent 5 orders
    const recentOrders = await Order.find({})
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalSales,
      statusCounts,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      // Check if user is order owner or admin
      if (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin) {
        res.json(order);
      } else {
        res.status(403).json({ message: 'Not authorized to view this order' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order status / paid status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  const { status, isPaid } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = status || order.orderStatus;
      
      if (isPaid !== undefined) {
        order.isPaid = isPaid;
        if (isPaid) {
          order.paidAt = Date.now();
        }
      }

      if (status === 'Delivered') {
        order.isPaid = true;
        order.paidAt = order.paidAt || Date.now();
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
