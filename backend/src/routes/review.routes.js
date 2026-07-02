const router = require('express').Router();
const { body } = require('express-validator');
const { Review, Order, Product, User } = require('../models');
const { protect } = require('../middleware/auth.middleware');
router.get('/product/:productId', async (req, res) => {
  const reviews = await Review.findAll({ where: { productId: req.params.productId }, include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'avatarUrl'] }], order: [['createdAt', 'DESC']] });
  res.status(200).json({ status: 'success', data: { reviews } });
});
router.post('/', protect, [body('productId').isUUID(), body('rating').isInt({ min: 1, max: 5 }), body('comment').optional().trim()], async (req, res) => {
  const { productId, rating, comment, orderId } = req.body;
  const order = await Order.findOne({ where: { id: orderId, userId: req.user.id, status: 'delivered' } });
  const review = await Review.create({ productId, userId: req.user.id, orderId: orderId || null, rating, comment, isVerifiedPurchase: !!order });
  const product = await Product.findByPk(productId);
  const reviews = await Review.findAll({ where: { productId } });
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await product.update({ ratingAvg: parseFloat(avg.toFixed(1)), ratingCount: reviews.length });
  res.status(201).json({ status: 'success', data: { review } });
});
module.exports = router;
