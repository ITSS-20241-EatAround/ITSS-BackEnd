const {UserFavorite} = require('../models/config');
const token = require('../utils/TokenUtil');

const UserFavoriteController = {
  async getFavoritesByUserId(req, res) {
    try {
      const {id} = req.params;
      const favorites = await UserFavorite.findAll({ where: { user_id : id } });
      return res.status(200).json({
        status : true,
        data : favorites
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch favorites', details: error.message });
    }
  },

    async getFavoritesByDishId(req, res) {
      try {
        const {id} = req.params;
        const favorite = await UserFavorite.findOne({ where: { dish_id : id} });
        if(favorite) {
            res.status(200).json(favorite);
        }
        return res.status(404).json({message: 'Not Found'});
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch favorites', details: error.message });
      }
    },
  
    async createFavorite(req, res) {
      try {
        const user_id = token(req).id;
        const { id } = req.params;
        const newFavorite = await UserFavorite.create({ user_id, dish_id : id });
        res.status(201).json(newFavorite);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create favorite', details: error.message });
      }
    },
  
    async deleteFavorite(req, res) {
      try {
        const { id } = req.params;
        const deleted = await UserFavorite.destroy({ where: { dish_id : id } });
  
        if (deleted === 0) {
          return res.status(404).json({ error: 'Favorite not found' });
        }
  
        res.status(200).json({ message: 'Favorite deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete favorite', details: error.message });
      }
    }
  };

  module.exports = UserFavoriteController;