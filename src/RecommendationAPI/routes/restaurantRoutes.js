const express = require('express');
const router = express.Router();
const RestaurantController = require('../controllers/RestaurantController');

// API: Lấy danh sách nhà hàng ngẫu nhiên
router.get('/random', RestaurantController.getRandomRestaurants);

module.exports = router;
