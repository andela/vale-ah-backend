import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import { generateToken } from '../server/utils/helpers';

chai.use(chaiHttp);
const recipe = {
  title: 'How to prepare this nonsense',
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

const token = generateToken({ id: 1, username: 'daniel' });
describe('Recipes reaction ', () => {
  let slug;
  before(async () => {
    const recipeCreated = await chai
      .request(server)
      .post('/api/recipes')
      .set({ authorization: token })
      .send(recipe);

    // eslint-disable-next-line prefer-destructuring
    slug = recipeCreated.body.recipe.slug;
  });
  const baseUrl = '/api/recipes';

  describe('Rating', () => {
    it('should return an error if the recipe is not found', done => {
      chai
        .request(server)
        .post(`${baseUrl}/${slug}-hello/rating`)
        .set({ authorization: token })
        .end((err, res) => {
          expect(res).to.have.status(500);
          done(err);
        });
    });

    it('should be able to rate a recipe with valid details', done => {
      chai
        .request(server)
        .post(`${baseUrl}/${slug}/rating`)
        .set({ authorization: token })
        .send({ score: 1 })
        .end((err, res) => {
          expect(res).to.have.status(201);
          done(err);
        });
    });

    it('should be able to update the rate score with valid details', done => {
      chai
        .request(server)
        .post(`${baseUrl}/${slug}/rating`)
        .set({ authorization: token })
        .send({ score: 2 })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done(err);
        });
    });

    it('should not be able to update the rate score with invalid details', done => {
      chai
        .request(server)
        .post(`${baseUrl}/${slug}/rating`)
        .set({ authorization: token })
        .send({ score: 8 })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done(err);
        });
    });

    it('should  not be able to update the rate score if not loggedin/invalid token', done => {
      chai
        .request(server)
        .post(`${baseUrl}/${slug}/rating`)
        .set({ authorization: `${token}.hello` })
        .send({ score: 2 })
        .end((err, res) => {
          expect(res).to.have.status(401);
          done(err);
        });
    });
  });
});
