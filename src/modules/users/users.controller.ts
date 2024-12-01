import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  ParseIntPipe,
  ForbiddenException,
  Req,
  UseInterceptors
} from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { Request } from 'express';
import { ApiResponseInterceptor } from '@/common/interceptors/api-response.interceptor';
import { Public } from '@/modules/auth/decorators/public.decorator';

@Controller('users')
@UseInterceptors(ApiResponseInterceptor)
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request
  ) {
    this.checkUserAccess(req.user, id);
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request
  ) {
    this.checkUserAccess(req.user, id);
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request
  ) {
    this.checkUserAccess(req.user, id);
    return this.usersService.remove(id);
  }

  private checkUserAccess(user: any, targetUserId: number): void {
    if (user.id !== targetUserId) {
      throw new ForbiddenException('You can only modify your own profile');
    }
  }
}
