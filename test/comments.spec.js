// import chai, { expect } from 'chai';
// import chaiHttp from 'chai-http';
// import server from '../server';
// import { generateToken } from '../server/utils/helpers';
// import { comment, recipeTestUser } from './fixtures';

// chai.use(chaiHttp);

// const runtimeFixture = {};

// describe('Comments', () => {
//   describe('POST /api/recipes/:slug/comments', () => {
//     before(() =>
//       chai
//         .request(server)
//         .post('/api/users')
//         .send(recipeTestUser)
//         .then(res => {
//           const { token } = res.body.user;
//           runtimeFixture.token = token;
//         })
//     );
//     const baseUrl = '/api/recipes/:slug/comments';
//     it('should create new recipe comment when a token is provided', done => {
//       chai
//         .request(server)
//         .post(baseUrl)
//         .set({ authorization: runtimeFixture.token })
//         .send(comment)
//         .end((err, res) => {
//           console.log('resgfgf', res);
//           // const { body } = res;
//           // expect(res).to.have.status(201);
//           done(err);
//         });
//     });

//     it('should not create a comment when token is absent', done => {
//       chai
//         .request(server)
//         .post(baseUrl)
//         .set({ authorization: generateToken({ id: 1000 }) })
//         .send(comment)
//         .end((err, res) => {
//           const { body } = res;
//           expect(res).to.have.status(404);
//           expect(body.errors).to.contain('User does not exist');
//           done(err);
//         });
//     });

//     it('should not create comment when body is not present', done => {
//       chai
//         .request(server)
//         .post(baseUrl)
//         .set({ authorization: runtimeFixture.token })
//         .send()
//         .end((err, res) => {
//           const { body } = res;
//           // console.log('erroringthf', err);
//           // console.log('resgfgf', res);
//           // expect(res).to.have.status(400);
//           // expect(body.errors).to.haveOwnProperty('body');
//           done(err);
//         });
//     });
//   });
// });
