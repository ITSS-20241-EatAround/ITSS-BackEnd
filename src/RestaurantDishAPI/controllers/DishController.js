const {Dish, Restaurant} = require('../models/config');

exports.getAll = async (req, res) => {
    try {
        const dishes = await Dish.findAll({
            include: [
                {
                  model: Restaurant,
                  as: 'restaurant'
                },
            ]
        });
        res.status(200).json({
            status: true,
            data: dishes,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dishes', details: error.message });
    }
}

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const dish = await Dish.findByPk(id,{
            include: [
                {
                  model: Restaurant,
                  as: 'restaurant'
                },
            ]
        });

        if (!dish) {
            return res.status(404).json({ error: 'Dish not found' });
        }

        res.status(200).json({
            status: true,
            data: dish,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dish', details: error.message });
    }
}

exports.getByRestaurantId = async (req, res) => {
    try {
        const { id } = req.params;
        const dishes = await Dish.findAll({ where: { restaurant_id: id },
            include: [
                {
                  model: Restaurant,
                  as: 'restaurant'
                },
            ]
        });

        if (dishes.length === 0) {
            return res.status(404).json({ error: 'No dishes found for this restaurant' });
        }

        res.status(200).json({
            status: true,
            data: dishes,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dishes', details: error.message });
    }
}

exports.getByIds = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'Invalid or empty list of IDs' });
        }

        const dishes = await Dish.findAll({ where: { dish_id: ids } ,
            include: [
                {
                  model: Restaurant,
                  as: 'restaurant'
                },
            ]
        });

        if (dishes.length === 0) {
            return res.status(404).json({ error: 'No dishes found for the given IDs' });
        }

        res.status(200).json({
            status: true,
            data: dishes,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dishes', details: error.message });
    }
}
