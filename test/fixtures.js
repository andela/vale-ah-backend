import faker from 'faker';

export const recipe = {
  title: 'How to prepare your finest recipe',
  ingredients: ['A spoon of awesomeness', 'A cup of dedication'],
  steps: {
    '1': {
      description: 'Add a spoon of awesomeness to the mixer',
      images: ['https://i.stack.imgur.com/xHWG8.jpg']
    },
    '2': {
      description: 'Add a spoon of awesomeness to the mixer',
      images: ['https://i.stack.imgur.com/xHWG8.jpg']
    }
  },
  cookingTime: 1000,
  preparationTime: 3000
};

export const recipeTestUser = {
  username: 'Jacob',
  email: 'jake@jake.jake',
  password: 'jakejake'
};

export const commentTestUser = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.random.alphaNumeric(10)
};

export const userEmailValue = {
  email: faker.internet.email()
};

export const comment = {
  body: faker.lorem.text()
};

/**
 * generate random user details
 * @return {object} random user
 */
export const generateRandomUser = () => ({
  username: faker.random.alphaNumeric(10),
  email: faker.internet.email(),
  password: faker.random.alphaNumeric(10)
});
