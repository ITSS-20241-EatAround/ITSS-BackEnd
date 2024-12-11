const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const DishIngredient = sequelize.define('DishIngredient', {
  dish_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'dishes',
      key: 'dish_id',
    },
  },
  ingredient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ingredients',
      key: 'ingredient_id',
    },
  },
}, {
  sequelize,
  modelName: 'DishIngredient',
  tableName: 'dish_ingredients',
  timestamps: true,
});

module.exports = DishIngredient;
