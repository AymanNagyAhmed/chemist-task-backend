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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { Request } from 'express';
import { ApiResponseInterceptor } from '@/common/interceptors/api-response.interceptor';
import { Public } from '@/modules/auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
  @UseInterceptors(FileInterceptor('profileImage', {
    storage: diskStorage({
      destination: './public/uploads/images',
      filename: (req, file, callback) => {
        const userId = req.params.id;
        const fileExtName = extname(file.originalname);
        callback(null, `${userId}-${Date.now()}${fileExtName}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request
  ) {
    this.checkUserAccess(req.user, id);
    
    if (file) {
      const imageUrl = `${req.protocol}://${req.get('host')}/public/uploads/images/${file.filename}`;
      updateUserDto.profileImage = imageUrl;
    }
    
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

  @Post(':id/profile-image')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './public/uploads/images',
      filename: (req, file, callback) => {
        const userId = req.params.id;
        const fileExtName = extname(file.originalname);
        callback(null, `${userId}-${Date.now()}${fileExtName}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  async uploadProfileImage(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), // 2MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    ) file: Express.Multer.File,
  ) {
    this.checkUserAccess(req.user, id);
    
    const imageUrl = `${req.protocol}://${req.get('host')}/public/uploads/images/${file.filename}`;
    await this.usersService.update(id, { profileImage: imageUrl });
    
    return { imageUrl };
  }

  private checkUserAccess(user: any, targetUserId: number): void {
    if (user.id !== targetUserId) {
      throw new ForbiddenException('You can only modify your own profile');
    }
  }
}
