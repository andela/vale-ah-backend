import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import { generateToken } from '../server/utils/helpers';
import { bookmarkTestUser, recipe } from './fixtures';

chai.use(chaiHttp);

const runtimeFixture = {};

describe('Bookmark', () => {
  before(() =>
    chai
      .request(server)
      .post('/api/users')
      .send(bookmarkTestUser)
      .then(res => {
        const { token } = res.body.user;
        runtimeFixture.token = token;
      })
  );

  describe('POST /api/user/:slug/bookmark', () => {
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

    it('should create new bookmark', done => {
      chai
        .request(server)
        .post(`/api/user/${runtimeFixture.slug}/bookmark`)
        .set({ authorization: runtimeFixture.token })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done(err);
        });
    });

    it('should not create a bookmark when a user does not exist', done => {
      chai
        .request(server)
        .post(`/api/user/${runtimeFixture.slug}/bookmark`)
        .set({ authorization: generateToken({ id: 1000 }) })
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(404);
          expect(body.errors).to.contain('User does not exist');
          done(err);
        });
    });

    it('should not create a bookmark when token is absent', done => {
      chai
        .request(server)
        .post(`/api/user/${runtimeFixture.slug}/bookmark`)
        .set({})
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(400);
          expect(body.errors).to.contain('Token is not provided');
          done(err);
        });
    });

    it('should not create bookmark with an invalid slug', done => {
      chai
        .request(server)
        .post(`/api/user/some-slug-like-that/bookmark`)
        .set({ authorization: runtimeFixture.token })
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });
  });

  describe('Get /api/user/bookmark', () => {
    it('should get all user bookmarks', done => {
      chai
        .request(server)
        .get(`/api/user/bookmarks`)
        .set({ authorization: runtimeFixture.token })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done(err);
        });
    });

    it('should return an error if user does not exist', done => {
      chai
        .request(server)
        .get(`/api/user/bookmarks`)
        .set({ authorization: generateToken({ id: 1000 }) })
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(404);
          expect(body.errors).to.contain('User does not exist');
          done(err);
        });
    });

    it('should return an error when token is absent', done => {
      chai
        .request(server)
        .get(`/api/user/bookmarks`)
        .set({})
        .end((err, res) => {
          const { body } = res;
          expect(res).to.have.status(400);
          expect(body.errors).to.contain('Token is not provided');
          done(err);
        });
    });
  });
});
