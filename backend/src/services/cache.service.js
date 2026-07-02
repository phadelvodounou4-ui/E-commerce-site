const { redisClient } = require('../config/redis');
const DEFAULT_TTL = 300;
exports.get = async (key) => { const data = await redisClient.get(key); return data ? JSON.parse(data) : null; };
exports.set = async (key, value, ttl = DEFAULT_TTL) => { await redisClient.setex(key, ttl, JSON.stringify(value)); };
exports.del = async (key) => { await redisClient.del(key); };
exports.delPattern = async (pattern) => { const keys = await redisClient.keys(pattern); if (keys.length) await redisClient.del(...keys); };
