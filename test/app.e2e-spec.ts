import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingApp } from './utils/test-setup.util';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.message).toBe('Hello World!');
        });
    });
  });
});
