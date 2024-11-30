import { Module } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { UsersController } from '@/modules/users/users.controller';

@Module({
  imports: [PrismaModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
