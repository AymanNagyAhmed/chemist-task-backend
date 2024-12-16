import { PreferredLocationsService } from '@/modules/preferred-locations/preferred-locations.service';
import { PreferredLocationDto } from '@/modules/preferred-locations/dto/preferred-location.dto';
export declare class PreferredLocationsController {
    private readonly preferredLocationsService;
    constructor(preferredLocationsService: PreferredLocationsService);
    findAll(): Promise<PreferredLocationDto[]>;
}
