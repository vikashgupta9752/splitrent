const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'mysql';

let sequelize;

if (process.env.DATABASE_URL || process.env.MYSQL_URL) {
  const connectionString = process.env.DATABASE_URL || process.env.MYSQL_URL;
  console.log('Initializing Sequelize with Connection URL...');
  sequelize = new Sequelize(connectionString, {
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: process.env.NODE_ENV === 'development' ? (msg) => console.log(`[Sequelize] ${msg}`) : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '+05:30'
  });
} else if (dialect === 'sqlite') {
  console.log('Initializing Sequelize with SQLite...');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || path.join(__dirname, '../database.sqlite'),
    logging: process.env.NODE_ENV === 'development' ? (msg) => console.log(`[Sequelize] ${msg}`) : false
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'shared_expenses',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      dialectModule: require('mysql2'),
      logging: process.env.NODE_ENV === 'development' ? (msg) => console.log(`[Sequelize] ${msg}`) : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      timezone: '+05:30' // Standard offset for user environment
    }
  );
}

module.exports = sequelize;
