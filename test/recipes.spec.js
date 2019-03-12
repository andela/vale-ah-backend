import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';

chai.use(chaiHttp);

const recipe = {
  title: 'How to prepare your finest recipe',
  ingredients: ['A spoon of awesomeness', 'A cup of dedication'],
  steps: {
    '1': {
      description: 'Add a spoon of awesomeness to the mixer',
      images: 'https://i.stack.imgur.com/xHWG8.jpg'
    },
    '2': {
      description: 'Add a spoon of awesomeness to the mixer',
      images: 'https://i.stack.imgur.com/xHWG8.jpg'
    }
  },
  cookingTime: 1000,
  preparationTime: 3000,
  tagList: ['food', 'meal']
};

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqYWtlQGpha2UuamFrZSIsImlhdCI6MTU1MjM4MTYwNiwiZXhwIjoxNTUyOTg2NDA2fQ.cjn-7GZa78CW0IrE_X1erByHi4-6LEfco3hvK6A-rjQ';

describe('Create New Recipe', () => {
  describe('POST /api/recipes', () => {
    const baseUrl = '/api/recipes';
    it('should post new recipe when token is provided', done => {
      chai
        .request(server)
        .post(baseUrl)
        .set({ accesstoken: token })
        .send(recipe)
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(201);
          expect(body.recipe).to.be.an('object');
          expect(body.recipe.id).to.be.a('number');
          expect(body.recipe.title).to.be.a('string');
          expect(body.recipe.ingredients).to.be.an('array');
          expect(body.recipe.cookingTime).to.be.a('number');
          done(err);
        });
    });

    it('should not post recipe when token is not provided', done => {
      chai
        .request(server)
        .post(baseUrl)
        .set({})
        .send(recipe)
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(403);
          expect(body.errors).to.contain('Not allowed');
          done(err);
        });
    });

    // it('should not post recipe when token is not valid', done => {
    //   chai
    //     .request(server)
    //     .post(baseUrl)
    //     .set({ accesstoken: 'invalidToken' })
    //     .send(recipe)
    //     .end((err, res) => {
    //       const { body } = res;
    //       expect(res).to.have.status(403);
    //       expect(body.errors).to.contain('Not allowed');
    //       done(err);
    //     });
    // });

    it('should not post recipe when title is not provided', done => {
      delete recipe.title;
      chai
        .request(server)
        .post(baseUrl)
        .set({ accesstoken: token })
        .send(recipe)
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(404);
          expect(body.errors).to.contain('Title must be present');
          done(err);
        });
    });

    it('should not post recipe when title is more than 50 characters', done => {
      delete recipe.title;
      chai
        .request(server)
        .post(baseUrl)
        .set({ accesstoken: token })
        .send(recipe)
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(404);
          expect(body.errors).to.contain('Title must be present');
          done(err);
        });
    });

    it('should not post recipe when ingredient is not provided', done => {
      delete recipe.title;
      chai
        .request(server)
        .post(baseUrl)
        .set({ accesstoken: token })
        .send(recipe)
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(404);
          expect(body.errors).to.contain('Title must be present');
          done(err);
        });
    });

    it('should not post recipe when steps are not provided', done => {
      delete recipe.title;
      chai
        .request(server)
        .post(baseUrl)
        .set({ accesstoken: token })
        .send(recipe)
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(404);
          expect(body.errors).to.contain('Title must be present');
          done(err);
        });
    });

    it('should not post recipe when cookingTime is not valid', done => {
      delete recipe.title;
      chai
        .request(server)
        .post(baseUrl)
        .set({ accesstoken: token })
        .send(recipe)
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(404);
          expect(body.errors).to.contain('Title must be present');
          done(err);
        });
    });

    it('should not post recipe when preparationTime is not valid', done => {
      delete recipe.title;
      chai
        .request(server)
        .post(baseUrl)
        .set({ accesstoken: token })
        .send(recipe)
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(404);
          expect(body.errors).to.contain('Title must be present');
          done(err);
        });
    });
  });
});
