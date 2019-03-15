import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import { generateToken } from '../server/utils/helpers';
import { recipe, recipeTestUser } from './fixtures';

chai.use(chaiHttp);

const runtimeFixture = {};

describe('Recipes', () => {
  describe('Fetching before create', () => {
    it('Get all should return empty array and message when no recipes exist', done => {
      chai
        .request(server)
        .get('/api/recipes')
        .end((err, res) => {
          const {
            body,
            body: { recipes }
          } = res;
          expect(body).to.be.an('object');
          expect(recipes)
            .to.be.an('array')
            .that.has.lengthOf(0);
          done(err);
        });
    });

    it('getting non-existent record by slug should return error', done => {
      chai
        .request(server)
        .get('/api/recipes/random-nonexistent-slug')
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });
  });

  let token;
  describe('Create New Recipe', () => {
    let slug;
    before(() =>
      chai
        .request(server)
        .post('/api/users')
        .send(recipeTestUser)
        .then(res => {
          const { token: userToken } = res.body.user;
          token = userToken;
        })
    );
    const baseUrl = '/api/recipes';
    it('should create new recipe when token is provided', done => {
      chai
        .request(server)
        .post(baseUrl)
        .set({ authorization: token })
        .send(recipe)
        .end((err, res) => {
          const { body } = res;
          const { slug: recipeSlug } = body.recipe;
          slug = recipeSlug;
          expect(res).to.have.status(201);
          expect(body.recipe).to.be.an('object');
          expect(body.recipe.id).to.be.a('number');
          expect(body.recipe.title).to.equal(recipe.title);
          expect(body.recipe.ingredients).to.include(recipe.ingredients[0]);
          expect(body.recipe.cookingTime).to.equal(recipe.cookingTime);
          expect(body.recipe.slug).to.equal(
            `how-to-prepare-your-finest-recipe-${body.recipe.id}`
          );
          runtimeFixture.slug = body.recipe.slug;
          done(err);
        });
    });

    it('should not create recipe when token is not provided', done => {
      chai
        .request(server)
        .post(baseUrl)
        .set({ authorization: generateToken({ id: 1000 }) })
        .send(recipe)
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(404);
          expect(body.errors).to.contain('User does not exist');
          done(err);
        });
    });

    it('should not create recipe when title is not provided', done => {
      chai
        .request(server)
        .post(baseUrl)
        .set({ authorization: token })
        .send(Object.assign(recipe, { title: undefined }))
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
        .set({ authorization: token })
        .send(Object.assign(recipe, { ingredients: undefined }))
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
        .set({ authorization: token })
        .send(Object.assign(recipe, { steps: undefined }))
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
        .set({ authorization: token })
        .send(Object.assign(recipe, { cookingTime: undefined }))
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
        .set({ authorization: token })
        .send(Object.assign(recipe, { preparationTime: undefined }))
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(400);
          expect(body.errors).to.haveOwnProperty('preparationTime');
          done(err);
        });
    });

    it('should update recipe', done => {
      chai
        .request(server)
        .put(`${baseUrl}/${slug}`)
        .set({ authorization: token })
        .send({ preparationTime: 5000 })
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(200);
          expect(body.recipe).to.be.an('object');
          expect(body.recipe.id).to.be.a('number');
          expect(body.recipe.preparationTime).to.equal(5000);
          done(err);
        });
    });

    it('should return an error if recipe does not exist', done => {
      chai
        .request(server)
        .put(`${baseUrl}/sometext`)
        .set({ authorization: token })
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });

    it('should return an error if user does not exist', done => {
      chai
        .request(server)
        .put(`${baseUrl}/${slug}`)
        .set({ authorization: generateToken({ id: 1000 }) })
        .send({ preparationTime: 5000 })
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });

    it('should return an error if wrong input string', done => {
      chai
        .request(server)
        .put(`${baseUrl}/${slug}`)
        .set({ authorization: token })
        .send({ preparationTime: 'time' })
        .end((err, res) => {
          expect(res).to.have.status(500);
          done(err);
        });
    });

    it('should delete recipe', done => {
      chai
        .request(server)
        .delete(`${baseUrl}/${slug}`)
        .set({ authorization: token })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done(err);
        });
    });
    it('should return an error if recipe does not exist', done => {
      chai
        .request(server)
        .delete(`${baseUrl}/sometext`)
        .set({ authorization: token })
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });

    it('should return an error if user does not exist', done => {
      chai
        .request(server)
        .delete(`${baseUrl}/${slug}`)
        .set({ authorization: generateToken({ id: 1000 }) })
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });
  });

  describe('Fetching Existing Recipes', () => {
    before(() => {
      chai
        .request(server)
        .post('/api/recipes')
        .set({ authorization: token })
        .send(recipe)
        .end();
    });
    it('"Get all" should return array of recipes', done => {
      chai
        .request(server)
        .get('/api/recipes')
        .end((err, res) => {
          const {
            body,
            body: { recipes }
          } = res;
          expect(body).to.be.an('object');
          expect(recipes)
            .to.be.an('array')
            .that.has.length.greaterThan(0);
          done(err);
        });
    });

    it('Should get recipe by slug', done => {
      chai
        .request(server)
        .get('/api/recipes')
        .end((err, res) => {
          const {
            body,
            body: { recipes }
          } = res;
          expect(body).to.be.an('object');
          expect(recipes)
            .to.be.an('array')
            .that.has.length.greaterThan(0);
          expect(recipes[0]).to.be.an('object');
          done(err);
        });
    });
  });
});
