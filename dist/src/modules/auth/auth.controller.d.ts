import { Request } from 'express';
import { LoginDto } from '@/modules/auth/dto/login.dto';
import { AuthService } from '@/modules/auth/auth.service';
import { AuthResponse } from '@/modules/auth/interfaces/auth-response.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<AuthResponse>;
    getStatus(req: Request): Express.User;
}
