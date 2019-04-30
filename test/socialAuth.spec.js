import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import passport from 'passport';
import server from '../server';
import { MockStrategy, randomSocialUser } from './mockStrategy';
import { userWithNoEmail } from './fixtures';
import { socialAuthCallback } from '../server/utils/helpers';

chai.use(chaiHttp);

describe('GET Social Authentication', () => {
  describe('GET Social Auth Callback', () => {
    it('should save a twitter user to database', done => {
      const app = chai.request(server).keepOpen();
      app
        .get('/api/auth/twitter/callback', socialAuthCallback, randomSocialUser)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            expect(res.redirects.length).to.equal(1);
            expect(res.redirects[0].includes('/api/auth?token=')).to.equal(
              true
            );
            const token = res.redirects[0].split('token=')[1];
            app
              .get('/api/user')
              .set('authorization', token)
              .end((secondErr, secondRes) => {
                const { user } = secondRes.body;
                expect(user.username).to.equal(randomSocialUser.displayName);
                expect(user.email).to.equal(randomSocialUser.emails[0].value);
                expect(user.image).to.equal(randomSocialUser.photos[0].value);
                expect(user.socialProvider).to.equal('twitter');
                done(secondErr);
              });
          }
        });
    });

    it('should save a facebook user to database', done => {
      const app = chai.request(server).keepOpen();
      app
        .get(
          '/api/auth/facebook/callback',
          socialAuthCallback,
          randomSocialUser
        )
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            expect(res.redirects.length).to.equal(1);
            expect(res.redirects[0].includes('/api/auth?token=')).to.equal(
              true
            );
            const token = res.redirects[0].split('token=')[1];
            app
              .get('/api/user')
              .set('authorization', token)
              .end((secondErr, secondRes) => {
                const { user } = secondRes.body;
                expect(user.username).to.equal(randomSocialUser.displayName);
                expect(user.email).to.equal(randomSocialUser.emails[0].value);
                expect(user.image).to.equal(randomSocialUser.photos[0].value);
                expect(user.provider).to.equal(randomSocialUser.socialProvider);
                done(secondErr);
              });
          }
        });
    });

    it('should save a google user to database', done => {
      const app = chai.request(server).keepOpen();
      app
        .get('/api/auth/google/callback', socialAuthCallback, randomSocialUser)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            expect(res.redirects.length).to.equal(1);
            expect(res.redirects[0].includes('/api/auth?token=')).to.equal(
              true
            );
            const token = res.redirects[0].split('token=')[1];
            app
              .get('/api/user')
              .set({ authorization: token })
              .end((secondErr, secondRes) => {
                const { user } = secondRes.body;
                expect(user.username).to.equal(randomSocialUser.displayName);
                expect(user.email).to.equal(randomSocialUser.emails[0].value);
                expect(user.image).to.equal(randomSocialUser.photos[0].value);
                expect(user.provider).to.equal(randomSocialUser.socialProvider);
                done(secondErr);
              });
          }
        });
    });

    it('should return an error if no email is present', done => {
      passport.use(
        new MockStrategy('facebook', socialAuthCallback, userWithNoEmail)
      );
      chai
        .request(server)
        .get('/api/auth/facebook/callback')
        .end((err, res) => {
          expect(res.body.errors[0]).to.equal('No email found. Add email');
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
