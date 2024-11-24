import express from 'express';
import sequelize from './config/db/dbConnect.js';
import dotenv from 'dotenv';
import cors from 'cors';
import route from './router/router.js';
dotenv.config()
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try {
    await sequelize.sync({force: false});
    console.log("Đồng bộ thành công");
} catch (error) {
    console.log(error.message);
}
app.use(cors());
route(app);
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`App running in port: ${PORT}`))