import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';

chai.use(chaiHttp);

describe('GET Social Authentication', () => {
  it('should successfully register a user with Google', done => {
    chai
      .request(server)
      .get('/api/auth/login/google')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should successfully register a user with Facebook', done => {
    chai
      .request(server)
      .get('/api/auth/login/facebook')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should successfully register a user with Twitter', done => {
    chai
      .request(server)
      .get('/api/auth/login/twitter')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.redirects).to.be.an('array');
        done();
      });
  });
});
