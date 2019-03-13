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

describe('Create New Recipe', () => {
  let token;
  before(() =>
    chai
      .request(server)
      .post('/api/users')
      .send({
        username: 'Jacob',
        email: 'jake@jake.jake',
        password: 'jakejake'
      })
      .then(res => {
        const { token: userToken } = res.body.user;
        token = userToken;
      })
  );
  const baseUrl = '/api/recipes';
  it('should post new recipe when token is provided', done => {
    chai
      .request(server)
      .post(baseUrl)
      .set({ authorization: token })
      .send(recipe)
      .end((err, res) => {
        const { body } = res;
        expect(res).to.have.status(201);
        expect(body.recipe).to.be.an('object');
        expect(body.recipe.id).to.be.a('number');
        expect(body.recipe.title).to.equal(recipe.title);
        expect(body.recipe.ingredients).to.include(recipe.ingredients[0]);
        expect(body.recipe.cookingTime).to.equal(recipe.cookingTime);
        done(err);
      });
  });

  it('should not post recipe when token is not provided', done => {
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

  it('should not post recipe when title is not provided', done => {
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

  it('should not post recipe when ingredient is not provided', done => {
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

  it('should not post recipe when steps are not provided', done => {
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

  it('should not post recipe when cookingTime is not valid', done => {
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

  it('should not post recipe when preparationTime is not valid', done => {
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
});
