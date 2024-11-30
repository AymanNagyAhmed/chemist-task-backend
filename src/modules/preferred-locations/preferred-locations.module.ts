import { Module } from '@nestjs/common';
import { PreferredLocationsController } from '@/modules/preferred-locations/preferred-locations.controller';
import { PreferredLocationsService } from '@/modules/preferred-locations/preferred-locations.service';

@Module({
  controllers: [PreferredLocationsController],
  providers: [PreferredLocationsService],
})
export class PreferredLocationsModule {} 