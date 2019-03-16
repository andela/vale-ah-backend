import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import { generateToken } from '../server/utils/helpers';

chai.use(chaiHttp);

const recipe = {
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
describe('Recipes', () => {
  let token;
  let token2;
  let createdRecipe;
  before(done => {
    chai
      .request(server)
      .post('/api/users')
      .send({
        username: 'Jacob',
        email: 'jake@jake.jake',
        password: 'jakejake'
      })
      .end((err, res) => {
        const { token: userToken } = res.body.user;
        token = userToken;
      });

    chai
      .request(server)
      .post('/api/users')
      .send({
        username: 'Jacob2',
        email: 'jake2@jake.jake',
        password: 'jakejake'
      })
      .end((err, res) => {
        const { token: userToken } = res.body.user;
        token2 = userToken;
        done(err);
      });
  });
  const baseUrl = '/api/recipes';
  describe('Create New Recipe', () => {
    it('should create new recipe when token is provided', done => {
      chai
        .request(server)
        .post(baseUrl)
        .set({ authorization: `Bearer ${token}` })
        .send(recipe)
        .end((err, res) => {
          const { body } = res;
          createdRecipe = body.recipe;
          expect(res).to.have.status(201);
          expect(body.recipe).to.be.an('object');
          expect(body.recipe.id).to.be.a('number');
          expect(body.recipe.title).to.equal(recipe.title);
          expect(body.recipe.slug).to.equal(
            'how-to-prepare-your-finest-recipe'
          );
          expect(body.recipe.ingredients).to.include(recipe.ingredients[0]);
          expect(body.recipe.cookingTime).to.equal(recipe.cookingTime);
          done(err);
        });
    });

    it('should not create recipe when the user does not exist', done => {
      chai
        .request(server)
        .post(baseUrl)
        .set({ authorization: `Bearer ${generateToken({ id: 1000 })}` })
        .send(recipe)
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(401);
          expect(body.errors).to.be.an('Array');
          done(err);
        });
    });

    it('should not create recipe when title is not provided', done => {
      chai
        .request(server)
        .post(baseUrl)
        .set({ authorization: `Bearer ${token}` })
        .send({ ...recipe, title: undefined })
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(400);
          expect(body.errors.title).to.be.an('array');
          done(err);
        });
    });

    it('should not create recipe when ingredient is not provided', done => {
      chai
        .request(server)
        .post(baseUrl)
        .set({ authorization: `Bearer ${token}` })
        .send({ ...recipe, ingredients: undefined })
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(400);
          expect(body.errors.ingredients).to.be.an('array');
          done(err);
        });
    });

    it('should not create recipe when steps are not provided', done => {
      chai
        .request(server)
        .post(baseUrl)
        .set({ authorization: `Bearer ${token}` })
        .send({ ...recipe, steps: undefined })
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(400);
          expect(body.errors).to.haveOwnProperty('steps');
          done(err);
        });
    });

    it('should not create recipe when cookingTime is not valid', done => {
      chai
        .request(server)
        .post(baseUrl)
        .set({ authorization: `Bearer ${token}` })
        .send({ ...recipe, cookingTime: undefined })
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(400);
          expect(body.errors).to.haveOwnProperty('cookingTime');
          done(err);
        });
    });

    it('should not create recipe when preparationTime is not valid', done => {
      chai
        .request(server)
        .post(baseUrl)
        .set({ authorization: `Bearer ${token}` })
        .send({ ...recipe, preparationTime: undefined })
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(400);
          expect(body.errors).to.haveOwnProperty('preparationTime');
          done(err);
        });
    });
  });
  describe('Tagging', () => {
    it('should tag a recipe', done => {
      chai
        .request(server)
        .put(`${baseUrl}/${createdRecipe.slug}/tags`)
        .set({ authorization: `Bearer ${token}` })
        .send({ tags: ['recipe', 'finest', 'Recipe'] })
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(200);
          expect(body.recipe.tags)
            .to.be.an('array')
            .and.to.have.lengthOf(2)
            .and.to.contain('finest');
          done(err);
        });
    });

    it('should not tag a recipe if the tag list is invalid', done => {
      chai
        .request(server)
        .put(`${baseUrl}/${createdRecipe.slug}/tags`)
        .set({ authorization: `Bearer ${token}` })
        .send({ tags: [1, 'finest', 'Recipe'] })
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(400);
          expect(body.errors).to.be.an('object');
          done(err);
        });
    });

    it('should not tag a recipe if the user is not logged in', done => {
      chai
        .request(server)
        .put(`${baseUrl}/${createdRecipe.slug}/tags`)
        .send({ tags: ['delicious', 'soup', 'swallow'] })
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(401);
          expect(body.errors).to.be.an('array');
          done(err);
        });
    });

    it('should not tag a recipe if the user is not the owner of the recipe', done => {
      chai
        .request(server)
        .put(`${baseUrl}/${createdRecipe.slug}/tags`)
        .set({ authorization: `Bearer ${token2}` })
        .send({ tags: ['delicious', 'soup', 'swallow'] })
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(403);
          expect(body.errors).to.be.an('array');
          done(err);
        });
    });
  });
});
