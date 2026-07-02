const router = require('express').Router();
const { User, Order, Product } = require('../models');
const { Op } = require('sequelize');
const { protect, restrictTo } = require('../middleware/auth.middleware');
router.use(protect, restrictTo('admin'));
router.get('/dashboard', async (req, res) => {
  const [totalUsers, totalOrders, totalRevenue, totalProducts, recentOrders] = await Promise.all([
    User.count(), Order.count(), Order.sum('totalAmount', { where: { status: 'paid' } }), Product.count(),
    Order.findAll({ where: { createdAt: { [Op.gte]: new Date(Date.now() - 30*24*60*60*1000) } }, order: [['createdAt', 'DESC']], limit: 10, include: [{ model: User, as: 'user', attributes: ['email', 'firstName'] }] }),
  ]);
  res.status(200).json({ status: 'success', data: { stats: { totalUsers, totalOrders, totalRevenue: totalRevenue || 0, totalProducts }, recentOrders } });
});
router.get('/users', async (req, res) => {
  const users = await User.findAll({ order: [['createdAt', 'DESC']], limit: 100 });
  res.status(200).json({ status: 'success', data: { users } });
});
router.patch('/users/:id/role', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ status: 'fail', message: 'Not found' });
  await user.update({ role: req.body.role });
  res.status(200).json({ status: 'success', data: { user } });
});
module.exports = router;
