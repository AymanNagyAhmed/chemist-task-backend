import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/modules/users/users.service';
import { LoginDto } from '@/modules/auth/dto/login.dto';
import { AuthResponse, AuthUserData } from '@/modules/auth/interfaces/auth-response.interface';
import { Prisma } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<AuthResponse> {
    type UserWithRelations = {
      id: number;
      email: string;
      fullName: string | null;
      dateOfBirth: Date | null;
      resumeSummary: string | null;
      createdAt: Date;
      updatedAt: Date;
      preferredLocation: {
        id: number;
        locationName: string;
      } | null;
      programmingSkills: Array<{
        userId: number;
        programmingSkillId: number;
        assignedAt: Date;
        programmingSkill: {
          id: number;
          name: string;
        };
      }>;
      profileImage: string | null;
    };

    const includeOptions: Prisma.UserInclude = {
      preferredLocation: {select: {
        id: true,
        locationName: true,
      },},
      programmingSkills: {
        include: {
          programmingSkill: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    };

    const user = await this.usersService.findUserByEmail(loginDto.email, includeOptions);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcryptjs.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      sub: user.id, 
      email: user.email,
      fullName: user.fullName,
    };

    // Create a user object without the password
    const { password: _, ...userData } = user as unknown as UserWithRelations & { password: string };
    
    // Pick only the fields we need for AuthUserData
    const transformedUser: AuthUserData = {
      id: userData.id,
      email: userData.email,
      fullName: userData.fullName,
      dateOfBirth: userData.dateOfBirth,
      preferredLocation: userData.preferredLocation,
      resumeSummary: userData.resumeSummary,
      programmingSkills: userData.programmingSkills.map(skill => ({
        id: skill.programmingSkill.id,
        name: skill.programmingSkill.name
      })),
      profileImage: userData.profileImage,
    };

    return {
      user: transformedUser,
      access_token: this.jwtService.sign(payload),
    };
  }
}