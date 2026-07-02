const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  orderId: { type: DataTypes.UUID, allowNull: false, references: { model: 'orders', key: 'id' } },
  stripePaymentIntentId: { type: DataTypes.STRING(255), unique: true },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  currency: { type: DataTypes.STRING(3), defaultValue: 'EUR' },
  status: { type: DataTypes.ENUM('pending', 'processing', 'succeeded', 'failed', 'refunded'), defaultValue: 'pending' },
  paymentMethod: DataTypes.STRING(50),
  receiptUrl: DataTypes.TEXT,
}, { tableName: 'payments', underscored: true });

module.exports = Payment;
