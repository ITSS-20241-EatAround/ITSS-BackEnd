const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const DishComments = sequelize.define('DishComments', {
  comment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  dish_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment_content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dish_rate: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
  }
}, {
  tableName: 'dish_comments',
  timestamps: true,
});

module.exports = DishComments;
