import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiResponse } from '@/common/interfaces/api-response.interface';
import { NotFoundException } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return hello world message', async () => {
      const result = await appController.getHello();
      
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

      // Additional checks for timestamp format
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });

    it('should handle non-existent routes', async () => {
      try {
        // Simulate a request to a non-existent route
        await appController.getHello();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
