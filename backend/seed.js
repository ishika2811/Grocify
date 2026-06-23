import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const products = [
  {
    name: 'Organic Bananas',
    description: 'Fresh organic sweet bananas, rich in potassium and energy. Perfect for smoothies or healthy snacks.',
    price: 1.99,
    category: 'Fruits & Vegetables',
    stock: 120,
    imageUrl: '/assets/products/bananas.png',
  },
  {
    name: 'Fresh Red Apples',
    description: 'Crisp, sweet, and juicy red apples sourced from local orchards. Rich in fiber and antioxidants.',
    price: 2.49,
    category: 'Fruits & Vegetables',
    stock: 80,
    imageUrl: '/assets/products/apples.png',
  },
  {
    name: 'Organic Carrots',
    description: 'Sweet, crunchy, and freshly harvested organic carrots. Great for salads, cooking, or juicing.',
    price: 1.49,
    category: 'Fruits & Vegetables',
    stock: 65,
    imageUrl: '/assets/products/carrots.png',
  },
  {
    name: 'Cherry Tomatoes',
    description: 'Plump, sweet, and ripe red cherry tomatoes. Ideal for salads, pastas, or roasting.',
    price: 2.99,
    category: 'Fruits & Vegetables',
    stock: 50,
    imageUrl: '/assets/products/tomatoes.png',
  },
  {
    name: 'Fresh Whole Milk',
    description: '1 Gallon of pasteurized farm-fresh whole milk. A rich source of calcium and Vitamin D.',
    price: 3.49,
    category: 'Dairy & Eggs',
    stock: 40,
    imageUrl: '/assets/products/milk.png',
  },
  {
    name: 'Farm Fresh Eggs',
    description: 'One dozen grade A brown eggs from free-range chickens. Packed with high-quality protein.',
    price: 2.99,
    category: 'Dairy & Eggs',
    stock: 90,
    imageUrl: '/assets/products/eggs.png',
  },
  {
    name: 'Organic Salted Butter',
    description: 'Rich and creamy salted butter made from organic sweet cream. Ideal for baking and cooking.',
    price: 3.99,
    category: 'Dairy & Eggs',
    stock: 35,
    imageUrl: '/assets/products/butter.png',
  },
  {
    name: 'Whole Wheat Bread',
    description: 'Freshly baked sliced whole wheat bread loaf. Healthy, high-fiber, and delicious.',
    price: 2.49,
    category: 'Bakery',
    stock: 30,
    imageUrl: '/assets/products/bread.png',
  },
  {
    name: 'Chocolate Chip Cookies',
    description: 'Freshly baked soft-baked cookies packed with rich dark chocolate chips. A perfect sweet treat.',
    price: 3.99,
    category: 'Bakery',
    stock: 25,
    imageUrl: '/assets/products/cookies.png',
  },
  {
    name: '100% Orange Juice',
    description: 'Freshly squeezed orange juice with pulp. High in Vitamin C, no added sugars or preservatives.',
    price: 4.29,
    category: 'Beverages',
    stock: 45,
    imageUrl: '/assets/products/orange_juice.png',
  },
  {
    name: 'Organic Green Tea',
    description: 'Box of 20 premium green tea bags. Smooth flavor, loaded with natural antioxidants.',
    price: 3.49,
    category: 'Beverages',
    stock: 60,
    imageUrl: '/assets/products/green_tea.png',
  },
];

const seedData = async () => {
  try {
    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Database cleared!');

    // Create Admin
    await User.create({
      name: 'Admin User',
      email: 'admin@grocify.com',
      password: 'admin123',
      isAdmin: true,
    });

    // Create Standard User
    await User.create({
      name: 'John Doe',
      email: 'user@grocify.com',
      password: 'user123',
      isAdmin: false,
    });

    console.log('Users seeded!');

    // Create Products
    await Product.insertMany(products);

    console.log('Products seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
