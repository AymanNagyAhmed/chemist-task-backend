import { Test, TestingModule } from '@nestjs/testing';
import { PreferredLocationsService } from './preferred-locations.service';
import { PrismaService } from '@/prisma/prisma.service';
import { PreferredLocationDto } from './dto/preferred-location.dto';

describe('PreferredLocationsService', () => {
  let service: PreferredLocationsService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockPreferredLocations: PreferredLocationDto[] = [
    { id: 1, locationName: 'New York' },
    { id: 2, locationName: 'London' },
    { id: 3, locationName: 'Tokyo' },
  ];

  beforeEach(async () => {
    const mockPrismaService = {
      preferredLocation: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreferredLocationsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PreferredLocationsService>(PreferredLocationsService);
    prismaService = module.get(PrismaService);

    // Setup default mock implementation
    (prismaService.preferredLocation.findMany as jest.Mock).mockResolvedValue(mockPreferredLocations);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('service initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have PrismaService injected', () => {
      expect(prismaService).toBeDefined();
      expect(prismaService.preferredLocation).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should call prisma findMany with correct parameters', async () => {
      await service.findAll();

      expect(prismaService.preferredLocation.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          locationName: true,
        },
      });
    });

    it('should return an array of preferred locations', async () => {
      const result = await service.findAll();

      expect(result).toEqual(mockPreferredLocations);
      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('locationName');
    });

    it('should return empty array when no locations exist', async () => {
      (prismaService.preferredLocation.findMany as jest.Mock).mockResolvedValueOnce([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle database errors gracefully', async () => {
      const dbError = new Error('Database connection failed');
      (prismaService.preferredLocation.findMany as jest.Mock).mockRejectedValueOnce(dbError);

      await expect(service.findAll()).rejects.toThrow('Database connection failed');
    });
  });

  describe('data transformation', () => {
    it('should properly transform database response to DTO', async () => {
      const dbResponse = [
        { 
          id: 1, 
          locationName: 'New York',
        },
        { 
          id: 2, 
          locationName: 'London',
        }
      ];

      (prismaService.preferredLocation.findMany as jest.Mock).mockResolvedValueOnce(dbResponse);

      const result = await service.findAll();

      expect(result).toEqual([
        { id: 1, locationName: 'New York' },
        { id: 2, locationName: 'London' }
      ]);
      expect(prismaService.preferredLocation.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          locationName: true,
        },
      });
    });

    it('should handle null values in database response', async () => {
      const dbResponse = [
        { 
          id: 1, 
          locationName: null,
        }
      ];

      (prismaService.preferredLocation.findMany as jest.Mock).mockResolvedValueOnce(dbResponse);

      const result = await service.findAll();

      expect(result).toEqual([
        { id: 1, locationName: null }
      ]);
    });

    it('should handle malformed database response', async () => {
      const malformedResponse = [
        { 
          id: 1,
          // missing locationName field
        }
      ];

      (prismaService.preferredLocation.findMany as jest.Mock).mockResolvedValueOnce(malformedResponse);

      const result = await service.findAll();

      expect(result).toEqual([
        { id: 1, locationName: undefined }
      ]);
    });
  });

  describe('error handling', () => {
    it('should handle prisma client errors', async () => {
      const prismaError = new Error('Prisma Client Error');
      (prismaService.preferredLocation.findMany as jest.Mock).mockRejectedValueOnce(prismaError);

      await expect(service.findAll()).rejects.toThrow('Prisma Client Error');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      (prismaService.preferredLocation.findMany as jest.Mock).mockRejectedValueOnce(networkError);

      await expect(service.findAll()).rejects.toThrow('Network Error');
    });
  });

  describe('response structure', () => {
    it('should return locations with correct structure', async () => {
      const result = await service.findAll();

      result.forEach(location => {
        expect(location).toHaveProperty('id');
        expect(location).toHaveProperty('locationName');
        expect(Object.keys(location)).toHaveLength(2);
      });
    });

    it('should return locations with correct types', async () => {
      const result = await service.findAll();

      result.forEach(location => {
        expect(typeof location.id).toBe('number');
        expect(typeof location.locationName).toBe('string');
      });
    });
  });
}); 