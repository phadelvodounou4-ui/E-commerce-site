const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      pool: { max: 20, min: 5, acquire: 60000, idle: 10000 },
      define: { timestamps: true, underscored: true, freezeTableName: false },
      dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
    })
  : new Sequelize(
      process.env.DB_NAME || 'ecommerce_db',
      process.env.DB_USER || 'ecommerce',
      process.env.DB_PASSWORD || 'secret123',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
        define: { timestamps: true, underscored: true, freezeTableName: false },
      }
    );

const connectDatabase = async () => {
  await sequelize.authenticate();
  logger.info('Database connection established.');
  await sequelize.sync({ alter: true });
  logger.info('Database models synchronized.');
};

module.exports = { sequelize, connectDatabase };
