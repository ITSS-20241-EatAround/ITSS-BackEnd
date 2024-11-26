require('dotenv').config();
const mysql = require('mysql2');

// Kết nối MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'sql12.freemysqlhosting.net',
    user: process.env.DB_USER || 'sql12747562',
    password: process.env.DB_PASSWORD || 'Bj1tiEP6Za',
    database: process.env.DB_NAME || 'sql12747562',
    port: process.env.DB_PORT || 3306
});

connection.connect((err) => {
    if (err) {
        console.error('Kết nối database thất bại:', err);
        process.exit(1);
    }
    console.log('Kết nối thành công đến database!');
});

module.exports = connection;
