import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import * as bcryptjs from 'bcryptjs';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
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
                create: { name: skill.name! }
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

  async findUserByEmail(email: string, include?: Prisma.UserInclude) {
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

  async findOne(id: number) {
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
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ 
      where: { id }
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Validate preferredLocationId exists if provided
    if (updateUserDto.preferredLocationId !== undefined) {
      const locationExists = await this.prisma.preferredLocation.findUnique({
        where: { id: updateUserDto.preferredLocationId }
      });
      if (!locationExists) {
        throw new NotFoundException(`PreferredLocation with ID ${updateUserDto.preferredLocationId} not found`);
      }
    }

    // Check for duplicate programming skill IDs
    if (updateUserDto.programmingSkills) {
      const uniqueSkills = [...new Set(updateUserDto.programmingSkills)];
      if (uniqueSkills.length !== updateUserDto.programmingSkills.length) {
        throw new BadRequestException('Duplicate programming skill IDs are not allowed');
      }
    }

    let hashedPassword: string | undefined;
    if (updateUserDto.password) {
      const salt = await bcryptjs.genSalt(10);
      hashedPassword = await bcryptjs.hash(updateUserDto.password, salt);
    }

    // Handle profile image path - extract only the relative path
    let profileImagePath = updateUserDto.profileImage;
    if (profileImagePath) {
      try {
        const url = new URL(profileImagePath);
        // Extract the path starting from 'public/uploads/...'
        const pathMatch = url.pathname.match(/\/?public\/uploads\/.*$/);
        if (pathMatch) {
          profileImagePath = pathMatch[0].replace(/^\//, ''); // Remove leading slash if present
        }
      } catch (e) {
        // If it's not a valid URL, assume it's already a relative path
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

      // Transform the response structure
      const transformedResult = {
        ...result,
        preferredLocation: result.preferredLocation ? result.preferredLocation : {},
        programmingSkills: result.programmingSkills.map(skill => skill.programmingSkill)
      };

      return transformedResult;
    } catch (error) {
      if (error.code === 'P2002') {
        if (error.meta?.target?.includes('email')) {
          throw new BadRequestException('Email already exists');
        }
        throw new BadRequestException('This preferred location is already assigned to another user');
      }
      if (error.code === 'P2003') {
        throw new NotFoundException(`Invalid programming skill ID or preferred location ID`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ 
      where: { id },
      include: { preferredLocation: true }
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    // Delete the preferred location first if it exists
    if (user.preferredLocation) {
      await this.prisma.preferredLocation.delete({
        where: { id: user.preferredLocation.id }
      });
    }
    
    await this.prisma.user.delete({ where: { id } });
    return { id, message: 'User deleted successfully' };
  }
}
