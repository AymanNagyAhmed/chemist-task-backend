import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { PreferredLocationsModule } from '@/modules/preferred-locations/preferred-locations.module';
import { ProgrammingSkillsModule } from '@/modules/programming-skills/programming-skills.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter';
import { ApiResponseInterceptor } from '@/common/interceptors/api-response.interceptor';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';
import * as Joi from 'joi';

describe('AppModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(module).toBeDefined();
  });

  it('should have required modules', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Check if all required modules are available
    expect(moduleRef.get(ConfigModule)).toBeDefined();
    expect(moduleRef.get(PrismaModule)).toBeDefined();
    expect(moduleRef.get(AuthModule)).toBeDefined();
    expect(moduleRef.get(UsersModule)).toBeDefined();
    expect(moduleRef.get(PreferredLocationsModule)).toBeDefined();
    expect(moduleRef.get(ProgrammingSkillsModule)).toBeDefined();
  });

  it('should validate environment variables', async () => {
    const validConfig = {
      DATABASE_URL: 'mysql://user:password@localhost:3306/db',
      JWT_SECRET: 'secret',
      JWT_EXPIRES_IN: '1h',
    };

    const schema = Joi.object({
      DATABASE_URL: Joi.string().required(),
      JWT_SECRET: Joi.string().required(),
      JWT_EXPIRES_IN: Joi.string().required(),
    });

    const { error: validError } = schema.validate(validConfig);
    expect(validError).toBeUndefined();

    const invalidConfig = {
      DATABASE_URL: '',
      JWT_SECRET: '',
    };

    const { error: invalidError } = schema.validate(invalidConfig);
    expect(invalidError).toBeDefined();
  });

  it('should load environment variables', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const configService = moduleRef.get(ConfigService);
    
    expect(configService.get('DATABASE_URL')).toBeDefined();
    expect(configService.get('JWT_SECRET')).toBeDefined();
    expect(configService.get('JWT_EXPIRES_IN')).toBeDefined();
  });

  it('should have correct module configuration', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Check if ConfigModule is available and properly configured
    const configService = moduleRef.get(ConfigService);
    expect(configService).toBeDefined();

    // Check if PrismaModule is available
    const prismaService = moduleRef.get(PrismaService);
    expect(prismaService).toBeDefined();
  });

  it('should have correct environment configuration', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const configService = moduleRef.get(ConfigService);
    
    // Check database configuration
    const dbUrl = configService.get('DATABASE_URL');
    expect(dbUrl).toBeDefined();
    expect(typeof dbUrl).toBe('string');
    expect(dbUrl).toMatch(/^mysql:\/\/.+/);
  });
}); 