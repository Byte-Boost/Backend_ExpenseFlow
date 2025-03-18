//need to change local and name of this file
const mysql = require('mysql2/promise');

//database conection
const pool = mysql.createPool ({
    host: 'local host',
    user: 'user',
    password: 'password',
    database: 'db'
});

module.exports = pool;
