const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
  status: { type: DataTypes.ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'), defaultValue: 'pending' },
  totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
  shippingAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  taxAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  discountAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  currency: { type: DataTypes.STRING(3), defaultValue: 'EUR' },
  shippingAddress: { type: DataTypes.JSONB, allowNull: false },
  billingAddress: DataTypes.JSONB,
  trackingNumber: DataTypes.STRING(100),
  notes: DataTypes.TEXT,
  paidAt: DataTypes.DATE,
  shippedAt: DataTypes.DATE,
  deliveredAt: DataTypes.DATE,
}, { tableName: 'orders', underscored: true, indexes: [{ fields: ['userId'] }, { fields: ['status'] }] });

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  orderId: { type: DataTypes.UUID, allowNull: false, references: { model: 'orders', key: 'id' } },
  productId: { type: DataTypes.UUID, allowNull: false, references: { model: 'products', key: 'id' } },
  productName: { type: DataTypes.STRING(255), allowNull: false },
  productImage: DataTypes.TEXT,
  unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
  totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { tableName: 'order_items', underscored: true });

module.exports = { Order, OrderItem };
