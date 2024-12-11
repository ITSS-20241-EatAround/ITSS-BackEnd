const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'eatround', 
  process.env.DB_USER || 'root', 
  process.env.DB_PASSWORD || 'nducanh210503',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
