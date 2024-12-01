import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as request from 'supertest';
import { 
  createTestingApp, 
  setupTestData, 
  cleanupTestData, 
  testUser 
} from '../utils/test-setup.util';

describe('PreferredLocations (e2e)', () => {
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

  describe('GET /api/preferred-locations', () => {
    beforeEach(async () => {
      // Clean up before creating new locations
      await prismaService.preferredLocation.deleteMany();
      
      // Create test locations one by one to handle unique constraints
      const locations = ['New York', 'London', 'Tokyo'];
      for (const locationName of locations) {
        await prismaService.preferredLocation.create({
          data: { locationName },
        }).catch(() => {
          // Ignore if location already exists
        });
      }
    });

    afterEach(async () => {
      await prismaService.preferredLocation.deleteMany();
    });

    it('should return all preferred locations without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/preferred-locations');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
      
      // Check if all test locations are present
      const locationNames = response.body.data.map(location => location.locationName);
      expect(locationNames).toContain('New York');
      expect(locationNames).toContain('London');
      expect(locationNames).toContain('Tokyo');

      // Check response structure
      response.body.data.forEach(location => {
        expect(location).toHaveProperty('id');
        expect(location).toHaveProperty('locationName');
        expect(typeof location.id).toBe('number');
        expect(typeof location.locationName).toBe('string');
      });
    });

    it('should handle empty preferred locations list', async () => {
      await prismaService.preferredLocation.deleteMany();

      const response = await request(app.getHttpServer())
        .get('/api/preferred-locations');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });

    it('should return preferred locations in correct format', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/preferred-locations');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBe('Resources retrieved successfully');
      expect(response.body.path).toBe('/api/preferred-locations');
      expect(response.body.timestamp).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);

      // Check each location in the response
      response.body.data.forEach(location => {
        expect(location).toMatchObject({
          id: expect.any(Number),
          locationName: expect.any(String)
        });
      });
    });

    it('should handle database errors gracefully', async () => {
      // Mock the findMany method to simulate a database error
      jest.spyOn(prismaService.preferredLocation, 'findMany').mockRejectedValueOnce(
        new Error('Database connection error')
      );

      const response = await request(app.getHttpServer())
        .get('/api/preferred-locations');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'Internal server error'
      });

      // Restore the original implementation
      jest.restoreAllMocks();
    });

    it('should handle malformed requests', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/preferred-locations?invalid=true');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      // Should ignore invalid query parameters
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
    });

    it('should not expose sensitive data', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/preferred-locations');

      expect(response.status).toBe(200);
      response.body.data.forEach(location => {
        // Ensure only necessary fields are exposed
        const allowedKeys = ['id', 'locationName', 'createdAt', 'updatedAt'];
        const locationKeys = Object.keys(location);
        expect(locationKeys.every(key => allowedKeys.includes(key))).toBe(true);
        // Ensure no user data is exposed
        expect(location).not.toHaveProperty('users');
      });
    });
  });
}); 