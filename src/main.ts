import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCorsConfig } from './config/cors.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiResponseInterceptor } from '@/common/interceptors/api-response.interceptor';
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global interceptors
  app.useGlobalInterceptors(
    new ApiResponseInterceptor(),
    new LoggingInterceptor(app.get(ConfigService)),
  );

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Apply CORS configuration
  app.enableCors(createCorsConfig(configService));

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    exceptionFactory: (errors) => {
      const messages = errors.map(error => {
        const constraints = error.constraints || {};
        return {
          field: error.property,
          message: Object.values(constraints).join(', '),
        };
      });

      // Swagger setup
      const config = new DocumentBuilder()
        .setTitle('Your API')
        .setDescription('API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api', app, document);

      return new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: messages,
      });
    },
  }));

  const port = process.env.PORT || 80;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
