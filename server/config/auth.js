import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import env from './env-config';
import { socialAuthCallback } from '../utils/helpers';
import db from '../models';

const { User } = db;

const setUpPassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${env.GOOGLE_CALLBACK}`
      },
      socialAuthCallback
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: env.FACEBOOK_CLIENT_ID,
        clientSecret: env.FACEBOOK_CLIENT_SECRET,
        callbackURL: `${env.FACEBOOK_CALLBACK}`,
        profileFields: ['id', 'name', 'displayName', 'email', 'photos']
      },
      socialAuthCallback
    )
  );

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: env.TWITTER_CONSUMER_KEY,
        consumerSecret: env.TWITTER_CONSUMER_SECRET,
        callbackURL: `${env.TWITTER_CALLBACK}`,
        userProfileURL:
          'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
        includeEmail: true,
        includeName: true
      },
      socialAuthCallback
    )
  );
};

const setUpSerialize = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => done(null, user))
      .catch(done);
  });
};

export { setUpPassport, setUpSerialize };
