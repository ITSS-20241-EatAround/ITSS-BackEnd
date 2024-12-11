const express = require('express');
const router = express.Router();
const SuggestController = require('../controllers/SuggestController');

router.get('/restaurant',SuggestController.getRestaurantsSuggestion);
router.get('/dish', SuggestController.getDishSuggestion)

module.exports = router;