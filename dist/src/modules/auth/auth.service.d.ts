import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/modules/users/users.service';
import { LoginDto } from '@/modules/auth/dto/login.dto';
import { AuthResponse } from '@/modules/auth/interfaces/auth-response.interface';
export declare class AuthService {
    private jwtService;
    private usersService;
    constructor(jwtService: JwtService, usersService: UsersService);
    validateUser(loginDto: LoginDto): Promise<AuthResponse>;
}
