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
      await db.Recipe.destroy({ truncate: true });
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
            expect(message).to.be.a('string');
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
      await db.Recipe.destroy({ truncate: true });
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

  describe('Pagination', () => {
    const url = '/api/recipes';
    let items;
    before(async () => {
      const array = Array(50)
        .fill()
        .map(() => {
          return chai
            .request(server)
            .post('/api/recipes')
            .set({ authorization: runtimeFixture.token })
            .send(recipe);
        });
      await Promise.all(array);
    });

    it('should get all recipes when no page or limit is set', done => {
      chai
        .request(server)
        .get(url)
        .end((err, res) => {
          const { recipes } = res.body;
          items = recipes;
          expect(res).to.have.status(200);
          expect(recipes)
            .to.be.an('Array')
            .and.to.have.lengthOf.at.least(50);
          done(err);
        });
    });

    it('should get the first 30 recipes when limit is 30 but page is not set', done => {
      chai
        .request(server)
        .get(`${url}?limit=30`)
        .end((err, res) => {
          const { recipes } = res.body;
          expect(res).to.have.status(200);
          expect(recipes)
            .to.be.an('Array')
            .and.has.lengthOf(30);
          expect(recipes[0].id).to.equal(items[0].id);
          done(err);
        });
    });

    it('should get the second set of 10 recipes when page is 2 and no limit is set', done => {
      chai
        .request(server)
        .get(`${url}?page=2`)
        .end((err, res) => {
          const { recipes } = res.body;
          expect(res).to.have.status(200);
          expect(recipes).to.be.an('Array');
          expect(recipes.length).to.equal(10);
          expect(recipes[0].id).to.not.equal(items[0].id);
          done(err);
        });
    });

    it('should get the second set of 25 recipes when page is 2 and limit is 25', done => {
      chai
        .request(server)
        .get(`${url}?page=2&limit=25`)
        .end((err, res) => {
          const { recipes } = res.body;
          expect(res).to.have.status(200);
          expect(recipes).to.be.an('Array');
          expect(recipes.length).to.equal(25);
          expect(recipes[0].id).to.not.equal(items[0].id);
          done(err);
        });
    });

    it('should not get recipes if page or limit is a negative number', done => {
      chai
        .request(server)
        .get(`${url}?page=-1&limit=-1`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors).to.haveOwnProperty('page');
          expect(res.body.errors).to.haveOwnProperty('limit');
          done(err);
        });
    });

    it('should not get recipes if page or limit is zero', done => {
      chai
        .request(server)
        .get(`${url}?page=0&limit=0`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors).to.haveOwnProperty('page');
          expect(res.body.errors).to.haveOwnProperty('limit');
          done(err);
        });
    });

    it('should not get recipes if page or limit is not an integer', done => {
      chai
        .request(server)
        .get(`${url}?page=text&limit=text`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors).to.haveOwnProperty('page');
          expect(res.body.errors).to.haveOwnProperty('limit');
          done(err);
        });
    });
  });
});
