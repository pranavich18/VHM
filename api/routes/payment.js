require('dotenv').config({
    path: 'config/.env'
});

const DB = require("../../config/database");
const stripe = require('stripe')(process.env.SECRET_KEY)

// transaction processing
function transaction(req,res){

    //customer created
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Fastag'

    })
    .then((customer)=>{

        //charges are returned
        return stripe.charges.create({
            amount: 10000,
            description: 'A recharge of INR 100 to your  Fastag vehicle.',
            currency: 'INR',
            customer: customer.id
        })
    })
    .then((charge)=>{
        console.log(charge);

        //balance amount in database updated
        DB.query('UPDATE balance SET balance_amt = balance_Amt+100.0 WHERE dl_no = ?', req.body.id,function(err,result){
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
};

module.exports = {
    transaction
};