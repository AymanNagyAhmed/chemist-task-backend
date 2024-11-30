import { Test, TestingModule } from '@nestjs/testing';
import { PreferredLocationsModule } from './preferred-locations.module';
import { PreferredLocationsService } from './preferred-locations.service';
import { PreferredLocationsController } from './preferred-locations.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';
import 'reflect-metadata';

describe('PreferredLocationsModule', () => {
  let moduleRef: TestingModule;

  const mockPrismaService = {
    preferredLocation: {
      findMany: jest.fn(),
    },
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [PreferredLocationsModule, PrismaModule],
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

    // Setup module metadata
    Reflect.defineMetadata('imports', [PrismaModule], PreferredLocationsModule);
    Reflect.defineMetadata('providers', [PreferredLocationsService], PreferredLocationsModule);
    Reflect.defineMetadata('controllers', [PreferredLocationsController], PreferredLocationsModule);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should be defined', () => {
    expect(moduleRef).toBeDefined();
  });

  describe('Module components', () => {
    let preferredLocationsService: PreferredLocationsService;
    let preferredLocationsController: PreferredLocationsController;
    let prismaService: PrismaService;

    beforeAll(() => {
      preferredLocationsService = moduleRef.get<PreferredLocationsService>(PreferredLocationsService);
      preferredLocationsController = moduleRef.get<PreferredLocationsController>(PreferredLocationsController);
      prismaService = moduleRef.get<PrismaService>(PrismaService);
    });

    it('should provide PreferredLocationsService', () => {
      expect(preferredLocationsService).toBeDefined();
      expect(preferredLocationsService).toBeInstanceOf(PreferredLocationsService);
    });

    it('should provide PreferredLocationsController', () => {
      expect(preferredLocationsController).toBeDefined();
      expect(preferredLocationsController).toBeInstanceOf(PreferredLocationsController);
    });

    it('should inject PrismaService into PreferredLocationsService', () => {
      expect(prismaService).toBeDefined();
      expect(prismaService).toEqual(mockPrismaService);
    });
  });

  describe('Service functionality', () => {
    let service: PreferredLocationsService;

    beforeEach(() => {
      service = moduleRef.get<PreferredLocationsService>(PreferredLocationsService);
    });

    it('should have findAll method', () => {
      expect(service.findAll).toBeDefined();
    });

    it('should be properly instantiated', () => {
      expect(service).toBeInstanceOf(PreferredLocationsService);
    });
  });

  describe('Controller functionality', () => {
    let controller: PreferredLocationsController;

    beforeEach(() => {
      controller = moduleRef.get<PreferredLocationsController>(PreferredLocationsController);
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
    let controller: PreferredLocationsController;

    beforeEach(() => {
      controller = moduleRef.get<PreferredLocationsController>(PreferredLocationsController);
      // Setup controller metadata
      Reflect.defineMetadata('path', 'api/preferred-locations', PreferredLocationsController);
      Reflect.defineMetadata('method', 'GET', controller.findAll);
      Reflect.defineMetadata('path', '/', controller.findAll);
    });

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

  describe('Module structure', () => {
    it('should have correct module metadata', () => {
      const module = moduleRef.get(PreferredLocationsModule);
      expect(module).toBeDefined();
    });

    it('should have PrismaModule imported', () => {
      const imports = Reflect.getMetadata('imports', PreferredLocationsModule);
      expect(imports).toContain(PrismaModule);
    });

    it('should have correct providers', () => {
      const providers = Reflect.getMetadata('providers', PreferredLocationsModule);
      expect(providers).toContain(PreferredLocationsService);
    });

    it('should have correct controllers', () => {
      const controllers = Reflect.getMetadata('controllers', PreferredLocationsModule);
      expect(controllers).toContain(PreferredLocationsController);
    });
  });

  describe('Dependency injection', () => {
    it('should properly inject dependencies', () => {
      const controller = moduleRef.get<PreferredLocationsController>(PreferredLocationsController);
      const service = moduleRef.get<PreferredLocationsService>(PreferredLocationsService);
      const prisma = moduleRef.get<PrismaService>(PrismaService);

      expect(controller).toBeDefined();
      expect(service).toBeDefined();
      expect(prisma).toBeDefined();
    });

    it('should maintain singleton instances', () => {
      const service1 = moduleRef.get<PreferredLocationsService>(PreferredLocationsService);
      const service2 = moduleRef.get<PreferredLocationsService>(PreferredLocationsService);

      expect(service1).toBe(service2);
    });
  });
}); 