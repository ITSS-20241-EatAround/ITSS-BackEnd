const express = require('express');
const router = express.Router();
const DishController = require('../controllers/DishController');
const RestaurantController = require("../controllers/RestaurantController");
const SearchController = require('../controllers/SearchController');

router.get('/restaurant/get-all', RestaurantController.getAll);
router.get('/restaurant/get-by-id/:id', RestaurantController.getById);
router.post('/restaurant/get-by-ids', RestaurantController.getByIds);
router.put('/restaurant/:id', RestaurantController.updateRate)

router.get('/dish/get-all', DishController.getAll);
router.get('/dish/get-by-id/:id', DishController.getById);
router.post('/dish/get-by-ids', DishController.getByIds);
router.get('/dish/restaurant/:id', DishController.getByRestaurantId);
router.get('/dish/search', SearchController.search);

module.exports = router;
