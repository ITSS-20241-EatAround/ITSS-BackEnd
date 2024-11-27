const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Ingredient = sequelize.define('Ingredient', {
  ingredient_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Ingredient', 
  tableName: 'ingredients',
  timestamps: true
});

module.exports = Ingredient;
