const express = require('express');
const router = express.Router();
const DishCommentController = require('../controllers/DishCommentController');
const UserFavoriteController = require('../controllers/UserFavoriteController');
const UserSearchHistoryController = require('../controllers/UserSearchHistoryController');

router.get('/comment/:id',DishCommentController.getCommentsByDishId);
router.post('/comment',DishCommentController.createComment);
router.put('/comment/:id',DishCommentController.updateComment);
router.delete('/comment/:id',DishCommentController.deleteComment);

router.get('/favorite/get-by-dish-id/:id',UserFavoriteController.getFavoritesByDishId);
router.get('/favorite/get-by-user-id/:id',UserFavoriteController.getFavoritesByUserId);
router.post('/favorite/:id',UserFavoriteController.createFavorite);
router.delete('/favorite/:id',UserFavoriteController.deleteFavorite);

router.put('/user-history', UserSearchHistoryController.updateHistory);
router.get('/user-history', UserSearchHistoryController.getByUserId);

module.exports = router;