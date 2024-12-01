import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { AppModule } from '@/app.module';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

export const testUser = {
  email: 'e2e@test.com',
  password: 'test123',
  fullName: 'E2E Test User',
  dateOfBirth: new Date('1990-01-01'),
  resumeSummary: 'E2E test user summary',
};

export async function createTestingApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  
  // Get ConfigService
  const configService = app.get(ConfigService);
  
  // Ensure we're using test environment
  if (configService.get('NODE_ENV') !== 'test') {
    throw new Error('Tests must be run in test environment');
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: 400,
    }),
  );

  await app.init();
  return app;
}

export async function setupTestData(prismaService: PrismaService): Promise<void> {
  // Clean up any existing test data first
  await cleanupTestData(prismaService);

  const hashedPassword = await bcrypt.hash(testUser.password, 10);
  
  try {
    await prismaService.user.create({
      data: {
        email: testUser.email,
        password: hashedPassword,
        fullName: testUser.fullName,
        dateOfBirth: testUser.dateOfBirth,
        resumeSummary: testUser.resumeSummary,
        preferredLocation: {
          create: {
            locationName: 'Test Location',
          },
        },
        programmingSkills: {
          create: {
            programmingSkill: {
              create: {
                name: 'JavaScript',
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error('Error setting up test data:', error);
    throw error;
  }
}

export async function cleanupTestData(prismaService: PrismaService): Promise<void> {
  try {
    await prismaService.$transaction([
      prismaService.usersOnProgrammingSkills.deleteMany({
        where: {
          user: {
            email: testUser.email,
          },
        },
      }),
      prismaService.programmingSkill.deleteMany(),
      prismaService.user.deleteMany({
        where: { email: testUser.email },
      }),
      prismaService.preferredLocation.deleteMany(),
    ]);
  } catch (error) {
    console.error('Error cleaning up test data:', error);
    throw error;
  }
} 