const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'ecommerce_db',
  process.env.DB_USER || 'ecommerce',
  process.env.DB_PASSWORD || 'secret123',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
    pool: { max: 20, min: 5, acquire: 60000, idle: 10000 },
    define: { timestamps: true, underscored: true, freezeTableName: false },
    dialectOptions: process.env.NODE_ENV === 'production' ? { ssl: { require: true, rejectUnauthorized: false } } : {},
  }
);

const connectDatabase = async () => {
  await sequelize.authenticate();
  logger.info('Database connection established.');
  if (process.env.NODE_ENV === 'development') {
    await sequelize.sync({ alter: true });
    logger.info('Database models synchronized.');
  }
};

module.exports = { sequelize, connectDatabase };
