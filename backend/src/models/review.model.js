const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  productId: { type: DataTypes.UUID, allowNull: false, references: { model: 'products', key: 'id' } },
  userId: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
  orderId: { type: DataTypes.UUID, references: { model: 'orders', key: 'id' } },
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  title: DataTypes.STRING(255),
  comment: DataTypes.TEXT,
  isVerifiedPurchase: { type: DataTypes.BOOLEAN, defaultValue: false },
  helpfulCount: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'reviews', underscored: true });

module.exports = Review;
