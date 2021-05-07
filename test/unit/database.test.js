const Mocha = require('mocha');
const mocha = new Mocha();
const chai = require('chai');
const assert = require('assert');
const DB = require('../../config/database');


const expect = chai.expect;


// data objects created
var user = {
    dl_no: '0',
    name: '0',
    mobile_no: 0,
    address: '0',
    email: '0',
    password: '0'
}

var vehicle = {
    dl_no: '0',
    v_id: '0',
    v_chasis: '0',
    v_plate: '0',
    v_type: '0'
}

var balance = {
    dl_no: '0',
    name: '0',
    balance_amt: 0,
    v_id: '0'
};


describe('Database Connection: ', function(){
    // checking if connection is established with success
    it('DB.getConnection should connect successfully ', function(done){
        DB.getConnection(function(err,result){
            if(err){
                done(err);
            }
            else{
                result = "MYSQL CONNECT SUCCESSFUL!";
                expect(result).to.be.equal("MYSQL CONNECT SUCCESSFUL!");
                done();   
            }       
        });
    });
});

describe('User Table',function(){

    // checking for data after passing wrong key
    it('should return no data when passed the wrong key', function(done){
        DB.query('SELECT * FROM user WHERE email = ?', '123',function(err,rows){
            if(err){
                done(err);
            }
            else{
                expect(err).to.be.null;
                expect(rows).to.be.an('array').that.is.empty;
                done();
            }
        });
    });

    //checking for correct order and format
    it('should return the data in the correct order and format', function(done){
        
        //insert sample data
        DB.query('INSERT into user SET ?', user,function(err){
            if(err){
                done(err);
            }
            else{
                // check data order
                DB.query('SELECT * FROM user WHERE email = ?', '0',function(err,rows){
                    if(err){
                        done(err);
                    }
                    else{
                        expect(err).to.be.null;
                        expect(rows).to.be.an('array');
                        expect(rows[0]).to.haveOwnProperty('dl_no');
                        expect(rows[0]).to.haveOwnProperty('name');
                        expect(rows[0]).to.haveOwnProperty('mobile_no');
                        expect(rows[0]).to.haveOwnProperty('address');
                        expect(rows[0]).to.haveOwnProperty('email');
                        expect(rows[0]).to.haveOwnProperty('password');
                        
                        //delete sample data
                        DB.query('DELETE from user WHERE email= ?','0',function(err){
                            if(err){
                                done(err);
                            }
                            else{
                                done();
                            }
                        });
                    }
                });
            }
        });
    });

});

describe('Vehicle Table',function(){

    // checking for data after passing wrong key
    it('should return no data when passed the wrong key', function(done){
        DB.query('SELECT * FROM vehicle WHERE dl_no = ?', '0',function(err,rows){
            if(err){
                done(err);
            }
            else{
                expect(err).to.be.null;
                expect(rows).to.be.an('array').that.is.empty;
                done();
            }
        });
    });

    it('should return the data in the correct order and format', function(done){
        
        //insert sample data
        DB.query('INSERT into user SET ?',user,function(err){
            if(err){
                done(err);
            }
            else{
                //insert sample data
                DB.query('INSERT into vehicle SET ?',vehicle,function(err){
                    if(err){
                        done(err);
                    }
                    else{
                        // check data order
                        DB.query('SELECT * from vehicle where dl_no = ?','0',function(err,rows){
                            if(err){
                                done(err);
                            }
                            else{
                                expect(err).to.be.null;
                                expect(rows).to.be.an('array');
                                expect(rows[0]).to.haveOwnProperty('dl_no');
                                expect(rows[0]).to.haveOwnProperty('v_id');
                                expect(rows[0]).to.haveOwnProperty('v_chasis');
                                expect(rows[0]).to.haveOwnProperty('v_plate');
                                expect(rows[0]).to.haveOwnProperty('v_type');
                                
                                //delete sample data
                                DB.query('DELETE from vehicle where dl_no = ?','0',function(err){
                                    if(err){
                                        done(err);
                                    }
                                    else{
                                        DB.query('DELETE from user WHERE email= ?','0',function(err){
                                            if(err){
                                                done(err);
                                            }
                                            else{
                                                done();
                                            }
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

});

describe('Balance Table',function(){

    // checking for data after passing wrong key
    it('should return no data when passed the wrong key', function(done){
        DB.query('SELECT * FROM balance WHERE dl_no = ?', '0',function(err,rows){
            if(err){
                done(err);
            }
            else{
                expect(err).to.be.null;
                expect(rows).to.be.an('array').that.is.empty;
                done();
            }
        });
    });

    it('should return the data in the correct order and format',function(done){
        //insert sample data
        DB.query('INSERT into user SET ?', user, function(err){
            if(err){
                done(err);
            }
            else{
                //insert sample data
                DB.query('INSERT into vehicle SET ?', vehicle, function(err){
                    if(err){
                        done(err);
                    }
                    else{
                        //insert sample data
                        DB.query('INSERT into balance SET ?', balance, function(err){
                            if(err){
                                done(err);
                            }
                            else{
                                // check data order
                                DB.query('SELECT * from balance WHERE dl_no = ?','0', function(err, rows){
                                    if(err){
                                        done(err);
                                    }
                                    else{
                                        expect(err).to.be.null;
                                        expect(rows).to.be.an('array');
                                        expect(rows[0]).to.haveOwnProperty('dl_no');
                                        expect(rows[0]).to.haveOwnProperty('name');
                                        expect(rows[0]).to.haveOwnProperty('balance_amt');
                                        expect(rows[0]).to.haveOwnProperty('v_id');
                                        
                                        //delete sample data
                                        DB.query('DELETE from balance WHERE dl_no = ?','0',function(err){
                                            if(err){
                                                done(err);
                                            }
                                            else{
                                                //delete sample data
                                                DB.query('DELETE from vehicle WHERE dl_no = ?','0', function(err){
                                                    if(err){
                                                        done(err);
                                                    }
                                                    else{
                                                        //delete sample data
                                                        DB.query('DELETE from user WHERE dl_no = ?', '0', function(err){
                                                            done();
                                                        });
                                                    }
                                                });
                                            }
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

});
