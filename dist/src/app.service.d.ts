import { ApiResponse } from '@/common/interfaces/api-response.interface';
export declare class AppService {
    getHello(): Promise<ApiResponse<{
        message: string;
    }>>;
}
