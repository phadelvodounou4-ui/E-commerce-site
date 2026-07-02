const rateLimit = require('express-rate-limit');
exports.apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false, message: { status: 'fail', message: 'Too many requests, please try again later.' } });
exports.authLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: { status: 'fail', message: 'Too many login attempts. Please try again in an hour.' } });
