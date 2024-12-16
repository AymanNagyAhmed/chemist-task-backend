import { PrismaService } from '@/prisma/prisma.service';
import { PreferredLocationDto } from '@/modules/preferred-locations/dto/preferred-location.dto';
export declare class PreferredLocationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<PreferredLocationDto[]>;
}
