const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Restaurant = sequelize.define('Restaurant', {
  restaurant_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  menu: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  latitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: true,
  },
  longitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Restaurant',
  tableName: 'restaurants',
  timestamps: true
});

module.exports = Restaurant;
