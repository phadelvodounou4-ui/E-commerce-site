const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const WishlistItem = sequelize.define('WishlistItem', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
  productId: { type: DataTypes.UUID, allowNull: false, references: { model: 'products', key: 'id' } },
}, { tableName: 'wishlist_items', underscored: true });
module.exports = WishlistItem;
