const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const UserSearchHistory = sequelize.define('UserSearchHistory', {
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
        unique: true
    },
    search_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'user_search_history',
    timestamps: true
});

module.exports = UserSearchHistory;
