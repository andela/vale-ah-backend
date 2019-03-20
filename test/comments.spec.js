import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import { generateToken } from '../server/utils/helpers';
import { comment, commentTestUser, recipe } from './fixtures';

chai.use(chaiHttp);

const runtimeFixture = {};

describe('Comments', () => {
  before(() =>
    chai
      .request(server)
      .post('/api/users')
      .send(commentTestUser)
      .then(res => {
        const { token } = res.body.user;
        runtimeFixture.token = token;
      })
  );
  describe('POST /api/recipes/:slug/comments', () => {
    before(done => {
      chai
        .request(server)
        .post('/api/recipes')
        .set({ authorization: runtimeFixture.token })
        .send(recipe)
        .end((err, res) => {
          const { slug } = res.body.recipe;
          runtimeFixture.slug = slug;
          done(err);
        });
    });

    it('should create new recipe comment when a token is provided', done => {
      chai
        .request(server)
        .post(`/api/recipes/${runtimeFixture.slug}/comments`)
        .set({ authorization: runtimeFixture.token })
        .send(comment)
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(201);
          expect(body.body).to.equal(body.body);
          done(err);
        });
    });

    it('should not create a comment when token is absent', done => {
      chai
        .request(server)
        .post(`/api/recipes/${runtimeFixture.slug}/comments`)
        .set({ authorization: generateToken({ id: 1000 }) })
        .send(comment)
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(404);
          expect(body.errors).to.contain('User does not exist');
          done(err);
        });
    });

    it('should not create comment when body is not present', done => {
      chai
        .request(server)
        .post(`/api/recipes/${runtimeFixture.slug}/comments`)
        .set({ authorization: runtimeFixture.token })
        .send()
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(400);
          expect(body.errors).to.haveOwnProperty('body');
          done(err);
        });
    });
  });
});
