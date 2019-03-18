import faker from 'faker';

/**
 * @function MockData
 * @return {object} user
 */
export default function mockData() {
  return {
    username: faker.random.alphaNumeric(10),
    email: faker.internet.email(),
    password: faker.random.alphaNumeric(10)
  };
}
