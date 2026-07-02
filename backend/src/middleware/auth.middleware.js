const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { redisClient } = require('../config/redis');
const logger = require('../utils/logger');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-immediately';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

exports.generateToken = (userId) => jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN, issuer: 'ecommerce-api', audience: 'ecommerce-client' });

const verifyToken = async (token) => {
  const decoded = jwt.verify(token, JWT_SECRET, { issuer: 'ecommerce-api', audience: 'ecommerce-client' });
  const isBlacklisted = await redisClient.get(`bl:${token}`);
  if (isBlacklisted) throw new Error('Token revoked');
  return decoded;
};

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;
    if (!token) return res.status(401).json({ status: 'fail', message: 'Please log in.' });
    const decoded = await verifyToken(token);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ status: 'fail', message: 'User no longer exists.' });
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error.message);
    return res.status(401).json({ status: 'fail', message: 'Authentication failed' });
  }
};

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ status: 'fail', message: 'Permission denied' });
  next();
};

exports.optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;
    if (token) {
      const decoded = await verifyToken(token);
      req.user = await User.findByPk(decoded.id);
    }
  } catch (error) { /* ignore */ }
  next();
};
