const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Message = sequelize.define('Message', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  senderId: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
  receiverId: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
  productId: { type: DataTypes.UUID, references: { model: 'products', key: 'id' } },
  content: { type: DataTypes.TEXT, allowNull: false },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  readAt: DataTypes.DATE,
}, { tableName: 'messages', underscored: true });
module.exports = Message;
