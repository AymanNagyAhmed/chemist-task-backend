"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcryptjs = require("bcryptjs");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createUser(data) {
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(data.password, salt);
        return this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                fullName: data.fullName,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
                preferredLocationId: data.preferredLocation?.id,
                resumeSummary: data.resumeSummary,
                programmingSkills: data.programmingSkills ? {
                    create: data.programmingSkills.map(skill => ({
                        programmingSkill: {
                            connectOrCreate: {
                                where: { id: skill.id },
                                create: { name: skill.name }
                            }
                        }
                    }))
                } : undefined,
                profileImage: data.profileImage,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                dateOfBirth: true,
                resumeSummary: true,
                preferredLocation: {
                    select: {
                        id: true,
                        locationName: true,
                    }
                },
                programmingSkills: {
                    select: {
                        programmingSkill: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
                profileImage: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async findUserByEmail(email, include) {
        return this.prisma.user.findUnique({
            where: { email },
            include,
        });
    }
    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                fullName: true,
                dateOfBirth: true,
                resumeSummary: true,
                preferredLocation: {
                    select: {
                        id: true,
                        locationName: true,
                    }
                },
                programmingSkills: {
                    select: {
                        programmingSkill: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
                profileImage: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                fullName: true,
                dateOfBirth: true,
                resumeSummary: true,
                preferredLocation: {
                    select: {
                        id: true,
                        locationName: true,
                    }
                },
                programmingSkills: {
                    select: {
                        programmingSkill: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
                profileImage: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async update(id, updateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        if (updateUserDto.preferredLocationId !== undefined) {
            const locationExists = await this.prisma.preferredLocation.findUnique({
                where: { id: updateUserDto.preferredLocationId }
            });
            if (!locationExists) {
                throw new common_1.NotFoundException(`PreferredLocation with ID ${updateUserDto.preferredLocationId} not found`);
            }
        }
        if (updateUserDto.programmingSkills) {
            const uniqueSkills = [...new Set(updateUserDto.programmingSkills)];
            if (uniqueSkills.length !== updateUserDto.programmingSkills.length) {
                throw new common_1.BadRequestException('Duplicate programming skill IDs are not allowed');
            }
        }
        let hashedPassword;
        if (updateUserDto.password) {
            const salt = await bcryptjs.genSalt(10);
            hashedPassword = await bcryptjs.hash(updateUserDto.password, salt);
        }
        let profileImagePath = updateUserDto.profileImage;
        if (profileImagePath) {
            try {
                const url = new URL(profileImagePath);
                const pathMatch = url.pathname.match(/\/?public\/uploads\/.*$/);
                if (pathMatch) {
                    profileImagePath = pathMatch[0].replace(/^\//, '');
                }
            }
            catch (e) {
                profileImagePath = updateUserDto.profileImage;
            }
        }
        try {
            const result = await this.prisma.user.update({
                where: { id },
                data: {
                    email: updateUserDto.email,
                    password: hashedPassword,
                    fullName: updateUserDto.fullName,
                    dateOfBirth: updateUserDto.dateOfBirth ? new Date(updateUserDto.dateOfBirth) : undefined,
                    preferredLocationId: updateUserDto.preferredLocationId,
                    resumeSummary: updateUserDto.resumeSummary,
                    programmingSkills: updateUserDto.programmingSkills ? {
                        deleteMany: {},
                        create: updateUserDto.programmingSkills.map(skillId => ({
                            programmingSkillId: skillId
                        }))
                    } : undefined,
                    profileImage: profileImagePath,
                },
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    dateOfBirth: true,
                    resumeSummary: true,
                    preferredLocation: {
                        select: {
                            id: true,
                            locationName: true,
                        }
                    },
                    programmingSkills: {
                        select: {
                            programmingSkill: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            }
                        }
                    },
                    profileImage: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            const transformedResult = {
                ...result,
                preferredLocation: result.preferredLocation ? result.preferredLocation : {},
                programmingSkills: result.programmingSkills.map(skill => skill.programmingSkill)
            };
            return transformedResult;
        }
        catch (error) {
            if (error.code === 'P2002') {
                if (error.meta?.target?.includes('email')) {
                    throw new common_1.BadRequestException('Email already exists');
                }
                throw new common_1.BadRequestException('This preferred location is already assigned to another user');
            }
            if (error.code === 'P2003') {
                throw new common_1.NotFoundException(`Invalid programming skill ID or preferred location ID`);
            }
            throw error;
        }
    }
    async remove(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { preferredLocation: true }
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        if (user.preferredLocation) {
            await this.prisma.preferredLocation.delete({
                where: { id: user.preferredLocation.id }
            });
        }
        await this.prisma.user.delete({ where: { id } });
        return { id, message: 'User deleted successfully' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map