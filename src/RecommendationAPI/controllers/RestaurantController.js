const Restaurant = require('../models/Restaurant');

// API: Lấy danh sách nhà hàng ngẫu nhiên
const getRandomRestaurants = (req, res) => {
    const limit = parseInt(req.query.limit) || 5; // Mặc định lấy 5 nhà hàng
    Restaurant.getRandomRestaurants(limit, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách nhà hàng' });
        } else {
            res.json(results);
        }
    });
};

module.exports = {
    getRandomRestaurants
};
