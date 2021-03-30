// jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mysql = require("mysql");
var uniqid = require('uniqid');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const bcrypt = require("bcrypt");
const saltRounds = 10;
const stripe = require('stripe')(process.env.SECRET_KEY)

var token='';
var dl_no = '';


const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
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

app.get("/success",function(req,res){
    res.render("success");
});

app.get("/dashboard",function(req,res){
    jwt.verify(token, "SecretKey", function(err,decoded){
        if(err){
            res.render("sign-in");
            console.log("Log-In again");
        }
        else{
            let name= '';
            let contact='';
            let address = '';
            let id = '';
            let pno='';
            let vtype='';
            let balance = 0.0;
            dl_no = decoded.dl_no;
            connection.query('SELECT * FROM user WHERE dl_no = ?', dl_no, function(err,rows){
                if(err){
                    console.log(err);
                }
                else{
                    name = rows[0].name;
                    contact = rows[0].mobile_no;
                    address = rows[0].address;
                    connection.query('SELECT * FROM vehicle WHERE dl_no = ?', dl_no, function(err,rows){
                        if(err){
                            console.log(err);
                        }
                        else{
                            id= rows[0].v_id;
                            pno=rows[0].v_plate;
                            vtype=rows[0].v_type;
                            connection.query('SELECT * FROM balance WHERE dl_no = ?', dl_no, function(err,rows){
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    balance = rows[0].balance_amt;
                                    res.render("dashboard",{
                                        balance: balance,
                                        key: process.env.PUBLISHABLE_KEY,
                                        userName: name,
                                        dlNumber: dl_no,
                                        userAddress: address,
                                        userContact: contact,
                                        v_id: id,
                                        plateNumber: pno,
                                        vehicleType: vtype
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});


app.post("/register",function(req,res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        var user = {
            dl_no: req.body.dlNumber,
            name: req.body.name,
            mobile_no: req.body.contact,
            address: req.body.address,
            email: req.body.email,
            password: hash
        }
        var vehicle = {
            dl_no: req.body.dlNumber,
            v_id: uniqid.time(),
            v_chasis: req.body.chasisNumber,
            v_plate: req.body.plateNumber,
            v_type: req.body.vehicleType
        }
        connection.query('SAVEPOINT A');
        connection.query('INSERT INTO user SET ?',user,function(err){
            if(!err){
                connection.query('INSERT INTO vehicle SET ?',vehicle,function(err){
                    if(!err){
                        var balance = {
                            dl_no: req.body.dlNumber,
                            name: req.body.name,
                            balance_amt: 0.0,
                            v_id: vehicle.v_id
                        };
                        connection.query('INSERT INTO balance SET ?', balance,function(err){
                            if(!err){
                                res.render("sign-in");
                                connection.query('COMMIT');
                            }
                            else{
                                connection.query('ROLLBACK TO A');
                                console.log(err);
                                res.render("register");
                            } 
                        });
                    }
                    else{
                        connection.query('ROLLBACK TO A');
                        console.log(err);
                        res.render("register");
                    }
                });
            }
            else{
                connection.query('ROLLBACK TO A');
                console.log(err);
                res.render("register");
            }
        });
    });
});

app.post("/sign-in",function(req,res){
    const email = req.body.email;
    const password = req.body.password;
    connection.query('SELECT * FROM user where email = ?', email, function(err, rows){
        if(err){
            res.render("sign-in");
            console.log(err);
        }
        else{
            if(rows.length>0){
                bcrypt.compare(password, rows[0].password, function(err, result) {
                    if(err){
                        res.render("sign-in");
                        console.log(err);
                    }
                    else{
                        if(result==true){
                            token = jwt.sign({dl_no: rows[0].dl_no}, "SecretKey", { expiresIn: '1h' });
                            res.cookie('token', jwt.token, {
                                maxAge: 1000 * 60 * 60 // 1 hour
                            });
                            res.redirect("dashboard");
                        }
                        else
                        res.render("sign-in");
                    }
                });
            }
            else
            res.render("sign-in"); 
        }
    });
});

app.post("/success",function(req, res){
    res.redirect("dashboard");
})

app.post("/payment",function(req,res){
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Fastag'

    })
    .then((customer)=>{
        return stripe.charges.create({
            amount: 10000,
            description: 'A recharge of INR 100 to your  Fastag vehicle.',
            currency: 'INR',
            customer: customer.id
        })
    })
    .then((charge)=>{
        console.log(charge);
        connection.query('UPDATE balance SET balance_amt = balance_Amt+100.0 WHERE dl_no = ?', dl_no,function(err,result){
            if(err){
                console.log(err);
                res.redirect("dashboard");
            }
            else{
                res.render("success");
            }
        });
    })
    .catch((err)=>{
        console.log(err);
    })
});




app.listen (3000,() => {
        console.log("Server running on Port 3000");
    });

