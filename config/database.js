require('dotenv').config({
    path: 'config/.env'
});

const mysql = require("mysql");

// database connection created
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
});

// database connection established
connection.connect(function(err){
    if(err)
    console.log(err);
    else
    console.log("Connected to the databse!!");
});

module.exports = connection;