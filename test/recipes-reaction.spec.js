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
      .send({ ...recipe });

    // eslint-disable-next-line prefer-destructuring
    slug = recipeCreated.body.recipe.slug;
  });
  const baseUrl = '/api/recipes';

  const recipeLike = {
    userId: 1,
    recipeId: 1,
    isLike: true
  };
  describe('Recipe like and dislikes', () => {
    it('should return an error if the article is not found', done => {
      chai
        .request(server)
        .post(`${baseUrl}/${slug}-hello/like`)
        .set({ authorization: token })
        .end((err, res) => {
          expect(res).to.have.status(500);
          done(err);
        });
    });

    it('should return an error if the article is not found', done => {
      chai
        .request(server)
        .post(`${baseUrl}/${slug}-hello/dislike`)
        .set({ authorization: token })
        .end((err, res) => {
          expect(res).to.have.status(500);
          done(err);
        });
    });

    it('should be able to like a recipe', done => {
      chai
        .request(server)
        .post(`${baseUrl}/${slug}/like`)
        .set({ authorization: token })
        .send(recipeLike)
        .end((err, res) => {
          expect(res).to.have.status(201);
          done(err);
        });
    });

    it('should be able to unlike a recipe', done => {
      chai
        .request(server)
        .post(`${baseUrl}/${slug}/like`)
        .set({ authorization: token })
        .send(recipeLike)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done(err);
        });
    });

    it('should be able to like a recipe', done => {
      chai
        .request(server)
        .post(`${baseUrl}/${slug}/like`)
        .set({ authorization: token })
        .send(recipeLike)
        .end((err, res) => {
          expect(res).to.have.status(201);
          done(err);
        });
    });

    it('should be able get the numbers of likes of a recipe', done => {
      chai
        .request(server)
        .get(`${baseUrl}/${slug}/like`)
        .set({ authorization: token })
        .send(recipeLike)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done(err);
        });
    });

    it('should be able get the numbers of likes of a recipe if the server is down or the slug is not valid', done => {
      chai
        .request(server)
        .get(`${baseUrl}/${slug}-hello/like`)
        .set({ authorization: token })
        .send(recipeLike)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done(err);
        });
    });

    it('should be able to dislike a recipe', done => {
      chai
        .request(server)
        .post(`${baseUrl}/${slug}/dislike`)
        .set({ authorization: token })
        .send({
          userId: 1,
          recipeId: 1,
          isLike: false
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done(err);
        });
    });

    it('should be able to retrieve a dislike in a recipe', done => {
      chai
        .request(server)
        .post(`${baseUrl}/${slug}/dislike`)
        .set({ authorization: token })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done(err);
        });
    });

    it('should be able to dislike a recipe-1', done => {
      chai
        .request(server)
        .post(`${baseUrl}/${slug}/dislike`)
        .set({ authorization: token })
        .send({
          userId: 1,
          recipeId: 1,
          isLike: false
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          done(err);
        });
    });

    it('should be able get the numbers of dislikes of a recipe', done => {
      chai
        .request(server)
        .get(`${baseUrl}/${slug}/dislike`)
        .set({ authorization: token })
        .send(recipeLike)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done(err);
        });
    });

    it('should not be able get the numbers of dislikes of a recipe if the server is down or the slug is not valid', done => {
      chai
        .request(server)
        .get(`${baseUrl}/${slug}-hello/dislike`)
        .set({ authorization: token })
        .send(recipeLike)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done(err);
        });
    });

    it('should return a 404 error when a recipe doesn"t have a like', done => {
      chai
        .request(server)
        .get(`${baseUrl}/${slug}/like`)
        .set({ authorization: token })
        .send(recipeLike)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });

    it('should return an error when a recipe doesn"t have a  dislike', done => {
      chai
        .request(server)
        .get(`${baseUrl}/${slug}/like`)
        .set({ authorization: token })
        .send(recipeLike)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });

    it('should be able to change the isLike property to false', done => {
      chai
        .request(server)
        .post(`${baseUrl}/${slug}/dislike`)
        .set({ authorization: token })
        .send({
          userId: 1,
          recipeId: 1,
          isLike: false
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done(err);
        });
    });

    it('should be able to change the isLike property to false', done => {
      chai
        .request(server)
        .post(`${baseUrl}:slug/like`)
        .set({ authorization: token })
        .send(recipeLike)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });

    it('should be able to change the isLike property to false', done => {
      chai
        .request(server)
        .get(`${baseUrl}:slug/like`)
        .set({ authorization: token })
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });

    it('should be able to change the isLike property to false', done => {
      chai
        .request(server)
        .post(`${baseUrl}:slug/dislike`)
        .set({ authorization: token })
        .send(recipeLike)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });

    it('should be able to change the isLike property to false', done => {
      chai
        .request(server)
        .get(`${baseUrl}:slug/dislike`)
        .set({ authorization: token })
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });

    it('should not be ble to dislike when the recipe is not found', done => {
      chai
        .request(server)
        .get(`${baseUrl}:slug/dislike`)
        .set({ authorization: token })
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });
  });
});
