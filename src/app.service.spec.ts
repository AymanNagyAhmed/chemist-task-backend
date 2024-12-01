import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { ApiResponse } from '@/common/interfaces/api-response.interface';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return hello world message with correct response format', async () => {
      const result = await service.getHello();

      // Check response structure
      expect(result).toEqual({
        success: true,
        statusCode: 200,
        message: 'Greeting retrieved successfully',
        path: '/',
        timestamp: expect.any(String),
        data: {
          message: 'Hello World!'
        }
      } as ApiResponse<{ message: string }>);

      // Verify timestamp is valid ISO string
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });

    it('should return unique timestamp for each call', async () => {
      const result1 = await service.getHello();
      
      // Add small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 1));
      
      const result2 = await service.getHello();

      expect(result1.timestamp).not.toBe(result2.timestamp);
    });

    it('should maintain consistent data structure', async () => {
      const result = await service.getHello();

      // Check data structure
      expect(result.data).toEqual({
        message: 'Hello World!'
      });

      // Check types
      expect(typeof result.success).toBe('boolean');
      expect(typeof result.statusCode).toBe('number');
      expect(typeof result.message).toBe('string');
      expect(typeof result.path).toBe('string');
      expect(typeof result.timestamp).toBe('string');
      expect(typeof result.data.message).toBe('string');
    });

    it('should use correct path', async () => {
      const result = await service.getHello();
      expect(result.path).toBe('/');
    });

    it('should use correct status code', async () => {
      const result = await service.getHello();
      expect(result.statusCode).toBe(200);
    });

    it('should indicate success', async () => {
      const result = await service.getHello();
      expect(result.success).toBe(true);
    });

    it('should use correct message', async () => {
      const result = await service.getHello();
      expect(result.message).toBe('Greeting retrieved successfully');
    });
  });
}); 