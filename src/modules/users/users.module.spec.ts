import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';

describe('UsersModule', () => {
  let moduleRef: TestingModule;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
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
    let usersService: UsersService;
    let usersController: UsersController;
    let prismaService: PrismaService;

    beforeAll(() => {
      usersService = moduleRef.get<UsersService>(UsersService);
      usersController = moduleRef.get<UsersController>(UsersController);
      prismaService = moduleRef.get<PrismaService>(PrismaService);
    });

    it('should provide UsersService', () => {
      expect(usersService).toBeDefined();
      expect(usersService).toBeInstanceOf(UsersService);
    });

    it('should provide UsersController', () => {
      expect(usersController).toBeDefined();
      expect(usersController).toBeInstanceOf(UsersController);
    });

    it('should inject PrismaService into UsersService', () => {
      expect(prismaService).toBeDefined();
      expect(prismaService).toEqual(mockPrismaService);
    });
  });

  describe('Module structure', () => {
    it('should import PrismaModule', () => {
      const prismaModule = moduleRef.get(PrismaModule);
      expect(prismaModule).toBeDefined();
    });

    it('should export UsersService', () => {
      const exportedService = moduleRef.get(UsersService);
      expect(exportedService).toBeDefined();
      expect(exportedService).toBeInstanceOf(UsersService);
    });

    it('should have correct module metadata', () => {
      const module = moduleRef.get(UsersModule);
      const metadata = Reflect.getMetadata('imports', UsersModule);
      
      expect(module).toBeDefined();
      expect(metadata).toContain(PrismaModule);
    });
  });

  describe('Module configuration', () => {
    it('should have correct providers', () => {
      const providers = Reflect.getMetadata('providers', UsersModule);
      expect(providers).toContain(UsersService);
    });

    it('should have correct controllers', () => {
      const controllers = Reflect.getMetadata('controllers', UsersModule);
      expect(controllers).toContain(UsersController);
    });

    it('should have correct exports', () => {
      const exports = Reflect.getMetadata('exports', UsersModule);
      expect(exports).toContain(UsersService);
    });
  });
}); 