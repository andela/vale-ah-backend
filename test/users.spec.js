import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import server from '../server';

chai.use(chaiHttp);

describe('Authentication', () => {
  describe('POST /api/users', () => {
    const baseUrl = '/api/users';
    it('should register a user with valid details', done => {
      chai
        .request(server)
        .post(baseUrl)
        .send({
          username: 'Uche',
          email: 'uche@jake.jake',
          password: 'jakejake'
        })
        .end((err, res) => {
          const { user } = res.body;
          expect(res).to.have.status(201);
          expect(user.id).to.be.a('number');
          expect(user.verified).to.equal(false);
          expect(user.token).to.be.a('string');
          done(err);
        });
    });

    it('should not create a user with an existing user email', done => {
      chai
        .request(server)
        .post(baseUrl)
        .send({
          username: faker.internet.userName(),
          email: 'uche@jake.jake',
          password: 'jakejake'
        })
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors[0]).to.contain('already exists');
          expect(res.body);
          done(err);
        });
    });

    it('should not create a user with an existing username', done => {
      chai
        .request(server)
        .post(baseUrl)
        .send({
          username: 'Uche',
          email: faker.internet.email(),
          password: 'jakejake'
        })
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors[0]).to.contain('already exists');
          expect(res.body);
          done(err);
        });
    });

    it('should not create a user with an invalid email', done => {
      chai
        .request(server)
        .post(baseUrl)
        .send({
          username: faker.internet.userName(),
          email: 'invalid email',
          password: 'jakejake'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors).to.haveOwnProperty('email');
          expect(res.body);
          done(err);
        });
    });

    it('should not create a user with a password of length less than 8', done => {
      chai
        .request(server)
        .post(baseUrl)
        .send({
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: 'short'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors).to.haveOwnProperty('password');
          expect(res.body);
          done(err);
        });
    });

    it('should not create a user with a non-alphanumeric password', done => {
      chai
        .request(server)
        .post(baseUrl)
        .send({
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: '!&@*@(@)!)!'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors).to.haveOwnProperty('password');
          expect(res.body);
          done(err);
        });
    });
  });
});
