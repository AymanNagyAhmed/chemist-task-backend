import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
export declare const createCorsConfig: (configService: ConfigService) => CorsOptions;
