/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

// Configure chai
chai.use(chaiHttp);
chai.should();

// eslint-disable-next-line no-unused-vars
const { expect, assert } = chai;

describe('API Entry Point', () => {
  describe('GET /', () => {
    it('it should return welcome message', (done) => {
      chai
        .request(app)
        .get('/api/v1/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('welcome to petitioner API');
        });
      done();
    });
    it('it should return 404 with specified message', (done) => {
      chai
        .request(app)
        .get('/api/v1/notfound')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('route not found');
        });
      done();
    });
  });
});
