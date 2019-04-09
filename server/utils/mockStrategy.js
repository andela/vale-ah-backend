/* eslint-disable no-underscore-dangle */
import Passport from 'passport';
import faker from 'faker';

const randomSocialUser = {
  id: faker.random.number(),
  displayName: faker.random.alphaNumeric(10),
  emails: [{ value: faker.internet.email() }],
  photos: [{ value: faker.image.image() }]
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
    this._user = { ...randomSocialUser, provider: name };
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
