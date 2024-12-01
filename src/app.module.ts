import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { PreferredLocationsModule } from '@/modules/preferred-locations/preferred-locations.module';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { validationSchema } from '@/config/env.validation';
import { PrismaModule } from '@/prisma/prisma.module';
import { LoggingMiddleware } from '@/common/middleware/logging.middleware';
import { ProgrammingSkillsModule } from '@/modules/programming-skills/programming-skills.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PreferredLocationsModule,
    ProgrammingSkillsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*');
  }
}
