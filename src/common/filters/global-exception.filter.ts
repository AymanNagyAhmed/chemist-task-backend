import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { Prisma } from '@prisma/client';
  import { ApiErrorResponse } from '@/common/interfaces/api-response.interface';
  
  @Catch()
  export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);
  
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal server error';
      let errors: Record<string, any> | undefined;
  
      if (exception instanceof HttpException) {
        status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        
        if (typeof exceptionResponse === 'string') {
          message = exceptionResponse;
        } else if (typeof exceptionResponse === 'object') {
          const response = exceptionResponse as Record<string, any>;
          message = response.message || message;
          errors = response.errors;
        }
      } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
        switch (exception.code) {
          case 'P2002': // Unique constraint violation
            status = HttpStatus.CONFLICT;
            message = 'Duplicate entry found';
            break;
          case 'P2014': // Invalid ID
            status = HttpStatus.BAD_REQUEST;
            message = 'Invalid ID provided';
            break;
          case 'P2003': // Foreign key constraint failed
            status = HttpStatus.BAD_REQUEST;
            message = 'Related record not found';
            break;
          default:
            status = HttpStatus.BAD_REQUEST;
            message = 'Database operation failed';
        }
      } else if (exception instanceof Prisma.PrismaClientValidationError) {
        status = HttpStatus.BAD_REQUEST;
        message = 'Invalid data provided';
      }
  
      this.logger.error(
        `${request.method} ${request.url} ${status} - ${message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
  
      const errorResponse: ApiErrorResponse = {
        success: false,
        statusCode: status,
        message,
        path: request.url,
        timestamp: new Date().toISOString(),
        ...(errors && { errors }),
      };
  
      response.status(status).json(errorResponse);
    }
  } 