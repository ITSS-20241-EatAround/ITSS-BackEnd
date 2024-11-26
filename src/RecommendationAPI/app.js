const express = require('express');
const cors = require('cors');
const restaurantRoutes = require('./routes/restaurantRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/restaurants', restaurantRoutes);

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});
