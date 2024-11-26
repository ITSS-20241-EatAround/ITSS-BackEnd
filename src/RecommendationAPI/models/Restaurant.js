const connection = require('../db');

class Restaurant {
    // Lấy danh sách nhà hàng ngẫu nhiên với số lượng giới hạn
    static getRandomRestaurants(limit, callback) {
        const query = 'SELECT restaurant_id, name, address, image_url FROM restaurants ORDER BY RAND() LIMIT ?';
        connection.query(query, [limit], callback);
    }
}

module.exports = Restaurant;
