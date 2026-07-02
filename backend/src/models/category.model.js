const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  slug: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  description: DataTypes.TEXT,
  parentId: { type: DataTypes.UUID, references: { model: 'categories', key: 'id' } },
  imageUrl: DataTypes.TEXT,
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'categories', underscored: true });

module.exports = Category;
