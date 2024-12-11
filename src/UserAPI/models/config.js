const sequelize = require('../db');
const DishComment = require('./dishComment');
const UserFavorite = require('./userFavorite');
const UserSearchHistory = require('./userSearchHistory');

module.exports = {
  sequelize,
  DishComment,
  UserFavorite,
  UserSearchHistory
};
