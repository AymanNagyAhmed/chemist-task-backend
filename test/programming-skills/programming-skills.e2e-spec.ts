import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as request from 'supertest';
import { 
  createTestingApp, 
  setupTestData, 
  cleanupTestData, 
  testUser 
} from '../utils/test-setup.util';

describe('ProgrammingSkills (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    app = await createTestingApp();
    prismaService = app.get<PrismaService>(PrismaService);
    await cleanupTestData(prismaService);
  });

  afterAll(async () => {
    await cleanupTestData(prismaService);
    await prismaService.$disconnect();
    await app.close();
  });

  describe('GET /api/programming-skills', () => {
    beforeEach(async () => {
      // Clean up before creating new skills
      await prismaService.programmingSkill.deleteMany();
      
      // Create test skills one by one to handle unique constraints
      const skills = ['JavaScript', 'Python', 'Java'];
      for (const skillName of skills) {
        await prismaService.programmingSkill.create({
          data: { name: skillName },
        }).catch(() => {
          // Ignore if skill already exists
        });
      }
    });

    afterEach(async () => {
      await prismaService.programmingSkill.deleteMany();
    });

    it('should return all programming skills without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/programming-skills');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
      
      // Check if all test skills are present
      const skillNames = response.body.data.map(skill => skill.name);
      expect(skillNames).toContain('JavaScript');
      expect(skillNames).toContain('Python');
      expect(skillNames).toContain('Java');

      // Check response structure
      response.body.data.forEach(skill => {
        expect(skill).toHaveProperty('id');
        expect(skill).toHaveProperty('name');
        expect(typeof skill.id).toBe('number');
        expect(typeof skill.name).toBe('string');
      });
    });

    it('should handle empty programming skills list', async () => {
      await prismaService.programmingSkill.deleteMany();

      const response = await request(app.getHttpServer())
        .get('/api/programming-skills');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });

    it('should return programming skills in correct format', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/programming-skills');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBe('Resources retrieved successfully');
      expect(response.body.path).toBe('/api/programming-skills');
      expect(response.body.timestamp).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);

      // Check each skill in the response
      response.body.data.forEach(skill => {
        expect(skill).toMatchObject({
          id: expect.any(Number),
          name: expect.any(String)
        });
      });
    });

    it('should handle database errors gracefully', async () => {
      // Mock the findMany method to simulate a database error
      jest.spyOn(prismaService.programmingSkill, 'findMany').mockRejectedValueOnce(
        new Error('Database connection error')
      );

      const response = await request(app.getHttpServer())
        .get('/api/programming-skills');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'Internal server error'
      });

      // Restore the original implementation
      jest.restoreAllMocks();
    });
  });
});