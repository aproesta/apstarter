
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();


var config = require('config');

chai.use(chaiHttp);

var newDocId;
var newRevId;

describe("PASS API tests", () => {
  it("should upload a pkpass file", (done) => {
    chai.request(server)
      .post('/apis/v1/passupload')
      .set('Content-Type', 'application/vnd.apple.pkpass')
      .field("custid", "12345")
      .attach('filetoupload', './test/testpass.pkpass', 'testpass.pkpass')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('id');

        newDocId = res.body.id;

        done();
      });
  });

  it("should NOT upload a file without a pkpass extension", (done) => {
    chai.request(server)
      .post('/apis/v1/passupload')
      .set('Content-Type', 'application/vnd.apple.pkpass')
      .field("custid", "12345")
      .attach('filetoupload', './test/testpass.pkpass', 'testpass.zip')
      .end((err, res) => {
        res.should.have.status(400);

        done();
      });
  });

  it("should NOT upload a file without a pass.json file", (done) => {
    chai.request(server)
      .post('/apis/v1/passupload')
      .set('Content-Type', 'application/vnd.apple.pkpass')
      .field("custid", "12345")
      .attach('filetoupload', './test/passwithoutpassjson.pkpass', 'passwithoutpassjson.pkpass')
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it("should NOT upload a file without a manifest.json file", (done) => {
    chai.request(server)
      .post('/apis/v1/passupload')
      .set('Content-Type', 'application/vnd.apple.pkpass')
      .field("custid", "12345")
      .attach('filetoupload', './test/passwithoutmanifest.pkpass', 'passwithoutmanifest.pkpass')
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it("should NOT upload a file without a signature file", (done) => {
    chai.request(server)
      .post('/apis/v1/passupload')
      .set('Content-Type', 'application/vnd.apple.pkpass')
      .field("custid", "12345")
      .attach('filetoupload', './test/passwithoutsignature.pkpass', 'passwithoutsignature.pkpass')
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it("should NOT upload a file without a custid", (done) => {
    chai.request(server)
      .post('/apis/v1/passupload')
      .set('Content-Type', 'application/vnd.apple.pkpass')
      .attach('filetoupload', './test/testpass.pkpass', 'testpass.pkpass')
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('it should return a pass document', function (done) {
    chai.request(server)
      .get('/apis/v1/pass/' + newDocId)
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('_id');
        newRevId = res.body._rev;

        done();
      });
  });

  it('it should delete a pass document', function (done) {
    chai.request(server)
      .delete('/apis/v1/pass/' + newDocId + '?rev=' + newRevId)
      .end(function (err, res) {
        res.should.have.status(200);

        done();
      });
  });

it('it should NOT return a pass document', function (done) {
    chai.request(server)
      .get('/apis/v1/pass/' + newDocId)
      .end(function (err, res) {
        res.should.have.status(404);

        done();
      });
  });

  it('it should NOT delete a pass document', function (done) {
    chai.request(server)
      .delete('/apis/v1/pass/' + newDocId + '?rev=' + newRevId)
      .end(function (err, res) {
        res.should.have.status(404);

        done();
      });
  });

});
