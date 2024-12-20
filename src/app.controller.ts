import { Controller, Get, NotFoundException } from '@nestjs/common';
import { AppService } from '@/app.service';
import { ApiResponse } from '@/common/interfaces/api-response.interface';
import { Public } from '@/modules/auth/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  async getHello(): Promise<ApiResponse<{ message: string }>> {
    return this.appService.getHello();
  }
}
