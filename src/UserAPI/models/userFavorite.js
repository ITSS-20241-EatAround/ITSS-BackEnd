const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const UserFavorites = sequelize.define('UserFavorites', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dish_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'user_favorites',
    timestamps: true,
});

module.exports = UserFavorites;
