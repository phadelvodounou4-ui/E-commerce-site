const Redis = require('ioredis');
const logger = require('../utils/logger');

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: 0,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

const connectRedis = () => new Promise((resolve, reject) => {
  redisClient.on('connect', () => { logger.info('Redis connected'); resolve(); });
  redisClient.on('error', (err) => { logger.error('Redis error:', err); reject(err); });
});

module.exports = { redisClient, connectRedis };
