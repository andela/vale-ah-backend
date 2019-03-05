import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';

chai.use(chaiHttp);

describe('Authentication', () => {
  describe('POST /api/users', () => {
    it('should register a user', (done) => {
      chai.request(server).post('/api/users').send({
        user: {
          username: 'Skope',
          email: 'skope@jake.jake',
          password: 'jakejake'
        }
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
  });
});
