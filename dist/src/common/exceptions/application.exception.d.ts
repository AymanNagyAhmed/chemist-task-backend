import { HttpException, HttpStatus } from '@nestjs/common';
export declare class ApplicationException extends HttpException {
    constructor(message: string, status?: HttpStatus);
}
