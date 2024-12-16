import { UsersService } from '@/modules/users/users.service';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { Request } from 'express';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
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
    findOne(id: number, req: Request): Promise<{
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
    update(id: number, updateUserDto: UpdateUserDto, file: Express.Multer.File, req: Request): Promise<{
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
    remove(id: number, req: Request): Promise<{
        id: number;
        message: string;
    }>;
    uploadProfileImage(id: number, req: Request, file: Express.Multer.File): Promise<{
        imageUrl: string;
    }>;
    private checkUserAccess;
}
