const { DataTypes } = require('sequelize');
const slugify = require('slugify');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  sellerId: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
  categoryId: { type: DataTypes.UUID, references: { model: 'categories', key: 'id' } },
  name: { type: DataTypes.STRING(255), allowNull: false },
  slug: { type: DataTypes.STRING(255), unique: true, allowNull: false },
  description: DataTypes.TEXT,
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
  comparePrice: { type: DataTypes.DECIMAL(10, 2), validate: { min: 0 } },
  stockQuantity: { type: DataTypes.INTEGER, defaultValue: 0, validate: { min: 0 } },
  images: { type: DataTypes.JSONB, defaultValue: [] },
  status: { type: DataTypes.ENUM('draft', 'active', 'archived'), defaultValue: 'draft' },
  ratingAvg: { type: DataTypes.DECIMAL(2, 1), defaultValue: 0 },
  ratingCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  salesCount: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'products',
  underscored: true,
  hooks: {
    beforeValidate: (product) => { if (product.name && !product.slug) product.slug = slugify(product.name, { lower: true, strict: true }) + '-' + Date.now().toString(36); },
  },
  indexes: [{ fields: ['categoryId'] }, { fields: ['sellerId'] }, { fields: ['status'] }, { fields: ['price'] }, { fields: ['slug'] }],
});

module.exports = Product;
