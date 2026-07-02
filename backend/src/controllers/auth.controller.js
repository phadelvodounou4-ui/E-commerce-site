const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { generateToken } = require('../middleware/auth.middleware');
const { redisClient } = require('../config/redis');
const emailService = require('../services/email.service');
const logger = require('../utils/logger');

exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ status: 'fail', message: 'Email already registered' });
    const user = await User.create({ email, passwordHash: password, firstName, lastName, role: role || 'customer' });
    const token = generateToken(user.id);
    await emailService.sendWelcomeEmail(user.email, user.getFullName());
    res.status(201).json({ status: 'success', message: 'Account created', data: { user, token } });
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email }, attributes: { include: ['passwordHash'] } });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
    user.lastLoginAt = new Date(); await user.save();
    const token = generateToken(user.id);
    await redisClient.setex(`session:${user.id}`, 86400, JSON.stringify({ id: user.id, role: user.role }));
    res.status(200).json({ status: 'success', message: 'Login successful', data: { user, token } });
  } catch (error) { next(error); }
};

exports.logout = async (req, res, next) => {
  try {
    const decoded = jwt.decode(req.token);
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) await redisClient.setex(`bl:${req.token}`, ttl, 'revoked');
    await redisClient.del(`session:${req.user.id}`);
    res.status(200).json({ status: 'success', message: 'Logged out' });
  } catch (error) { next(error); }
};

exports.getMe = async (req, res, next) => {
  const user = await User.findByPk(req.user.id, { include: ['products', 'orders'] });
  res.status(200).json({ status: 'success', data: { user } });
};

exports.updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findByPk(req.user.id, { attributes: { include: ['passwordHash'] } });
  if (!(await user.comparePassword(currentPassword))) return res.status(401).json({ status: 'fail', message: 'Incorrect password' });
  user.passwordHash = newPassword;
  await user.save();
  const token = generateToken(user.id);
  res.status(200).json({ status: 'success', message: 'Password updated', data: { token } });
};
