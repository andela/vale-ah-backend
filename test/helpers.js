import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';

chai.use(chaiHttp);

export const testGet = (name, url, callback) => {
  it(name, done => {
    chai
      .request(server)
      .get(url)
      .end((err, res) => {
        callback(res);
        done(err);
      });
  });
};

export const testPost = (name, url, data, callback) => {
  it(name, done => {
    chai
      .request(server)
      .post(url)
      .send(data)
      .end((err, res) => {
        callback(res);
        done(err);
      });
  });
};

export const testAuthGet = (name, url, token, callback) => {
  it(name, done => {
    chai
      .request(server)
      .get(url)
      .set({ authorization: `Bearer ${token}` })
      .end((err, res) => {
        callback(res);
        done(err);
      });
  });
};

export const testAuthPost = (name, url, token, data, callback) => {
  it(name, done => {
    chai
      .request(server)
      .post(url)
      .set({ authorization: `Bearer ${token}` })
      .send(data)
      .end((err, res) => {
        callback(res);
        done(err);
      });
  });
};

export const testAuthPut = (name, url, token, data, callback) => {
  it(name, done => {
    chai
      .request(server)
      .put(url)
      .set({ authorization: `Bearer ${token}` })
      .send(data)
      .end((err, res) => {
        callback(res);
        done(err);
      });
  });
};

export const testAuthDelete = (name, url, token, callback) => {
  it(name, done => {
    chai
      .request(server)
      .delete(url)
      .set({ authorization: `Bearer ${token}` })
      .end((err, res) => {
        callback(res);
        done(err);
      });
  });
};
