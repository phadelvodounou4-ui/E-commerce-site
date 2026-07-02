const { Op } = require('sequelize');
const { Product, Category, User, Review } = require('../models');
const cacheService = require('../services/cache.service');
const logger = require('../utils/logger');

exports.getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, category, minPrice, maxPrice, sort = 'createdAt:desc', inStock } = req.query;
    const offset = (page - 1) * limit;
    const where = { status: 'active' };
    if (search) where[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }, { description: { [Op.iLike]: `%${search}%` } }];
    if (category) where.categoryId = category;
    if (minPrice) where.price = { [Op.gte]: minPrice };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: maxPrice };
    if (inStock === 'true') where.stockQuantity = { [Op.gt]: 0 };
    const [sortField, sortOrder] = sort.split(':');
    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName'] },
      ],
      order: [[sortField, sortOrder.toUpperCase()]],
      limit, offset,
    });
    res.status(200).json({ status: 'success', data: { products: rows, pagination: { page: parseInt(page), limit, total: count, pages: Math.ceil(count / limit) } } });
  } catch (error) { next(error); }
};

exports.getProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({
      where: { slug, status: 'active' },
      include: [
        { model: Category, as: 'category' },
        { model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] },
        { model: Review, as: 'reviews', include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'avatarUrl'] }], limit: 10 },
      ],
    });
    if (!product) return res.status(404).json({ status: 'fail', message: 'Product not found' });
    res.status(200).json({ status: 'success', data: { product } });
  } catch (error) { next(error); }
};

exports.createProduct = async (req, res, next) => {
  try {
    const productData = { ...req.body, sellerId: req.user.role === 'admin' ? req.body.sellerId : req.user.id };
    const product = await Product.create(productData);
    await cacheService.delPattern('products:*');
    res.status(201).json({ status: 'success', data: { product } });
  } catch (error) { next(error); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ status: 'fail', message: 'Not found' });
    if (req.user.role !== 'admin' && product.sellerId !== req.user.id) return res.status(403).json({ status: 'fail', message: 'Not authorized' });
    await product.update(req.body);
    await cacheService.delPattern('products:*');
    res.status(200).json({ status: 'success', data: { product } });
  } catch (error) { next(error); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ status: 'fail', message: 'Not found' });
    if (req.user.role !== 'admin' && product.sellerId !== req.user.id) return res.status(403).json({ status: 'fail', message: 'Not authorized' });
    product.status = 'archived'; await product.save();
    await cacheService.delPattern('products:*');
    res.status(200).json({ status: 'success', message: 'Archived' });
  } catch (error) { next(error); }
};
