const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1); // Exit the application if unable to connect to the database
    }
    console.log('Connected to database');
});

module.exports = db.promise();
