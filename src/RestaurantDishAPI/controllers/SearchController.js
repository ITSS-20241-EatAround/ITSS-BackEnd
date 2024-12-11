const {Dish, Restaurant} = require('../models/config');
const { Op } = require('sequelize');

exports.search = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 10 } = req.query;

    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({ error: 'Keyword is required' });
    }

    const offset = (page - 1) * limit;

    const results = await Dish.findAndCountAll({
      where: {
        name: { [Op.like]: `%${keyword.toLowerCase()}%` },
      },
      include: [
        {
          model: Restaurant,
          as: 'restaurant'
        },
      ],
      offset,
      limit: parseInt(limit),
    });

    res.status(200).json({
      total: results.count,
      currentPage: page,
      totalPages: Math.ceil(results.count / limit),
      data: results.rows,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search dishes', details: error.message });
  }
}