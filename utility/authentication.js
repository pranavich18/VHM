require('dotenv').config({
    path: 'config/.env'
});

const DB = require("../config/database");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;


// authentication using token verification
async function validate(req,res,next){
    await jwt.verify(req.cookies.token, "SecretKey", function (err, decoded) {
        if (err) {
            res.redirect("sign-in");
            console.log("Log-In again");
            console.log(err);
        }
        else{
            //decoded values stored in request body
            req.body.id = decoded.dl_no;
            req.body.loggedIn = true;
        }
    });
    next();
};

// dashboard display
function  verify(req, res) {
    
    let name = '';
    let contact = '';
    let address = '';
    let id = '';
    let pno = '';
    let vtype = '';
    let balance = 0.0;
    DB.query('SELECT * FROM user WHERE dl_no = ?', req.body.id , function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            name = rows[0].name;
            contact = rows[0].mobile_no;
            address = rows[0].address;
            DB.query('SELECT * FROM vehicle WHERE dl_no = ?' ,req.body.id, function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {
                    id = rows[0].v_id;
                    pno = rows[0].v_plate;
                    vtype = rows[0].v_type;
                    DB.query('SELECT * FROM balance WHERE dl_no = ? ' ,req.body.id, function (err, rows) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            balance = rows[0].balance_amt;
                            res.render("dashboard", {
                                balance: balance,
                                key: process.env.PUBLISHABLE_KEY,
                                userName: name,
                                dlNumber: req.body.id,
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
};


// user login by generating tokens
function login(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    DB.query('SELECT * FROM user where email = ?', email, function (err, rows) {
        if (err) {
            res.render("sign-in");
            console.log(err);
        }
        else {
            if (rows.length > 0) {
                bcrypt.compare(password, rows[0].password, function (err, result) {
                    if (err) {
                        res.render("sign-in");
                        console.log(err);
                    }
                    else {
                        if (result == true) {
                            // token generated
                            const token = jwt.sign({ dl_no: rows[0].dl_no }, "SecretKey", { expiresIn: '1h' }); 
                            
                            // token stored in cookie
                            res.cookie('token', token, {
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
};

// logout
function  logout(req,res){
    // token is cleared from the cookie
    res.clearCookie('token');
    res.redirect("/");
};

module.exports = {
    validate,
    verify,
    logout,
    login
};