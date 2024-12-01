import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as request from 'supertest';
import { 
  createTestingApp, 
  setupTestData, 
  cleanupTestData, 
  testUser 
} from '../utils/test-setup.util';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtToken: string;

  beforeAll(async () => {
    app = await createTestingApp();
    prismaService = app.get<PrismaService>(PrismaService);
    await cleanupTestData(prismaService);
    await setupTestData(prismaService);
  });

  afterAll(async () => {
    await cleanupTestData(prismaService);
    await prismaService.$disconnect();
    await app.close();
  });

  describe('POST /api/auth/login', () => {
    it('should successfully login with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.access_token).toBeDefined();
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.fullName).toBe(testUser.fullName);
      
      jwtToken = response.body.data.access_token;
    });

    it('should fail with invalid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized'
      });
    });

    it('should fail with invalid email format', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized'
      });
    });
  });

  describe('GET /api/auth/status', () => {
    it('should return user status when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/auth/status')
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.email).toBe(testUser.email);
    });

    it('should fail without authentication token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/auth/status');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    it('should fail with invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/auth/status')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });
  });
}); 