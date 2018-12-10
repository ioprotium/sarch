import * as supertest from 'supertest';
import app from './app';

describe('Server Tests', () => {
  it('GET / - should get Html content', done => {
    supertest(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .then(res => {
        done();
      });
  });
});
