/* eslint-disable no-underscore-dangle */
import Passport from 'passport';
import { randomSocialUser } from './fixtures';

/**
 * MockStrategy Class
 */
class MockStrategy extends Passport.Strategy {
  /**
   * @param {*} name
   * @param {*} callback
   */
  constructor(name, callback) {
    super(name, callback);
    this.name = name;
    this._cb = callback;
    this._user = randomSocialUser;
  }

  /**
   * @memberof MockStrategy
   * @returns {undefined}
   */
  authenticate() {
    this._cb(null, null, this._user, (error, passedUser) => {
      this.success(passedUser);
    });
  }
}

export { MockStrategy, randomSocialUser };
