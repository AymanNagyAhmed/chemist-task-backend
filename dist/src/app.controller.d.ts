import { AppService } from '@/app.service';
import { ApiResponse } from '@/common/interfaces/api-response.interface';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): Promise<ApiResponse<{
        message: string;
    }>>;
}
