import { Test, TestingModule } from '@nestjs/testing';
import { ProgrammingSkillsService } from './programming-skills.service';
import { PrismaService } from '@/prisma/prisma.service';
import { ProgrammingSkillDto } from './dto/programming-skill.dto';

describe('ProgrammingSkillsService', () => {
  let service: ProgrammingSkillsService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockProgrammingSkills: ProgrammingSkillDto[] = [
    { id: 1, name: 'JavaScript' },
    { id: 2, name: 'TypeScript' },
    { id: 3, name: 'Python' },
  ];

  beforeEach(async () => {
    const mockPrismaService = {
      programmingSkill: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgrammingSkillsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProgrammingSkillsService>(ProgrammingSkillsService);
    prismaService = module.get(PrismaService);

    (prismaService.programmingSkill.findMany as jest.Mock).mockResolvedValue(mockProgrammingSkills);
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
      expect(prismaService.programmingSkill).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should call prisma findMany with correct parameters', async () => {
      await service.findAll();

      expect(prismaService.programmingSkill.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
        },
      });
    });

    it('should return an array of programming skills', async () => {
      const result = await service.findAll();

      expect(result).toEqual(mockProgrammingSkills);
      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
    });

    it('should return empty array when no skills exist', async () => {
      (prismaService.programmingSkill.findMany as jest.Mock).mockResolvedValueOnce([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle database errors gracefully', async () => {
      const dbError = new Error('Database connection failed');
      (prismaService.programmingSkill.findMany as jest.Mock).mockRejectedValueOnce(dbError);

      await expect(service.findAll()).rejects.toThrow('Database connection failed');
    });
  });

  describe('data transformation', () => {
    it('should properly transform database response to DTO', async () => {
      const dbResponse = [
        { 
          id: 1, 
          name: 'JavaScript',
        },
        { 
          id: 2, 
          name: 'TypeScript',
        }
      ];

      (prismaService.programmingSkill.findMany as jest.Mock).mockResolvedValueOnce(dbResponse);

      const result = await service.findAll();

      expect(result).toEqual([
        { id: 1, name: 'JavaScript' },
        { id: 2, name: 'TypeScript' }
      ]);
      expect(prismaService.programmingSkill.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
        },
      });
    });

    it('should handle null values in database response', async () => {
      const dbResponse = [
        { 
          id: 1, 
          name: null,
        }
      ];

      (prismaService.programmingSkill.findMany as jest.Mock).mockResolvedValueOnce(dbResponse);

      const result = await service.findAll();

      expect(result).toEqual([
        { id: 1, name: null }
      ]);
      expect(prismaService.programmingSkill.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
        },
      });
    });

    it('should handle empty database response', async () => {
      (prismaService.programmingSkill.findMany as jest.Mock).mockResolvedValueOnce([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle malformed database response', async () => {
      const malformedResponse = [
        { 
          id: 1,
        }
      ];

      (prismaService.programmingSkill.findMany as jest.Mock).mockResolvedValueOnce(malformedResponse);

      const result = await service.findAll();

      expect(result).toEqual([
        { id: 1, name: undefined }
      ]);
    });
  });

  describe('error handling', () => {
    it('should handle prisma client errors', async () => {
      const prismaError = new Error('Prisma Client Error');
      (prismaService.programmingSkill.findMany as jest.Mock).mockRejectedValueOnce(prismaError);

      await expect(service.findAll()).rejects.toThrow('Prisma Client Error');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      (prismaService.programmingSkill.findMany as jest.Mock).mockRejectedValueOnce(networkError);

      await expect(service.findAll()).rejects.toThrow('Network Error');
    });
  });
}); 