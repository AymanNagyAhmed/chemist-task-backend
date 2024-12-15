import { Module } from '@nestjs/common';
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
import { MediaController } from './common/controllers/media.controller';
import { MediaService } from './common/services/media.service';

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
  controllers: [AppController, MediaController],
  providers: [AppService, MediaService],
})
export class AppModule {}
