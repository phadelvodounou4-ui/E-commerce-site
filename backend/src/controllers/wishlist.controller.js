const { WishlistItem, Product } = require('../models');
exports.getWishlist = async (req, res) => {
  const items = await WishlistItem.findAll({ where: { userId: req.user.id }, include: [{ model: Product, as: 'product', where: { status: 'active' }, required: false }] });
  res.status(200).json({ status: 'success', data: { items } });
};
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const [item, created] = await WishlistItem.findOrCreate({ where: { userId: req.user.id, productId } });
  res.status(created ? 201 : 200).json({ status: 'success', message: created ? 'Added' : 'Already in wishlist', data: { item } });
};
exports.removeFromWishlist = async (req, res) => {
  await WishlistItem.destroy({ where: { id: req.params.id, userId: req.user.id } });
  res.status(200).json({ status: 'success', message: 'Removed' });
};
exports.toggleWishlist = async (req, res) => {
  const { productId } = req.body;
  const existing = await WishlistItem.findOne({ where: { userId: req.user.id, productId } });
  if (existing) { await existing.destroy(); return res.status(200).json({ status: 'success', message: 'Removed', inWishlist: false }); }
  const item = await WishlistItem.create({ userId: req.user.id, productId });
  res.status(201).json({ status: 'success', message: 'Added', inWishlist: true, data: { item } });
};
