import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import { user } from './mockStrategy';
import { userEmailValue } from './fixtures';

chai.use(chaiHttp);

describe('GET Social Authentication', () => {
  describe('GET Social Auth Callback', () => {
    it('should save a twitter user to database', done => {
      chai
        .request(server)
        .get('/api/auth/twitter/callback')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.username).to.equal(user.displayName);
          expect(res.body.email).to.equal(user.emails[0].value);
          expect(res.body.image).to.equal(user.photos[0].value);
          done(err);
        });
    });

    it('should save a facebook user to database', done => {
      chai
        .request(server)
        .get('/api/auth/facebook/callback')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.username).to.equal(user.displayName);
          expect(res.body.email).to.equal(user.emails[0].value);
          expect(res.body.image).to.equal(user.photos[0].value);
          done(err);
        });
    });

    it('should save a google user to database', done => {
      chai
        .request(server)
        .get('/api/auth/google/callback')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.username).to.equal(user.displayName);
          expect(res.body.email).to.equal(user.emails[0].value);
          expect(res.body.image).to.equal(user.photos[0].value);
          done(err);
        });
    });

    describe('verify userInfo', () => {
      const verifysocialAuthCallback = {
        accessToken: 'randomaccesstoken',
        refreshToken: undefined,
        profile: {
          id: 1256,
          emails: [{ value: userEmailValue }]
        }
      };
      const googleUserInfo = (verifysocialAuthCallback.accessToken,
      verifysocialAuthCallback.refreshToken,
      verifysocialAuthCallback.profile);
      expect(googleUserInfo).to.be.an('object');
      expect(googleUserInfo.id).to.a('number');
      expect(googleUserInfo.emails).to.be.an('array');
    });
  });
});
