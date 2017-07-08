
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();


var config = require('config');

chai.use(chaiHttp);

describe('GET /apis/v1/pass?team=collingwood', function () {
    it('it should return something', function (done) {
        chai.request(server)
            .get('/apis/v1/pass?team=collingwood')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('response');

                done();
            });
    });
});

describe("POST /apis/v1/passupload", () => {
  it("should POST a pkpass file", (done) => {
    chai.request(server)
      .post('/apis/v1/passupload')
      .set('Content-Type', 'application/vnd.apple.pkpass')
      .field("custid", "12345")
      .attach('filetoupload', './test/testpass.pkpass', 'testpass.pkpass')
      .end((err, res) => {
        console.log("got the res");
        if (err) {
          console.error(err)
        } else {
          console.log('success');
          console.log(res.body)
        }
        done();
      });
  })
})