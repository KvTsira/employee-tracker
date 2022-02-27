const mysql = require('mysql2');

//connect to database
const db= mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'WelcomeMondays1806!',
        database: 'employee_db'
    },
    console.log('Connected to the employee_db database')
);

module.exports = db;
