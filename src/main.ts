import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCorsConfig } from '@/config/cors.config';
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { mkdir } from 'fs/promises';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  const configService = app.get(ConfigService);
  
  // Add global prefix with exclusions
  app.setGlobalPrefix('api', {
    exclude: ['/public/*']
  });
  
  // CORS
  app.enableCors(createCorsConfig(configService));
  
  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Global filters
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  // Ensure uploads directory exists
  const uploadsPath = join(process.cwd(), 'public', 'uploads', 'images');
  await mkdir(uploadsPath, { recursive: true });
  
  // Configure static file serving
  app.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/public',
    index: false
  });
  
  const port = configService.get<number>('PORT', 4000);
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
