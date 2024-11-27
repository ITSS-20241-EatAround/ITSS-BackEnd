const sequelize = require('../db');
const Restaurant = require('./restaurant');
const Dish = require('./dish');
const Ingredient = require('./ingredient');
const DishIngredient = require('./dishIngredient');

Restaurant.hasMany(Dish, { foreignKey: 'restaurant_id', as: 'dishes' });
Dish.belongsTo(Restaurant, { foreignKey: 'restaurant_id', as: 'restaurant' });

Dish.belongsToMany(Ingredient, {
  through: DishIngredient,
  foreignKey: 'dish_id',
  otherKey: 'ingredient_id',
  as: 'ingredients',
});
Ingredient.belongsToMany(Dish, {
  through: DishIngredient,
  foreignKey: 'ingredient_id',
  otherKey: 'dish_id',
  as: 'dishes',
});

module.exports = {
  sequelize,
  Restaurant,
  Dish,
  Ingredient,
  DishIngredient,
};
