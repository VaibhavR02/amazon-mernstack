import express from 'express';
import Product from '../models/productmodel.js';
import data from '../data.js';
import User from '../models/userModel.js';
import Order from '../models/OrderModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await Product.remove({});
  const createdProducts = await Product.insertMany(data.products);
  await User.remove({});
  const createdUsers = await User.insertMany(data.users);
  await Order.remove({});
  const createdOrders = await Order.insertMany(data.orders);
  res.send({ createdUsers, createdProducts, createdOrders });
});

export default seedRouter;
