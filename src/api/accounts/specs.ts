import * as supertest from 'supertest';
import * as config from 'config';
import { IAPIConfig } from '../../types';
import app from '../../app';

describe('Account Endpoint Tests', () => {
  let rootUri;
  let testAccountId;
  // const agent = supertest.agent(app);

  beforeAll(done => {
    const apiConfig = config.get<IAPIConfig>('api');
    rootUri = `/api/${apiConfig.version}/${apiConfig.endpoints.accounts}`;
    done();
  });

  it('GET / - should get 404', done => {
    supertest(app)
      .get(rootUri + '/1234')
      .expect(404)
      .then(res => {
        done();
      });
  });

  it('POST / - should fail create account with invalid email', done => {
    supertest(app)
      .post(rootUri)
      .send({ email: '1234' })
      .expect(400)
      .then(res => {
        expect(res.text).toContain('is not a valid');
        done();
      });
  });

  it('POST / - should create test account or fail with 409 status code', done => {
    supertest(app)
      .post(rootUri)
      .send({ email: 'test@test.com' })
      .then(res => {
        expect(res.status === 201 || res.status === 409).toBeTruthy();
        done();
      });
  });
});
