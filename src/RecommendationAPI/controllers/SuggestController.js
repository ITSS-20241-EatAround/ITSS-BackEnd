const { Restaurant, Dish, sequelize } = require('../models/config');


const getRestaurantsSuggestion = async (req, res) => {
    const restaurants = await Restaurant.findAll({
        limit: 9,
        order: sequelize.random(),
    });

    return res.status(200).json({
        status: true,
        data: restaurants,
    });
}

const getDishSuggestion = async (req, res) => {
    const dishes = await Dish.findAll({
        limit: 9,
        order: sequelize.random()
    });

    return res.status(200).json({
        status: true,
        data: dishes,
    });
}

const createExampleRestaurant = async (req, res) => {
    try {
        const { name, address, contact, menu, rating, image_url, latitude, longitude } = req.body;

        if (!name || !address) {
            return res.status(400).json({ message: 'Name and address are required.' });
        }

        const newRestaurant = await Restaurant.create({
            name,
            address,
            contact,
            menu,
            rating,
            image_url,
            latitude,
            longitude,
        });

        res.status(201).json({ message: 'Restaurant created successfully', restaurant: newRestaurant });
    } catch (error) {
        console.error('Error creating restaurant:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createExampleDish = async (req, res) => {
  try {
    const { restaurant_id, name, description, price, category } = req.body;

    if (!restaurant_id || !name || !price) {
      return res.status(400).json({ message: 'Restaurant ID, name, and price are required.' });
    }

    const restaurant = await Restaurant.findByPk(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found.' });
    }

    const newDish = await Dish.create({
      restaurant_id,
      name,
      description,
      price,
      category,
    });

    res.status(201).json({ message: 'Dish created successfully', dish: newDish });
  } catch (error) {
    console.error('Error creating dish:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
    getRestaurantsSuggestion,
    getDishSuggestion,
    createExampleRestaurant,
    createExampleDish
};
