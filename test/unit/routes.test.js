const Mocha = require('mocha');
const mocha = new Mocha();
const chai = require('chai');
const assert = require('assert');
const chaiHttp = require('chai-http');


const expect = chai.expect;
chai.use(chaiHttp);


const serverURL = 'http://localhost:3000';



describe('Home', function(){
    //checking if home route returns status code 200
    it('get ("/") route should return status code 200', function(done){
        chai.request(serverURL)
        .get('/')
        .end(function(err,res){
            if(err){
                done(err);
            }
            else{
                expect(err).to.be.null;
                expect(res).to.haveOwnProperty('statusCode').eql(200);
                done();
            }
        });
    });

});

describe('Register', function(){
    //checking if register route returns status code 200
    it('get ("/register") route should return status code 200', function(done){
        chai.request(serverURL)
        .get('/register')
        .end(function(err,res){
            if(err){
                done(err);
            }
            else{
                expect(err).to.be.null;
                expect(res).to.haveOwnProperty('statusCode').eql(200);
                done();
            }
        });
    });

});

describe('Sign-In', function(){
    //checking if sign-in route returns status code 200
    it('get ("/sign-in") route should return status code 200', function(done){
        chai.request(serverURL)
        .get('/sign-in')
        .end(function(err,res){
            if(err){
                done(err);
            }
            else{
                expect(err).to.be.null;
                expect(res).to.haveOwnProperty('statusCode').eql(200);
                done();
            }
        });
    });

});
