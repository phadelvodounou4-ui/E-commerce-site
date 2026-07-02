const { CartItem, Product } = require('../models');

exports.getCart = async (req, res, next) => {
  const cartItems = await CartItem.findAll({ where: { userId: req.user.id }, include: [{ model: Product, as: 'product', where: { status: 'active' }, required: false }] });
  const total = cartItems.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);
  res.status(200).json({ status: 'success', data: { items: cartItems, itemCount: cartItems.length, total: parseFloat(total.toFixed(2)) } });
};

exports.addToCart = async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findByPk(productId);
  if (!product || product.status !== 'active') return res.status(404).json({ status: 'fail', message: 'Product not found' });
  if (product.stockQuantity < quantity) return res.status(400).json({ status: 'fail', message: `Only ${product.stockQuantity} available` });
  const [cartItem, created] = await CartItem.findOrCreate({ where: { userId: req.user.id, productId }, defaults: { quantity } });
  if (!created) {
    const newQty = cartItem.quantity + quantity;
    if (product.stockQuantity < newQty) return res.status(400).json({ status: 'fail', message: `Cannot add more. Stock limit: ${product.stockQuantity}` });
    cartItem.quantity = newQty; await cartItem.save();
  }
  const full = await CartItem.findOne({ where: { id: cartItem.id }, include: [{ model: Product, as: 'product' }] });
  res.status(200).json({ status: 'success', message: created ? 'Added' : 'Updated', data: { item: full } });
};

exports.updateQuantity = async (req, res, next) => {
  const cartItem = await CartItem.findOne({ where: { id: req.params.id, userId: req.user.id }, include: [{ model: Product, as: 'product' }] });
  if (!cartItem) return res.status(404).json({ status: 'fail', message: 'Not found' });
  const { quantity } = req.body;
  if (quantity <= 0) { await cartItem.destroy(); return res.status(200).json({ status: 'success', message: 'Removed' }); }
  if (cartItem.product.stockQuantity < quantity) return res.status(400).json({ status: 'fail', message: `Only ${cartItem.product.stockQuantity} available` });
  cartItem.quantity = quantity; await cartItem.save();
  res.status(200).json({ status: 'success', data: { item: cartItem } });
};

exports.removeFromCart = async (req, res, next) => {
  await CartItem.destroy({ where: { id: req.params.id, userId: req.user.id } });
  res.status(200).json({ status: 'success', message: 'Removed' });
};

exports.clearCart = async (req, res, next) => {
  await CartItem.destroy({ where: { userId: req.user.id } });
  res.status(200).json({ status: 'success', message: 'Cleared' });
};
