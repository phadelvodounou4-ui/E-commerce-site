const { sequelize } = require('../config/database');
const { Order, OrderItem, CartItem, Product, Payment } = require('../models');
const logger = require('../utils/logger');

exports.createOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { shippingAddress, notes } = req.body;
    const cartItems = await CartItem.findAll({ where: { userId: req.user.id }, include: [{ model: Product, as: 'product' }], transaction });
    if (cartItems.length === 0) { await transaction.rollback(); return res.status(400).json({ status: 'fail', message: 'Cart empty' }); }
    let subtotal = 0; const orderItems = [];
    for (const item of cartItems) {
      if (item.product.stockQuantity < item.quantity) { await transaction.rollback(); return res.status(400).json({ status: 'fail', message: `Insufficient stock for ${item.product.name}` }); }
      const itemTotal = parseFloat(item.product.price) * item.quantity;
      subtotal += itemTotal;
      orderItems.push({ productId: item.product.id, productName: item.product.name, productImage: item.product.images?.[0] || null, unitPrice: item.product.price, quantity: item.quantity, totalPrice: itemTotal.toFixed(2) });
      await item.product.decrement('stockQuantity', { by: item.quantity, transaction });
      await item.product.increment('salesCount', { by: item.quantity, transaction });
    }
    const shippingAmount = subtotal > 50 ? 0 : 5.99;
    const taxAmount = subtotal * 0.20;
    const totalAmount = subtotal + shippingAmount + taxAmount;
    const order = await Order.create({ userId: req.user.id, status: 'pending', totalAmount: totalAmount.toFixed(2), shippingAmount: shippingAmount.toFixed(2), taxAmount: taxAmount.toFixed(2), currency: 'EUR', shippingAddress, notes }, { transaction });
    await OrderItem.bulkCreate(orderItems.map(item => ({ ...item, orderId: order.id })), { transaction });
    await CartItem.destroy({ where: { userId: req.user.id }, transaction });
    await transaction.commit();
    const fullOrder = await Order.findByPk(order.id, { include: ['items'] });
    res.status(201).json({ status: 'success', data: { order: fullOrder } });
  } catch (error) { await transaction.rollback(); next(error); }
};

exports.getMyOrders = async (req, res, next) => {
  const orders = await Order.findAll({ where: { userId: req.user.id }, include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }], order: [['createdAt', 'DESC']] });
  res.status(200).json({ status: 'success', data: { orders } });
};

exports.getOrder = async (req, res, next) => {
  const order = await Order.findOne({ where: { id: req.params.id, userId: req.user.id }, include: ['items', { model: Payment, as: 'payment' }] });
  if (!order) return res.status(404).json({ status: 'fail', message: 'Not found' });
  res.status(200).json({ status: 'success', data: { order } });
};
