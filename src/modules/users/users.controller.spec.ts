import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ForbiddenException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    fullName: 'Test User',
    dateOfBirth: '1990-01-01',
    resumeSummary: 'Test summary',
    preferredLocation: {
      id: 1,
      locationName: 'Test Location'
    },
    programmingSkills: [
      { id: 1, name: 'JavaScript' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockUsersService = {
    createUser: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        dateOfBirth: '1990-01-01',
        resumeSummary: 'Test summary',
      };

      mockUsersService.createUser.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(result).toEqual(users);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user if user is authorized', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);
      const req = { user: { id: 1 } };

      const result = await controller.findOne(1, req as any);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      const req = { user: { id: 2 } };

      await expect(controller.findOne(1, req as any))
        .rejects
        .toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update a user if authorized', async () => {
      const updateUserDto: UpdateUserDto = {
        fullName: 'Updated Name',
        dateOfBirth: '1990-01-01',
        resumeSummary: 'Updated summary',
        preferredLocationId: 1,
        programmingSkills: [1, 2],
      };
      mockUsersService.update.mockResolvedValue({ ...mockUser, ...updateUserDto });
      const req = { user: { id: 1 } };

      const result = await controller.update(1, updateUserDto, req as any);

      expect(result).toEqual({ ...mockUser, ...updateUserDto });
      expect(mockUsersService.update).toHaveBeenCalledWith(1, updateUserDto);
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      const updateUserDto: UpdateUserDto = {
        fullName: 'Updated Name',
        dateOfBirth: '1990-01-01',
        resumeSummary: 'Updated summary',
        preferredLocationId: 1,
        programmingSkills: [1, 2],
      };
      const req = { user: { id: 2 } };

      await expect(controller.update(1, updateUserDto, req as any))
        .rejects
        .toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove a user if authorized', async () => {
      const deleteResponse = { id: 1, message: 'User deleted successfully' };
      mockUsersService.remove.mockResolvedValue(deleteResponse);
      const req = { user: { id: 1 } };

      const result = await controller.remove(1, req as any);

      expect(result).toEqual(deleteResponse);
      expect(mockUsersService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      const req = { user: { id: 2 } };

      await expect(controller.remove(1, req as any))
        .rejects
        .toThrow(ForbiddenException);
    });
  });
});
