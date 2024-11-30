import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcryptjs from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    fullName: 'Test User',
    dateOfBirth: new Date('1990-01-01'),
    resumeSummary: 'Test summary',
    preferredLocation: {
      id: 1,
      locationName: 'Test Location',
    },
    programmingSkills: [
      {
        programmingSkill: {
          id: 1,
          name: 'JavaScript',
        },
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    preferredLocation: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        dateOfBirth: '1990-01-01',
        resumeSummary: 'Test summary',
      };

      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.createUser(createUserDto);

      expect(bcryptjs.genSalt).toHaveBeenCalledWith(10);
      expect(bcryptjs.hash).toHaveBeenCalledWith('password123', 'salt');
      expect(mockPrismaService.user.create).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findUserByEmail('test@example.com');

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        include: undefined,
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findUserByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      mockPrismaService.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();

      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: expect.any(Object),
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      fullName: 'Updated Name',
      dateOfBirth: '1990-01-01',
      resumeSummary: 'Updated summary',
      preferredLocationId: 1,
      programmingSkills: [1, 2],
    };

    it('should update a user successfully', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.preferredLocation.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.user.update.mockResolvedValue({ ...mockUser, ...updateUserDto });

      const result = await service.update(1, updateUserDto);

      expect(mockPrismaService.user.update).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({
        fullName: 'Updated Name',
      }));
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.update(999, updateUserDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if preferred location not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.preferredLocation.findUnique.mockResolvedValue(null);

      await expect(service.update(1, updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a user successfully', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      const result = await service.remove(1);

      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual({
        id: 1,
        message: 'User deleted successfully',
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
