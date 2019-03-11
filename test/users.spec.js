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

    it('should return error response when user to verify not found', done => {
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

  it('should return an error of validation fails', done => {
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

  it('should return an error when there is none existent user', done => {
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

  it('should return an error if wrong token ', done => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJiZXR0eSIsImlhdCI6MTU1MjE5NjQyNywiZXhwIjoxNTUyODAxMjI3fQ.JoNbTRM39TelJ0PvL09EHROEnDmN0a-jkCVS02y';
    chai
      .request(server)
      .get('/api/profiles')
      .set({ authorization: token })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done(err);
      });
  });
});
