import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import env from './env-config';
import { MockStrategy } from '../utils/mockStrategy';
import { socialAuthCallback } from '../utils/helpers';
import db from '../models';

const { User } = db;

const setUpPassport = () => {
  passport.use(
    env.NODE_ENV === 'test'
      ? new MockStrategy('google', socialAuthCallback)
      : new GoogleStrategy(
          {
            clientID: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/api/auth/google/callback'
          },
          socialAuthCallback
        )
  );

  passport.use(
    env.NODE_ENV === 'test'
      ? new MockStrategy('facebook', socialAuthCallback)
      : new FacebookStrategy(
          {
            clientID: env.FACEBOOK_CLIENT_ID,
            clientSecret: env.FACEBOOK_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
            profileFields: ['id', 'name', 'displayName', 'email', 'photos']
          },
          socialAuthCallback
        )
  );

  passport.use(
    env.NODE_ENV === 'test'
      ? new MockStrategy('twitter', socialAuthCallback)
      : new TwitterStrategy(
          {
            consumerKey: env.TWITTER_CONSUMER_KEY,
            consumerSecret: env.TWITTER_CONSUMER_SECRET,
            callbackURL: 'http://localhost:3000/api/auth/twitter/callback',
            userProfileURL:
              'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
            includeEmail: true,
            includeName: true
          },
          socialAuthCallback
        )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => done(null, user))
      .catch(done);
  });
};

export default setUpPassport;
