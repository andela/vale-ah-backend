import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import server from '../server';
import { generateToken } from '../server/utils/helpers';
import generateRandomUser from './mockdata/mock';

chai.use(chaiHttp);
const user1 = generateRandomUser();
const { username, password, email } = generateRandomUser();

describe('Authentication', () => {
  const tokenPayload = {};
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
          tokenPayload.id = user.id;
          tokenPayload.username = user.username;
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
          done(err);
        });
    });

    it('should not create a user with an invalid email', done => {
      chai
        .request(server)
        .post(baseUrl)
        .send({
          username,
          email: 'invalid email',
          password
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors).to.haveOwnProperty('email');
          done(err);
        });
    });

    it('should not create a user with a password of length less than 8', done => {
      chai
        .request(server)
        .post(baseUrl)
        .send({
          username,
          email,
          password: 'short'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors).to.haveOwnProperty('password');
          done(err);
        });
    });

    it('should not create a user with a non-alphanumeric password', done => {
      chai
        .request(server)
        .post(baseUrl)
        .send({
          username,
          email,
          password: '!&@*@(@)!)!'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors).to.haveOwnProperty('password');
          done(err);
        });
    });
  });

  describe('GET /api/users?token', () => {
    const baseUrl = '/api/users/verify';

    it('should return error if verification token is not provided', done => {
      chai
        .request(server)
        .get(`${baseUrl}`)
        .end((err, res) => {
          const {
            body: { errors }
          } = res;
          const [errorMessage] = errors;

          expect(res).to.have.status(400);
          expect(errors).to.be.an.instanceOf(Array);
          expect(typeof errorMessage).eqls('string');
          expect(errorMessage).eqls('Invalid token, verification unsuccessful');
          done(err);
        });
    });

    it('should return error if verification token is invalid', done => {
      chai
        .request(server)
        .get(`${baseUrl}?token=${generateToken(tokenPayload)}xxr`)
        .end((err, res) => {
          const {
            body: { errors }
          } = res;
          const [errorMessage] = errors;

          expect(res).to.have.status(400);
          expect(errors).to.be.an.instanceOf(Array);
          expect(typeof errorMessage).eqls('string');
          expect(errorMessage).eqls('Invalid token, verification unsuccessful');
        });

      chai
        .request(server)
        .get(`${baseUrl}?token=io.fjf.tir`)
        .end((err, res) => {
          const {
            body: { errors }
          } = res;
          const [errorMessage] = errors;

          expect(res).to.have.status(400);
          expect(errors).to.be.an.instanceOf(Array);
          expect(typeof errorMessage).eqls('string');
          expect(errorMessage).eqls('Invalid token, verification unsuccessful');
          done(err);
        });
    });

    it('should return error response when user to be verify not found', done => {
      chai
        .request(server)
        .get(`${baseUrl}?token=${generateToken({ id: 7 })}`)
        .end((err, res) => {
          const {
            body: { errors }
          } = res;
          const [errorMessage] = errors;

          expect(res).to.have.status(400);
          expect(errors).to.be.an.instanceOf(Array);
          expect(typeof errorMessage).eqls('string');
          expect(errorMessage).eqls('no user found to verify');
          done(err);
        });
    });

    it('should return true if a user is verified', done => {
      chai
        .request(server)
        .get(`${baseUrl}?token=${generateToken(tokenPayload)}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.verified).to.equal(true);
          done(err);
        });
    });
  });

  describe('POST /api/users/login', () => {
    it('should Login user with right credentials', done => {
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
          username,
          email,
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
    return chai
      .request(server)
      .post('/api/users/login')
      .send({ email: user1.email, password: user1.password })
      .then(res => {
        loggedInUser = res.body.user;
      });
  });
  it('should update profile', done => {
    chai
      .request(server)
      .put('/api/user')
      .send({
        bio: `something interesting`,
        image: 'https://mailer.com',
        password: 'weaksauce45rty'
      })
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

  it('should return an error if validation fails', done => {
    chai
      .request(server)
      .put('/api/user')
      .send({
        bio: 345678976543567
      })
      .set({ authorization: loggedInUser.token })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done(err);
      });
  });

  it('should return an error when user does not exist', done => {
    chai
      .request(server)
      .put('/api/user')
      .send({ bio: `something interesting`, image: 'https://mailer.com' })
      .set({ authorization: generateToken({ id: 1000 }) })
      .end((err, res) => {
        expect(res).to.have.status(404);
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
        done(err);
      });
  });

  it('should update with previous data if no change was made', done => {
    chai
      .request(server)
      .put('/api/user')
      .send({ email: faker.internet.email() })
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

  it('should return an error if no token', done => {
    chai
      .request(server)
      .get('/api/user')
      .set({ authorization: generateToken({ id: 1000 }) })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done(err);
      });
  });

  it('should get All profiles', done => {
    chai
      .request(server)
      .get('/api/profiles')
      .set({ authorization: loggedInUser.token })
      .end((err, res) => {
        const { user } = res.body;
        expect(res).to.have.status(200);
        expect(user).to.be.an('array');
        expect(user[0].id).to.be.a('number');
        done(err);
      });
  });

  it('should return an error if token is invalid', done => {
    chai
      .request(server)
      .get('/api/profiles')
      .set({ authorization: generateToken({ id: 1000 }) })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done(err);
      });
  });

  it('should get profile of a specific user', done => {
    chai
      .request(server)
      .get(`/api/profiles/${user1.username}`)
      .set({ authorization: loggedInUser.token })
      .end((err, res) => {
        const { user } = res.body;
        expect(res).to.have.status(200);
        expect(user).to.be.an('object');
        expect(user.id).to.be.a('number');
        expect(user).to.have.property('verified');
        expect(user).to.have.property('createdAt');
        expect(user).to.have.property('updatedAt');
        done(err);
      });
  });

  it('should return an error if profile is not found', done => {
    chai
      .request(server)
      .get(`/api/profiles/andela`)
      .set({ authorization: loggedInUser.token })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done(err);
      });
  });

  it('should return an error if token was not provided', done => {
    chai
      .request(server)
      .get('/api/profiles')
      .end((err, res) => {
        expect(res).to.have.status(400);
        done(err);
      });
  });

  it('should update password', done => {
    const newPassword = '2345678989';
    const oldPassword = user1.password;

    chai
      .request(server)
      .put('/api/user/password')
      .set({ authorization: loggedInUser.token })
      .send({ newPassword, oldPassword })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done(err);
      });
  });

  it('should return an error if password does not match', done => {
    const newPassword = '2345678989';
    const oldPassword = faker.random.alphaNumeric(10);

    chai
      .request(server)
      .put('/api/user/password')
      .set({ authorization: loggedInUser.token })
      .send({ newPassword, oldPassword })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done(err);
      });
  });

  it('should return an error if no token', done => {
    const newPassword = '2345678989';
    const oldPassword = faker.random.alphaNumeric(10);

    chai
      .request(server)
      .put('/api/user/password')
      .send({ newPassword, oldPassword })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done(err);
      });
  });

  it('should return an error if token is not valid', done => {
    const newPassword = '2345678989';
    const oldPassword = faker.random.alphaNumeric(10);

    chai
      .request(server)
      .put('/api/user/password')
      .set({ authorization: 'what ever happens' })
      .send({ newPassword, oldPassword })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done(err);
      });
  });

  it('should return an error if user does not exist', done => {
    const newPassword = '2345678989';
    const oldPassword = faker.random.alphaNumeric(10);
    chai
      .request(server)
      .put('/api/user/password')
      .set({
        authorization: generateToken({ id: 50 })
      })
      .send({ newPassword, oldPassword })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done(err);
      });
  });
});
