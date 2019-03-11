import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import server from '../server';
import { generateToken } from '../server/utils/helpers';

chai.use(chaiHttp);

const user1 = {
  username: faker.random.alphaNumeric(10),
  email: faker.internet.email(),
  password: faker.random.alphaNumeric(10)
};
describe('Authentication', () => {
  describe('POST /api/users', () => {
    const baseUrl = '/api/users';
    it('should register a user with valid details', done => {
      chai
        .request(server)
        .post(baseUrl)
        .send(user1)
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
        .send(user1)
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
        .send(user1)
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

  describe('POST /api/users/login', () => {
    it('should Login user with right', done => {
      chai
        .request(server)
        .post('/api/users/login')
        .send(user1)
        .end((err, res) => {
          const { user } = res.body;
          expect(res).to.have.status(200);
          expect(user.id).to.be.a('number');
          expect(user).to.have.property('verified');
          expect(user).to.have.property('createdAt');
          expect(user).to.have.property('updatedAt');
          done(err);
        });
    });

    it('should reject a credential with wrong password', done => {
      chai
        .request(server)
        .post('/api/users/login')
        .send({
          username: user1.username,
          email: user1.email,
          password: '1234'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done(err);
        });
    });

    it('should return an error if no credentials', done => {
      chai
        .request(server)
        .post('/api/users/login')
        .send()
        .end((err, res) => {
          expect(res).to.have.status(400);
          done(err);
        });
    });
  });
});

describe('User', () => {
  let loggedInUser;

  before(() => {
    const { email, password } = user1;
    return chai
      .request(server)
      .post('/api/users/login')
      .send({ email, password })
      .then(res => {
        loggedInUser = res.body.user;
      });
  });
  it('should update profile', done => {
    chai
      .request(server)
      .put('/api/user')
      .send({ bio: `something interesting`, image: 'https://mailer.com' })
      .set({ authorization: loggedInUser.token })
      .end((err, res) => {
        const { user } = res.body;
        expect(res).to.have.status(200);
        expect(user.id).to.be.a('number');
        expect(user).to.have.property('verified');
        expect(user).to.have.property('createdAt');
        expect(user).to.have.property('updatedAt');
        done(err);
      });
  });

  it('should return an error when there is none existent user', done => {
    chai
      .request(server)
      .put('/api/user')
      .send({ bio: `something interesting`, image: 'https://mailer.com' })
      .set({ authorization: generateToken({ id: 1000 }) })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done(err);
      });
  });

  it('should return an error if no token', done => {
    chai
      .request(server)
      .put('/api/user')
      .send(user1)
      .end((err, res) => {
        expect(res).to.have.status(400);
        done(err);
      });
  });

  it('should return a current user', done => {
    chai
      .request(server)
      .get('/api/user')
      .set({ authorization: loggedInUser.token })
      .end((err, res) => {
        const { user } = res.body;
        expect(res).to.have.status(200);
        expect(user.id).to.be.a('number');
        expect(user).to.have.property('verified');
        expect(user).to.have.property('createdAt');
        expect(user).to.have.property('updatedAt');
        done(err);
      });
  });

  it('should return an error if no current user', done => {
    chai
      .request(server)
      .get('/api/user')
      .end((err, res) => {
        expect(res).to.have.status(400);
        done(err);
      });
  });
});
