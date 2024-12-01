import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { PreferredLocationsService } from '@/modules/preferred-locations/preferred-locations.service';
import { PreferredLocationDto } from '@/modules/preferred-locations/dto/preferred-location.dto';
import { ApiResponseInterceptor } from '@/common/interceptors/api-response.interceptor';
import { Public } from '@/modules/auth/decorators/public.decorator';

@Controller('preferred-locations')
@UseInterceptors(ApiResponseInterceptor)
export class PreferredLocationsController {
  constructor(private readonly preferredLocationsService: PreferredLocationsService) {}

  @Public()
  @Get()
  async findAll(): Promise<PreferredLocationDto[]> {
    return this.preferredLocationsService.findAll();
  }
} 