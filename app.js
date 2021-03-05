// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mysql = require("mysql");



const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'put_your_password_here',
    database: 'database_name'
});

connection.connect(function(err){
    if(err)
    console.log(err);
    else
    console.log("Connected to the databse!!");
});

const app = express();

app.use(express.static("public"));

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));




app.get("/",function(req,res){
    res.render("home");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/sign-in",function(req,res){
    res.render("sign-in");
});








app.listen (3000,() => {
        console.log("Server running on Port 3000");
    });
