import * as supertest from 'supertest';
import app from './app';

describe('Server Tests', () => {
  it('GET / - it should get Html content', done => {
    supertest(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .then(res => {
        done();
      });
  });

  it('GET / - it should redirect to root url', done => {
    supertest(app)
      .get('/random/url/?x')
      .expect(302)
      .then(res => {
        done();
      });
  });
});
