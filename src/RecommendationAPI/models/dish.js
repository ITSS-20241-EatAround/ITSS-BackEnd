const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Dish = sequelize.define('Dish', {
  dish_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  restaurant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'restaurants',
      key: 'restaurant_id',
    },
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Dish',
  tableName: 'dishes',
  timestamps: true,
});

module.exports = Dish;
