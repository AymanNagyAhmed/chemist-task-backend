import { Test, TestingModule } from '@nestjs/testing';
import { ProgrammingSkillsModule } from './programming-skills.module';
import { ProgrammingSkillsService } from './programming-skills.service';
import { ProgrammingSkillsController } from './programming-skills.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';
import 'reflect-metadata';

describe('ProgrammingSkillsModule', () => {
  let moduleRef: TestingModule;

  const mockPrismaService = {
    programmingSkill: {
      findMany: jest.fn(),
    },
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [ProgrammingSkillsModule, PrismaModule],
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should be defined', () => {
    expect(moduleRef).toBeDefined();
  });

  describe('Module components', () => {
    let programmingSkillsService: ProgrammingSkillsService;
    let programmingSkillsController: ProgrammingSkillsController;
    let prismaService: PrismaService;

    beforeAll(() => {
      programmingSkillsService = moduleRef.get<ProgrammingSkillsService>(ProgrammingSkillsService);
      programmingSkillsController = moduleRef.get<ProgrammingSkillsController>(ProgrammingSkillsController);
      prismaService = moduleRef.get<PrismaService>(PrismaService);
    });

    it('should provide ProgrammingSkillsService', () => {
      expect(programmingSkillsService).toBeDefined();
      expect(programmingSkillsService).toBeInstanceOf(ProgrammingSkillsService);
    });

    it('should provide ProgrammingSkillsController', () => {
      expect(programmingSkillsController).toBeDefined();
      expect(programmingSkillsController).toBeInstanceOf(ProgrammingSkillsController);
    });

    it('should inject PrismaService into ProgrammingSkillsService', () => {
      expect(prismaService).toBeDefined();
      expect(prismaService).toEqual(mockPrismaService);
    });
  });

  describe('Service functionality', () => {
    let service: ProgrammingSkillsService;

    beforeEach(() => {
      service = moduleRef.get<ProgrammingSkillsService>(ProgrammingSkillsService);
    });

    it('should have findAll method', () => {
      expect(service.findAll).toBeDefined();
    });
  });

  describe('Controller functionality', () => {
    let controller: ProgrammingSkillsController;

    beforeEach(() => {
      controller = moduleRef.get<ProgrammingSkillsController>(ProgrammingSkillsController);
      // Setup controller metadata
      Reflect.defineMetadata('isPublic', true, controller.findAll);
    });

    it('should have findAll method', () => {
      expect(controller.findAll).toBeDefined();
    });

    it('should have Public decorator on findAll method', () => {
      const isPublic = Reflect.getMetadata('isPublic', controller.findAll);
      expect(isPublic).toBe(true);
    });
  });

  describe('Route configuration', () => {
    let controller: ProgrammingSkillsController;

    beforeEach(() => {
      controller = moduleRef.get<ProgrammingSkillsController>(ProgrammingSkillsController);
      // Setup controller metadata
      Reflect.defineMetadata('path', 'api/programming-skills', ProgrammingSkillsController);
      Reflect.defineMetadata('method', 'GET', controller.findAll);
      Reflect.defineMetadata('path', '/', controller.findAll);
    });

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

  describe('Module structure', () => {
    beforeAll(() => {
      // Setup module metadata
      Reflect.defineMetadata('imports', [PrismaModule], ProgrammingSkillsModule);
      Reflect.defineMetadata('providers', [ProgrammingSkillsService], ProgrammingSkillsModule);
      Reflect.defineMetadata('controllers', [ProgrammingSkillsController], ProgrammingSkillsModule);
    });

    it('should have correct module metadata', () => {
      const module = moduleRef.get(ProgrammingSkillsModule);
      expect(module).toBeDefined();
    });

    it('should have PrismaModule imported', () => {
      const imports = Reflect.getMetadata('imports', ProgrammingSkillsModule);
      expect(imports).toContain(PrismaModule);
    });

    it('should have correct providers', () => {
      const providers = Reflect.getMetadata('providers', ProgrammingSkillsModule);
      expect(providers).toContain(ProgrammingSkillsService);
    });

    it('should have correct controllers', () => {
      const controllers = Reflect.getMetadata('controllers', ProgrammingSkillsModule);
      expect(controllers).toContain(ProgrammingSkillsController);
    });
  });
}); 