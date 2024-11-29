import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { LoginDto } from '@/modules/auth/dto/login.dto';
import { AuthService } from '@/modules/auth/auth.service';
import { LocalGuard } from '@/modules/auth/guards/local.guard';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Body() loginDto: LoginDto) {
    return {
      access_token: await this.authService.validateUser(loginDto),
    };
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  getStatus(@Req() req: Request) {
    return req.user;
  }
}