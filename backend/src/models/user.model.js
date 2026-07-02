const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true, validate: { isEmail: true } },
  passwordHash: { type: DataTypes.STRING(255), allowNull: true },
  firstName: DataTypes.STRING(100),
  lastName: DataTypes.STRING(100),
  avatarUrl: DataTypes.TEXT,
  role: { type: DataTypes.ENUM('customer', 'seller', 'admin'), defaultValue: 'customer' },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  googleId: { type: DataTypes.STRING(255), unique: true, allowNull: true },
  stripeCustomerId: { type: DataTypes.STRING(255), allowNull: true },
  lastLoginAt: DataTypes.DATE,
}, {
  tableName: 'users',
  underscored: true,
  hooks: {
    beforeCreate: async (user) => { if (user.passwordHash) user.passwordHash = await bcrypt.hash(user.passwordHash, 12); },
    beforeUpdate: async (user) => { if (user.changed('passwordHash') && user.passwordHash) user.passwordHash = await bcrypt.hash(user.passwordHash, 12); },
  },
});

User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};
User.prototype.getFullName = function () {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim() || this.email;
};
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.passwordHash;
  delete values.googleId;
  return values;
};

module.exports = User;
