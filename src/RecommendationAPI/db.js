const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'sql12747562', 
  process.env.DB_USER || 'sql12747562', 
  process.env.DB_PASSWORD || 'Bj1tiEP6Za',
  {
    host: process.env.DB_HOST || 'sql12.freemysqlhosting.net',
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
