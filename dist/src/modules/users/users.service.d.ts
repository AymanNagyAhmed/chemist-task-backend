import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { Prisma } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    createUser(data: CreateUserDto): Promise<{
        preferredLocation: {
            id: number;
            locationName: string;
        };
        id: number;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        dateOfBirth: Date;
        email: string;
        resumeSummary: string;
        profileImage: string;
        programmingSkills: {
            programmingSkill: {
                id: number;
                name: string;
            };
        }[];
    }>;
    findUserByEmail(email: string, include?: Prisma.UserInclude): Promise<{
        preferredLocation: {
            id: number;
            locationName: string;
            createdAt: Date;
            updatedAt: Date;
        };
        _count: {
            preferredLocation: number;
            programmingSkills: number;
        };
        programmingSkills: {
            assignedAt: Date;
            programmingSkillId: number;
            userId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        fullName: string | null;
        dateOfBirth: Date | null;
        email: string;
        preferredLocationId: number | null;
        resumeSummary: string | null;
        password: string;
        profileImage: string | null;
    }>;
    findAll(): Promise<{
        preferredLocation: {
            id: number;
            locationName: string;
        };
        id: number;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        dateOfBirth: Date;
        email: string;
        resumeSummary: string;
        profileImage: string;
        programmingSkills: {
            programmingSkill: {
                id: number;
                name: string;
            };
        }[];
    }[]>;
    findOne(id: number): Promise<{
        preferredLocation: {
            id: number;
            locationName: string;
        };
        id: number;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        dateOfBirth: Date;
        email: string;
        resumeSummary: string;
        profileImage: string;
        programmingSkills: {
            programmingSkill: {
                id: number;
                name: string;
            };
        }[];
    }>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        preferredLocation: {};
        programmingSkills: {
            id: number;
            name: string;
        }[];
        id: number;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        dateOfBirth: Date;
        email: string;
        resumeSummary: string;
        profileImage: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        message: string;
    }>;
}
