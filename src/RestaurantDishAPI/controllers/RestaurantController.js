const {Dish, Restaurant} = require('../models/config');
const { Op } = require('sequelize');

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degree) => (degree * Math.PI) / 180;
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};


exports.getAll = async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and Longitude are required' });
        }
        const restaurants = await Restaurant.findAll();


        const results = await Promise.all(
            restaurants.map(async (restaurant) => {
                const dishes = await Dish.findAll({
                    where: { restaurant_id: restaurant.restaurant_id },
                    order: [['price', 'ASC']],
                });

                const distance = calculateDistance(
                    parseFloat(latitude),
                    parseFloat(longitude),
                    parseFloat(restaurant.latitude),
                    parseFloat(restaurant.longitude)
                );

                const prices = dishes.map((dish) => dish.price);

                return {
                    ...restaurant.toJSON(),
                    distance: distance.toFixed(2),
                    dishPrices: {
                        lowest: prices[0] || null,
                        highest: prices[prices.length - 1] || null,
                    },
                };
            })
        );

        res.status(200).json({
            status: true,
            data: results,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch restaurants', details: error.message });
    }
}
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findByPk(id);

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        res.status(200).json({
            status: true,
            data: restaurant,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch restaurant', details: error.message });
    }
}

exports.getByIds = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'Invalid or empty list of IDs' });
        }

        const restaurants = await Restaurant.findAll({ where: { restaurant_id: ids } });

        if (restaurants.length === 0) {
            return res.status(404).json({ error: 'No restaurants found for the given IDs' });
        }

        const results = await Promise.all(
            restaurants.map(async (restaurant) => {
                const dishes = await Dish.findAll({
                    where: { restaurant_id: restaurant.id },
                    order: [['price', 'ASC']],
                });

                const distance = calculateDistance(
                    parseFloat(latitude),
                    parseFloat(longitude),
                    parseFloat(restaurant.latitude),
                    parseFloat(restaurant.longitude)
                );

                const prices = dishes.map((dish) => dish.price);

                return {
                    ...restaurant.toJSON(),
                    distance: distance.toFixed(2),
                    dishPrices: {
                        lowest: prices[0] || null,
                        highest: prices[prices.length - 1] || null,
                    },
                };
            })
        );

        res.status(200).json({
            status: true,
            data: results,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch restaurants', details: error.message });
    }
}

exports.updateRate = async (req, res) => {
  try {
    const { id } = req.params;
    const { rate } = req.body;

    if (!rate || rate < 0 || rate > 5) {
      return res.status(400).json({ error: 'Invalid rate value. Rate must be a number between 0 and 5.' });
    }

    const dish = await Dish.findByPk(id);

    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    const restaurant = await Restaurant.findByPk(dish.restaurant_id);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found for the given dish' });
    }

    restaurant.rating = rate;
    await restaurant.save();

    res.status(200).json({
      status: true,
      message: 'Rating updated successfully',
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update rating', details: error.message });
  }
};

