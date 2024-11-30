import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { PreferredLocationDto } from '@/modules/preferred-locations/dto/preferred-location.dto';

@Injectable()
export class PreferredLocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PreferredLocationDto[]> {
    const locations = await this.prisma.preferredLocation.findMany({
      select: {
        id: true,
        locationName: true,
      },
    });
    return locations;
  }
} 