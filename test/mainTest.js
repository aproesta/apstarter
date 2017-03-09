
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();


var config = require('config');

chai.use(chaiHttp);

describe('GET /apis/v1/main', function () {
    it('it should return something', function (done) {
        chai.request(server)
            .get('/apis/v1/main')
            .set('CLIENT-SECRET', config.get('clientSecret'))
            .end(function (err, res) {
                res.should.have.status(200);
                /*
                res.body.should.be.a('array');
                res.body.length.should.be.gt(0);
        
                var api = res.body[0];
                api.should.be.a('object');
                api.should.have.property('method');
                api.should.have.property('endpoint');
                */

                done();
            });
    });
});