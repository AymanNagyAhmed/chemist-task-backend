import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpStatus,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { ApiResponse } from '@/common/interfaces/api-response.interface';
  
  @Injectable()
  export class ApiResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
      const ctx = context.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
      const method = request.method;
  
      return next.handle().pipe(
        map(data => {
          // Check if the response is already in the correct format
          if (this.isApiResponse(data)) {
            return data;
          }
  
          let message = 'Operation successful';
          let statusCode = response.statusCode || HttpStatus.OK;
          
          // Customize message and status code based on HTTP method
          switch (method) {
            case 'POST':
              message = 'Resource created successfully';
              statusCode = HttpStatus.CREATED;
              break;
            case 'PUT':
            case 'PATCH':
              message = 'Resource updated successfully';
              break;
            case 'DELETE':
              message = 'Resource deleted successfully';
              break;
            case 'GET':
              message = 'Resources retrieved successfully';
              break;
          }
  
          return {
            success: true,
            statusCode,
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
            data,
          };
        }),
      );
    }
  
    private isApiResponse(data: any): data is ApiResponse<any> {
      return (
        data &&
        typeof data === 'object' &&
        'success' in data &&
        'statusCode' in data &&
        'message' in data &&
        'path' in data &&
        'timestamp' in data &&
        'data' in data
      );
    }
  } 