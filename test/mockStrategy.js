/* eslint-disable no-underscore-dangle */
import Passport from 'passport';

const user = {
  id: '354496',
  displayName: 'Jason Boxman',
  emails: [{ value: 'jasonb@edseek.com' }],
  photos: [{ value: 'https://idnbdjfbdjfhdf.googleusecontent.com' }],
  provider: 'mock'
};

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
    this._user = user;
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

export { MockStrategy, user };
