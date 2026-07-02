const http = require('http');
const app = require('./src/app');
const { connectDatabase } = require('./src/config/database');
const { connectRedis } = require('./src/config/redis');
const { initializeWebSocket } = require('./src/websocket');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

const startServer = async () => {
  try {
    await connectDatabase();
    logger.info('✅ PostgreSQL connected');
    await connectRedis();
    logger.info('✅ Redis connected');
    const server = http.createServer(app);
    initializeWebSocket(server);
    logger.info('✅ WebSocket server initialized');
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
    });
    const gracefulShutdown = (signal) => {
      logger.info(`Received ${signal}. Shutting down...`);
      server.close(async () => {
        await require('./src/config/database').sequelize.close();
        await require('./src/config/redis').redisClient.quit();
        process.exit(0);
      });
    };
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};
startServer();
