const {Dish, Restaurant} = require('../models/config');
const { Op } = require('sequelize');
const {putMethod} = require('../utils/ApiUtil');

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

exports.search = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 10, distance, minPrice, maxPrice, rating } = req.query;
    const { latitude, longitude } = req.query;
    var whereConditions = {};
    if (keyword && keyword.trim() !== '') {
      whereConditions[Op.or] = [
        { name: { [Op.like]: `%${keyword.toLowerCase()}%` } },
        { '$restaurant.name$': { [Op.like]: `%${keyword.toLowerCase()}%` } },
      ];
    }

    if (minPrice) {
      whereConditions.price = { [Op.gte]: minPrice };
    }

    if (maxPrice) {
      whereConditions.price = { ...whereConditions.price, [Op.lte]: maxPrice };
    }

    if (rating) {
      whereConditions['$restaurant.rating$'] = { [Op.gte]: rating };
    }

    var results = await Dish.findAll({
      where: whereConditions,
      include: [
        {
          model: Restaurant,
          as: 'restaurant'
        },
      ],
    });


    if (latitude && longitude && distance) {
      results = results.map((dish) => {
        const dist = calculateDistance(latitude, longitude, dish.restaurant.latitude, dish.restaurant.longitude);        
        dish.restaurant.dataValues.distance = dist;
        dish.distance = dist;
        return dish;
      }).filter(dish => dish.distance <= distance);
    }

    const offset = (page - 1) * limit;

    const paginatedItems = results.slice(offset, offset + limit);

    putMethod(req, '/user/user-history', {data : results});

    res.status(200).json({
      total: results.length,
      currentPage: page,
      totalPages: Math.ceil(results.length / limit),
      filter : {
        distance,
        rating,
        minPrice,
        maxPrice,
        keyword,
        page,
        limit
      },
      data: paginatedItems,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search dishes', details: error.message });
  }
};
