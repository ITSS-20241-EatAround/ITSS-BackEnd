const express = require('express');
const cors = require('cors');
const routes = require('./routes/web');
const { expressjwt } = require('express-jwt');
const { sequelize } = require('./models/config');
const dotenv = require('dotenv');

dotenv.config()
const app = express();
const secret = process.env.SECRET_KEY

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Error syncing models:', error);
  }
})();

app.use(
  expressjwt({
    secret,
    algorithms: ['HS256']
  }).unless({
    path: ['/data']
  })
);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: false,
      message: "Permission Denied",
      content: err.name
    });
  }
  next(err);
});


app.use(process.env.DEFAULT_VERSION || '/api/v1/suggest', routes);

app.post('/data/restaurant', require('./controllers/SuggestController').createExampleRestaurant);
app.post('/data/dish', require('./controllers/SuggestController').createExampleDish);

// Khởi động server
const PORT = process.env.PORT || 7202;
app.listen(PORT, () => {
  console.log(`App running in ${PORT} ...`);
});
