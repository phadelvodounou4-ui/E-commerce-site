const router = require('express').Router();
const { Category } = require('../models');
const { protect, restrictTo } = require('../middleware/auth.middleware');
router.get('/', async (req, res) => {
  const categories = await Category.findAll({ where: { parentId: null }, include: [{ model: Category, as: 'subcategories' }] });
  res.status(200).json({ status: 'success', data: { categories } });
});
router.post('/', protect, restrictTo('admin'), async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ status: 'success', data: { category } });
});
module.exports = router;
