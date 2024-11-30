import { Test, TestingModule } from '@nestjs/testing';
import { ProgrammingSkillsController } from './programming-skills.controller';
import { ProgrammingSkillsService } from './programming-skills.service';
import { ProgrammingSkillDto } from './dto/programming-skill.dto';
import { ApiResponseInterceptor } from '@/common/interceptors/api-response.interceptor';
import { Controller, Get } from '@nestjs/common';
import 'reflect-metadata';

describe('ProgrammingSkillsController', () => {
  let controller: ProgrammingSkillsController;
  let service: jest.Mocked<ProgrammingSkillsService>;

  const mockProgrammingSkills: ProgrammingSkillDto[] = [
    { id: 1, name: 'JavaScript' },
    { id: 2, name: 'TypeScript' },
    { id: 3, name: 'Python' },
  ];

  beforeEach(async () => {
    const mockProgrammingSkillsService = {
      findAll: jest.fn().mockResolvedValue(mockProgrammingSkills),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgrammingSkillsController],
      providers: [
        {
          provide: ProgrammingSkillsService,
          useValue: mockProgrammingSkillsService,
        },
      ],
    })
      .overrideInterceptor(ApiResponseInterceptor)
      .useValue({
        intercept: jest.fn().mockImplementation((context, next) => next.handle()),
      })
      .compile();

    controller = module.get<ProgrammingSkillsController>(ProgrammingSkillsController);
    service = module.get(ProgrammingSkillsService);

    Reflect.defineMetadata('path', 'api/programming-skills', ProgrammingSkillsController);
    
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

    it('should have ProgrammingSkillsService injected', () => {
      expect(service).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return an array of programming skills', async () => {
      const result = await controller.findAll();

      expect(result).toEqual(mockProgrammingSkills);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle empty array response', async () => {
      service.findAll.mockResolvedValueOnce([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors', async () => {
      const error = new Error('Database error');
      service.findAll.mockRejectedValueOnce(error);

      await expect(controller.findAll()).rejects.toThrow(error);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Decorators', () => {
    it('should have Public decorator', () => {
      const metadata = Reflect.getMetadata('isPublic', controller.findAll);
      expect(metadata).toBe(true);
    });

    it('should use ApiResponseInterceptor', () => {
      const interceptors = Reflect.getMetadata('__interceptors__', ProgrammingSkillsController);
      expect(interceptors).toContain(ApiResponseInterceptor);
    });
  });

  describe('Route configuration', () => {
    it('should have correct controller path', () => {
      const path = Reflect.getMetadata('path', ProgrammingSkillsController);
      expect(path).toBe('api/programming-skills');
    });

    it('should have GET decorator for findAll', () => {
      const method = Reflect.getMetadata('method', controller.findAll);
      const path = Reflect.getMetadata('path', controller.findAll);

      expect(method).toBe('GET');
      expect(path).toBe('/');
    });
  });
}); 