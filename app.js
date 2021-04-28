// jshint esversion:6
require('dotenv').config({
    path: 'config/.env'
});

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const DB = require("./config/database");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

// routes included
const auth = require('./utility/authentication');
const pay = require('./utility/payment');
const user = require('./utility/user');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static("public"));

app.use(cookieParser());


app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));


// home
app.get("/",function(req,res){
    res.render("home");
});

// register
app.get("/register",function(req,res){
    res.render("register");
});

// sign-in
app.get("/sign-in",function(req,res){
    res.render("sign-in");
});

// success
app.get("/success",function(req,res){
    res.render("success");
});

// user authentication
app.get("/dashboard", auth.validate, auth.verify);

// user created
app.post("/register", user.register);

// user LogIn
app.post("/sign-in", auth.login);

// success 
app.post("/success",function(req, res){
    res.redirect("dashboard");
})

// transaction processed after authentication
app.post("/payment", auth.validate,pay.transaction);

// logout
app.post("/logout", auth.logout);


app.listen (PORT,() => {
        console.log("Server running on Port 3000");
});