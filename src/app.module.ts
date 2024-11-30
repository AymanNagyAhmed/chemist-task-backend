import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { PreferredLocationsModule } from '@/modules/preferred-locations/preferred-locations.module';
import { ProgrammingSkillsModule } from '@/modules/programming-skills/programming-skills.module';
import { validationSchema } from '@/config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PreferredLocationsModule,
    ProgrammingSkillsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
