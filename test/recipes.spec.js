import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import db from '../server/models';
import { generateToken } from '../server/utils/helpers';
import { recipe, recipeTestUser } from './fixtures';

chai.use(chaiHttp);

const runtimeFixture = {};

describe('Recipes', () => {
  describe('POST /api/recipes', () => {
    before(() =>
      chai
        .request(server)
        .post('/api/users')
        .send(recipeTestUser)
        .then(res => {
          const { token } = res.body.user;
          runtimeFixture.token = token;
        })
    );
    const baseUrl = '/api/recipes';
    it('should create new recipe when token is provided', done => {
      chai
        .request(server)
        .post(baseUrl)
        .set({ authorization: runtimeFixture.token })
        .send(recipe)
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(201);
          expect(body.recipe).to.be.an('object');
          expect(body.recipe.id).to.be.a('number');
          expect(body.recipe.title).to.equal(recipe.title);
          expect(body.recipe.ingredients).to.include(recipe.ingredients[0]);
          expect(body.recipe.cookingTime).to.equal(recipe.cookingTime);
          expect(body.recipe.slug).to.not.equal(
            `how-to-prepare-your-finest-recipe`
          );
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
        .set({ authorization: runtimeFixture.token })
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
        .set({ authorization: runtimeFixture.token })
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
        .set({ authorization: runtimeFixture.token })
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
        .set({ authorization: runtimeFixture.token })
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
        .set({ authorization: runtimeFixture.token })
        .send({ ...recipe, preparationTime: undefined })
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(400);
          expect(body.errors).to.haveOwnProperty('preparationTime');
          done(err);
        });
    });
  });

  describe('GET /api/recipes', () => {
    before(async () => {
      await db.Recipe.destroy({ truncate: true, cascade: true });
    });

    describe('Fetching before create', () => {
      it('Get all should return empty array and message when no recipes exist', done => {
        chai
          .request(server)
          .get('/api/recipes')
          .end((err, res) => {
            const {
              body,
              body: { recipes, message }
            } = res;
            expect(res).to.have.status(200);
            expect(body).to.be.an('object');
            expect(recipes)
              .to.be.an('array')
              .that.has.lengthOf(0);
            expect(message)
              .to.be.a('string')
              .that.eqls('no recipes have been created');
            done(err);
          });
      });
    });

    describe('Fetch created recipe', () => {
      before(done => {
        chai
          .request(server)
          .post('/api/recipes')
          .set({ authorization: runtimeFixture.token })
          .send(recipe)
          .end(err => {
            done(err);
          });
      });

      it('should return array of recipes when recipes exist', done => {
        chai
          .request(server)
          .get('/api/recipes')
          .end((err, res) => {
            const {
              body,
              body: { recipes }
            } = res;

            expect(res).to.have.status(200);
            expect(body).to.be.an('object');
            expect(recipes)
              .to.be.an('array')
              .that.has.length.greaterThan(0);
            done(err);
          });
      });
    });
  });

  describe('GET api/recipes/:slug', () => {
    before(async () => {
      await db.Recipe.destroy({ truncate: true, cascade: true });
    });

    describe('Fetching before create', () => {
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

    describe('Fetch created recipe by slug', () => {
      before(done => {
        chai
          .request(server)
          .post('/api/recipes')
          .set({ authorization: runtimeFixture.token })
          .send(recipe)
          .end((err, res) => {
            const {
              body: {
                recipe: { slug }
              }
            } = res;
            runtimeFixture.slug = slug;
            done(err);
          });
      });

      it('Should get recipe by slug', done => {
        chai
          .request(server)
          .get(`/api/recipes/${runtimeFixture.slug}`)
          .end((err, res) => {
            const { body } = res;
            expect(res).to.have.status(200);
            expect(body).to.be.an('object');
            expect(body.recipe).to.be.an('object');
            done(err);
          });
      });
    });
  });

  describe('PUT api/recipes/:slug', () => {
    it('should update recipe', done => {
      chai
        .request(server)
        .put(`/api/recipes/${runtimeFixture.slug}`)
        .set({ authorization: runtimeFixture.token })
        .send({ title: 'amazing recipe new name', preparationTime: 5000 })
        .end((err, res) => {
          const {
            body,
            body: {
              recipe: { slug }
            }
          } = res;

          expect(res).to.have.status(200);
          expect(body.recipe).to.be.an('object');
          expect(body.recipe.id).to.be.a('number');
          expect(body.recipe.preparationTime).to.equal(5000);
          expect(slug).to.not.equal(runtimeFixture.slug);
          runtimeFixture.updatedSlug = slug;
          done(err);
        });
    });

    it('should return an error if recipe does not exist', done => {
      chai
        .request(server)
        .put(`/api/recipes/not-a-recipe`)
        .set({ authorization: runtimeFixture.token })
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });

    it('should return an error if user does not exist', done => {
      chai
        .request(server)
        .put(`/api/recipes/${runtimeFixture.updatedSlug}`)
        .set({ authorization: generateToken({ id: 1000 }) })
        .send({ preparationTime: 5000 })
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });

    it('should return an error if field value invalid', done => {
      chai
        .request(server)
        .put(`/api/recipes/${runtimeFixture.updatedSlug}`)
        .set({ authorization: runtimeFixture.token })
        .send({ preparationTime: 'time' })
        .end((err, res) => {
          expect(res).to.have.status(500);
          done(err);
        });
    });
  });

  describe('DELETE /recipes/:slug', () => {
    it('should return an error if user does not exist', done => {
      chai
        .request(server)
        .delete(`/api/recipes/${runtimeFixture.updatedSlug}`)
        .set({ authorization: generateToken({ id: 1000 }) })
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });

    it('should delete recipe', done => {
      chai
        .request(server)
        .delete(`/api/recipes/${runtimeFixture.updatedSlug}`)
        .set({ authorization: runtimeFixture.token })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done(err);
        });
    });
    it('should return an error if recipe does not exist', done => {
      chai
        .request(server)
        .delete(`/api/recipes/not-a-recipe`)
        .set({ authorization: runtimeFixture.token })
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });
  });
});
