import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    '',
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
    }
);
//Kiểm tra kết nối
try {
    await sequelize.authenticate();
    console.log('Kết nối thành công!');
} catch (error) {
    console.log(error.message);
}

export default sequelize;