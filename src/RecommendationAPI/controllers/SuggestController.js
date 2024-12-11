const { Restaurant, Dish, sequelize } = require('../models/config');
const { getMethod, postMethod } = require('../utils/ApiUtil');
const token = require('../utils/TokenUtil');

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

const getRestaurantsSuggestion = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and Longitude are required' });
    }
    const user_id = token(req).id;
    const dataFavorite = await getMethod(req, '/user/favorite/get-by-user-id/' + user_id);
    const dataSearchStory = await getMethod(req, '/user/user-history');
    console.log(dataFavorite);
    
    const favoriteDishIds = dataFavorite.map(item => item.dish_id);
    const searchStoryDishIds = dataSearchStory.map(item => item.dish_id);

    const uniqueDishIds = [...new Set([...favoriteDishIds, ...searchStoryDishIds])];

    const dataRestaurant = await postMethod(req, "/dish/get-by-ids", { ids: uniqueDishIds });
    const restaurantIds = dataRestaurant.map(item => item.restaurant_id);
    const uniqueRestaurantIds = [...new Set([...restaurantIds])];
    var restaurants;
    if (uniqueRestaurantIds.length < 10) {
      restaurants = await Restaurant.findAll({
        limit: 10,
        order: sequelize.random(),
      });
    } else {
      restaurants = await Restaurant.findAll({
        where: {restaurant_id: uniqueRestaurantIds},
        limit: 10,
        order: sequelize.random(),
      });
    }
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

    return res.status(200).json({
      status: true,
      data: results,
    });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
}

const getDishSuggestion = async (req, res) => {
  try {
    const user_id = token(req).id;
    const dataFavorite = await getMethod(req, '/user/favorite/get-by-user-id/' + user_id);
    const dataSearchStory = await getMethod(req, '/user/user-history' );
    const favoriteDishIds = dataFavorite.map(item => item.dish_id);
    const searchStoryDishIds = dataSearchStory.map(item => item.dish_id);

    const uniqueDishIds = [...new Set([...favoriteDishIds, ...searchStoryDishIds])];
    var dishes;
    if (uniqueDishIds.length <= 10) {
      dishes = await Dish.findAll({
        limit: 10,
        order: sequelize.random(),
        include: [
          {
            model: Restaurant,
            as: 'restaurant'
          },
        ]
      });
    } else {
      dishes = await Dish.findAll({
        where: { dish_id: uniqueDishIds },
        limit: 10,
        order: sequelize.random(),
        include: [
          {
            model: Restaurant,
            as: 'restaurant'
          },
        ]
      });
    }
    return res.status(200).json({
      status: true,
      data: dishes,
    });
  } catch (err) {
    return res.status(500).json({ messsage: err.message });
  }
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
