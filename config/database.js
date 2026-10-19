const path = require('node:path');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME || 'consultas_clinicas',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: false,
  },
);

module.exports = sequelize;