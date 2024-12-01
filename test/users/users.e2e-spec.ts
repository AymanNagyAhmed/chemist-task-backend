import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as request from 'supertest';
import { 
  createTestingApp, 
  setupTestData, 
  cleanupTestData, 
  testUser 
} from '../utils/test-setup.util';
import * as bcrypt from 'bcryptjs';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtToken: string;

  beforeAll(async () => {
    app = await createTestingApp();
    prismaService = app.get<PrismaService>(PrismaService);
    await cleanupTestData(prismaService);
    await setupTestData(prismaService);

    // Get JWT token for authenticated requests
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    jwtToken = loginResponse.body.data.access_token;
  });

  afterAll(async () => {
    await cleanupTestData(prismaService);
    await prismaService.$disconnect();
    await app.close();
  });

  describe('PATCH /api/users/:id', () => {
    it('should update user profile when authenticated', async () => {
      const user = await prismaService.user.findUnique({
        where: { email: testUser.email },
      });

      // Create new location and skills first
      const newLocation = await prismaService.preferredLocation.create({
        data: { locationName: 'Updated Location' }
      });

      const newSkills = await Promise.all([
        prismaService.programmingSkill.create({ data: { name: 'TypeScript' } }),
        prismaService.programmingSkill.create({ data: { name: 'Python' } })
      ]);

      const updateData = {
        fullName: 'Updated Name',
        resumeSummary: 'Updated summary',
        preferredLocationId: newLocation.id,
        programmingSkills: newSkills.map(skill => skill.id)
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/users/${user!.id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updateData);

      if (response.status !== 200) {
        console.log('Update failed. Response:', {
          status: response.status,
          body: response.body
        });
      }

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.fullName).toBe(updateData.fullName);
      expect(response.body.data.resumeSummary).toBe(updateData.resumeSummary);
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data.preferredLocation.id).toBe(updateData.preferredLocationId);
      expect(response.body.data.programmingSkills).toHaveLength(2);
      expect(response.body.data.programmingSkills.map(skill => skill.name)).toEqual(
        expect.arrayContaining(['TypeScript', 'Python'])
      );
    });

    it('should fail when updating without authentication', async () => {
      const user = await prismaService.user.findUnique({
        where: { email: testUser.email },
      });

      const response = await request(app.getHttpServer())
        .patch(`/api/users/${user!.id}`)
        .send({ fullName: 'Should Not Update' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    });

    it('should fail when updating another user profile', async () => {
      // Create a new user with hashed password and unique email
      const uniqueEmail = `other-${Date.now()}@test.com`;
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      try {
        const otherUser = await prismaService.user.create({
          data: {
            email: uniqueEmail,
            password: hashedPassword,
            fullName: 'Other User',
          },
        });

        const response = await request(app.getHttpServer())
          .patch(`/api/users/${otherUser.id}`)
          .set('Authorization', `Bearer ${jwtToken}`)
          .send({ fullName: 'Should Not Update' });

        expect(response.status).toBe(403);
        expect(response.body).toEqual({
          statusCode: 403,
          message: 'You can only modify your own profile',
          error: 'Forbidden'
        });

        // Cleanup
        await prismaService.user.delete({
          where: { id: otherUser.id },
        });
      } catch (error) {
        console.error('Test failed:', error);
        throw error;
      }
    });

    it('should fail when updating email to existing one', async () => {
      const user = await prismaService.user.findUnique({
        where: { email: testUser.email },
      });

      // Create another user with unique email
      const uniqueEmail = `other-${Date.now()}@test.com`;
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const otherUser = await prismaService.user.create({
        data: {
          email: uniqueEmail,
          password: hashedPassword,
          fullName: 'Other User',
        },
      });

      const response = await request(app.getHttpServer())
        .patch(`/api/users/${user!.id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ email: otherUser.email });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: 'Email already exists',
        error: 'Bad Request'
      });

      // Cleanup
      await prismaService.user.delete({
        where: { id: otherUser.id },
      });
    });

    it('should fail with invalid data format', async () => {
      const user = await prismaService.user.findUnique({
        where: { email: testUser.email },
      });

      const response = await request(app.getHttpServer())
        .patch(`/api/users/${user!.id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          dateOfBirth: 'invalid-date',
          preferredLocationId: 'not-a-number',
          programmingSkills: ['not-a-number']
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: expect.arrayContaining([
          'dateOfBirth must be a valid ISO 8601 date string',
          expect.stringContaining('preferredLocationId must be a number'),
          expect.stringContaining('each value in programmingSkills must be a number')
        ])
      });
    });
  });
}); 