/* eslint-disable no-underscore-dangle */
import passport from 'passport';
import { randomSocialUser } from './fixtures';
import { socialAuthCallback } from '../server/utils/helpers';

/**
 * MockStrategy Class
 */
class MockStrategy extends passport.Strategy {
  /**
   * @param {*} name
   * @param {*} callback
   */
  constructor(name, callback) {
    super(name, callback);
    this.name = name;
    this._cb = callback;
    this._user = { ...randomSocialUser, provider: name };
  }

  /**
   * @memberof MockStrategy
   * @returns {undefined}
   */
  authenticate() {
    this._cb(null, null, this._user, (error, user) => {
      this.success(user);
    });
  }
}

passport.use(new MockStrategy('google', socialAuthCallback));
passport.use(new MockStrategy('facebook', socialAuthCallback));
passport.use(new MockStrategy('twitter', socialAuthCallback));

export { MockStrategy, randomSocialUser };
