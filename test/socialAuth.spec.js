import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import { randomSocialUser } from './mockStrategy';

chai.use(chaiHttp);

describe('GET Social Authentication', () => {
  describe('GET Social Auth Callback', () => {
    it('should save a twitter user to database', done => {
      chai
        .request(server)
        .get('/api/auth/twitter/callback')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.username).to.equal(randomSocialUser.displayName);
          expect(res.body.email).to.equal(randomSocialUser.emails[0].value);
          expect(res.body.image).to.equal(randomSocialUser.photos[0].value);
          expect(res.body.socialProvider).to.equal('twitter');
          done(err);
        });
    });

    it('should save a facebook user to database', done => {
      chai
        .request(server)
        .get('/api/auth/facebook/callback')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.username).to.equal(randomSocialUser.displayName);
          expect(res.body.email).to.equal(randomSocialUser.emails[0].value);
          expect(res.body.image).to.equal(randomSocialUser.photos[0].value);
          expect(res.body.socialProvider).to.equal('facebook');
          done(err);
        });
    });

    it('should save a google user to database', done => {
      chai
        .request(server)
        .get('/api/auth/google/callback')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.username).to.equal(randomSocialUser.displayName);
          expect(res.body.email).to.equal(randomSocialUser.emails[0].value);
          expect(res.body.image).to.equal(randomSocialUser.photos[0].value);
          expect(res.body.socialProvider).to.equal('google');
          done(err);
        });
    });

    describe('verify userInfo', () => {
      const verifysocialAuthCallback = {
        accessToken: 'randomaccesstoken',
        refreshToken: undefined,
        profile: {
          id: 1256,
          emails: [{ value: randomSocialUser.emails[0] }]
        }
      };
      it('should verify a google user', () => {
        const googleUserInfo = (verifysocialAuthCallback.accessToken,
        verifysocialAuthCallback.refreshToken,
        { ...verifysocialAuthCallback.profile, provider: 'google' });
        expect(googleUserInfo).to.be.an('object');
        expect(googleUserInfo.id).to.a('number');
        expect(googleUserInfo.emails).to.be.an('array');
        expect(googleUserInfo.provider).to.equal('google');
      });

      it('should verify a facebook user', () => {
        const facebookUserInfo = (verifysocialAuthCallback.accessToken,
        verifysocialAuthCallback.refreshToken,
        { ...verifysocialAuthCallback.profile, provider: 'facebook' });
        expect(facebookUserInfo).to.be.an('object');
        expect(facebookUserInfo.id).to.a('number');
        expect(facebookUserInfo.emails).to.be.an('array');
        expect(facebookUserInfo.provider).to.equal('facebook');
      });

      it('should verify a twitter user', () => {
        const twitterUserInfo = (verifysocialAuthCallback.accessToken,
        verifysocialAuthCallback.refreshToken,
        { ...verifysocialAuthCallback.profile, provider: 'twitter' });
        expect(twitterUserInfo).to.be.an('object');
        expect(twitterUserInfo.id).to.a('number');
        expect(twitterUserInfo.emails).to.be.an('array');
        expect(twitterUserInfo.provider).to.equal('twitter');
      });
    });
  });
});
