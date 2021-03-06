/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../index';

chai.use(chatHttp);
const { expect } = chai;

describe('Testing Routes : Vote', () => {
  // test that a a user can create a petition
  let token = null;
  let token2 = null;
  const user = {
    email: 'test@gmail.com',
    first_name: 'test',
    last_name: 'test',
    phone_number: '000000000',
    address: 'Kicukiro',
    password: '123456',
    confirm_password: '123456',
  };

  const user2 = {
    email: 'test2@gmail.com',
    first_name: 'test',
    last_name: 'test',
    phone_number: '000000000',
    address: 'Kicukiro',
    password: '123456',
    confirm_password: '123456',
  };

  const petition = {
    title: 'title of the petition 2',
    description: 'describe the petition 2',
  };
  const petition2 = {
    title: 'title of the petition 3',
    description: 'describe the petition 3',
  };
  const vote = {
    vote: 'true',
  };
  const voteAgainst = {
    vote: 'false',
  };
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send(user)
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'applicatio/json')
      .send(user2)
      .end((err, res) => {
        token2 = res.body.token;
        done();
      });
  });
  before((done) => {
    chai.request(app)
      .post('/api/v1/petitions/')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token2}`)
      .send(petition)
      .end((err, res) => {
        done();
      });
  });
  before((done) => {
    chai.request(app)
      .post('/api/v1/petitions/')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token2}`)
      .send(petition2)
      .end((err, res) => {
        done();
      });
  });

  describe('PATCH api/v1/votes', () => {
    it('Should not upVote a vote when parameter is not an integer', (done) => {
      chai.request(app)
        .patch('/api/v1/petitions/2a/votes/upvote')
        .set('Authorization', `Bearer ${token}`)
        .send(vote)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });
    it('Should upVote a vote when all required conditions are met', (done) => {
      chai.request(app)
        .patch('/api/v1/petitions/2/votes/upvote')
        .set('Authorization', `Bearer ${token}`)
        .send(vote)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          done();
        });
    });
    it('User should not upvote his own petition', (done) => {
      chai.request(app)
        .patch('/api/v1/petitions/2/votes/upvote')
        .set('Authorization', `Bearer ${token2}`)
        .send(vote)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });
    it('User should not downvote his own petition', (done) => {
      chai.request(app)
        .patch('/api/v1/petitions/2/votes/downvote')
        .set('Authorization', `Bearer ${token2}`)
        .send(vote)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });
    it('Should not upvote a vote when petition does not exist', (done) => {
      chai.request(app)
        .patch('/api/v1/petitions/100/votes/upvote')
        .set('Authorization', `Bearer ${token}`)
        .send(vote)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });
    it('Should not update same vote twice', (done) => {
      chai.request(app)
        .patch('/api/v1/petitions/2/votes/upvote')
        .set('Authorization', `Bearer ${token}`)
        .send(vote)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          done();
        });
    });
    it('Should update a vote to false on request', (done) => {
      chai.request(app)
        .patch('/api/v1/petitions/2/votes/downvote')
        .set('Authorization', `Bearer ${token}`)
        .send(voteAgainst)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
    it('Should not update same false vote twice', (done) => {
      chai.request(app)
        .patch('/api/v1/petitions/2/votes/downvote')
        .set('Authorization', `Bearer ${token}`)
        .send(voteAgainst)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          done();
        });
    });
    it('Should update a vote back to true on request', (done) => {
      chai.request(app)
        .patch('/api/v1/petitions/2/votes/upvote')
        .set('Authorization', `Bearer ${token}`)
        .send(vote)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
    it('Should not downVote a vote when parameter is not an integer', (done) => {
      chai.request(app)
        .patch('/api/v1/petitions/2a/votes/downvote')
        .set('Authorization', `Bearer ${token}`)
        .send(vote)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });
    it('Should not upvote a vote when petition does not exist', (done) => {
      chai.request(app)
        .patch('/api/v1/petitions/100/votes/downvote')
        .set('Authorization', `Bearer ${token}`)
        .send(vote)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });
    it('Should downVote a vote when all required conditions are met', (done) => {
      chai.request(app)
        .patch('/api/v1/petitions/3/votes/downvote')
        .set('Authorization', `Bearer ${token}`)
        .send(vote)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          done();
        });
    });

    it('Should not be able to vote when user is not authenticated', (done) => {
      chai.request(app)
        .patch('/api/v1/petitions/3/votes/downvote')
        .set('Authorization', `Bearer ${petition}`)
        .send(vote)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });
  });
});
