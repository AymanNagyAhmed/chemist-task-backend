import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
export declare class LoggingInterceptor implements NestInterceptor {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private logRequest;
    private logResponse;
    private logErrorResponse;
    private sanitizeHeaders;
    private sanitizeBody;
    private sanitizeData;
    private generateRequestId;
    private isDevelopment;
}
