require('dotenv').config({
    path: 'config/.env'
});

const DB = require("../../config/database");
var uniqid = require('uniqid');
const cookieParser = require('cookie-parser');
const bcrypt = require("bcrypt");
const saltRounds = 10;


// user gets registered
function register(req, res) {

    // password stored in database after hashing and salting
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
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

        // transaction to ensure atomicity 
        DB.query('SAVEPOINT A');
        DB.query('INSERT INTO user SET ?', user, function (err) {
            if (!err) {
                DB.query('INSERT INTO vehicle SET ?', vehicle, function (err) {
                    if (!err) {
                        var balance = {
                            dl_no: req.body.dlNumber,
                            name: req.body.name,
                            balance_amt: 0.0,
                            v_id: vehicle.v_id
                        };
                        DB.query('INSERT INTO balance SET ?', balance, function (err) {
                            if (!err) {
                                // rendered if user created with atomicity
                                res.render("sign-in");
                                DB.query('COMMIT');
                            }
                            else {
                                DB.query('ROLLBACK TO A');
                                console.log(err);
                                res.render("register");
                            }
                        });
                    }
                    else {
                        DB.query('ROLLBACK TO A');
                        console.log(err);
                        res.render("register");
                    }
                });
            }
            else {
                DB.query('ROLLBACK TO A');
                console.log(err);
                res.render("register");
            }
        });
    });
};





module.exports = {
    register
};