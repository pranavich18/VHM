// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");



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