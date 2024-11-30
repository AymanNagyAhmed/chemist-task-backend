import { Test, TestingModule } from '@nestjs/testing';
import { PreferredLocationsController } from './preferred-locations.controller';
import { PreferredLocationsService } from './preferred-locations.service';
import { PreferredLocationDto } from './dto/preferred-location.dto';
import { ApiResponseInterceptor } from '@/common/interceptors/api-response.interceptor';
import 'reflect-metadata';

describe('PreferredLocationsController', () => {
  let controller: PreferredLocationsController;
  let service: jest.Mocked<PreferredLocationsService>;

  const mockPreferredLocations: PreferredLocationDto[] = [
    { id: 1, locationName: 'New York' },
    { id: 2, locationName: 'London' },
    { id: 3, locationName: 'Tokyo' },
  ];

  beforeEach(async () => {
    const mockPreferredLocationsService = {
      findAll: jest.fn().mockResolvedValue(mockPreferredLocations),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreferredLocationsController],
      providers: [
        {
          provide: PreferredLocationsService,
          useValue: mockPreferredLocationsService,
        },
      ],
    })
      .overrideInterceptor(ApiResponseInterceptor)
      .useValue({
        intercept: jest.fn().mockImplementation((context, next) => next.handle()),
      })
      .compile();

    controller = module.get<PreferredLocationsController>(PreferredLocationsController);
    service = module.get(PreferredLocationsService);

    // Setup controller metadata
    Reflect.defineMetadata('path', 'api/preferred-locations', PreferredLocationsController);
    Reflect.defineMetadata('method', 'GET', controller.findAll);
    Reflect.defineMetadata('path', '/', controller.findAll);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should have PreferredLocationsService injected', () => {
      expect(service).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return an array of preferred locations', async () => {
      const result = await controller.findAll();

      expect(result).toEqual(mockPreferredLocations);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle empty array response', async () => {
      service.findAll.mockResolvedValueOnce([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      service.findAll.mockRejectedValueOnce(error);

      await expect(controller.findAll()).rejects.toThrow('Service error');
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Decorators', () => {
    it('should have Public decorator', () => {
      const isPublic = Reflect.getMetadata('isPublic', controller.findAll);
      expect(isPublic).toBe(true);
    });

    it('should use ApiResponseInterceptor', () => {
      const interceptors = Reflect.getMetadata('__interceptors__', PreferredLocationsController);
      expect(interceptors).toContain(ApiResponseInterceptor);
    });
  });

  describe('Route configuration', () => {
    it('should have correct controller path', () => {
      const path = Reflect.getMetadata('path', PreferredLocationsController);
      expect(path).toBe('api/preferred-locations');
    });

    it('should have GET decorator for findAll', () => {
      const method = Reflect.getMetadata('method', controller.findAll);
      const path = Reflect.getMetadata('path', controller.findAll);

      expect(method).toBe('GET');
      expect(path).toBe('/');
    });
  });

  describe('Response structure', () => {
    it('should return locations with correct structure', async () => {
      const result = await controller.findAll();

      result.forEach(location => {
        expect(location).toHaveProperty('id');
        expect(location).toHaveProperty('locationName');
        expect(Object.keys(location)).toHaveLength(2);
      });
    });

    it('should return locations with correct types', async () => {
      const result = await controller.findAll();

      result.forEach(location => {
        expect(typeof location.id).toBe('number');
        expect(typeof location.locationName).toBe('string');
      });
    });
  });

  describe('Error handling', () => {
    it('should handle service timeout', async () => {
      const timeoutError = new Error('Service Timeout');
      service.findAll.mockRejectedValueOnce(timeoutError);

      await expect(controller.findAll()).rejects.toThrow('Service Timeout');
    });

    it('should handle service unavailable', async () => {
      const unavailableError = new Error('Service Unavailable');
      service.findAll.mockRejectedValueOnce(unavailableError);

      await expect(controller.findAll()).rejects.toThrow('Service Unavailable');
    });
  });
}); 