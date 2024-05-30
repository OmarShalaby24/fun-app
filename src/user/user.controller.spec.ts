import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    findOne: jest.fn((id: number) => {
      if (id === 1) {
        return Promise.resolve({
          id,
          name: 'omar',
          email: 'omar@example.com',
          city: 'Cairo',
        });
      }
      return Promise.resolve(null);
    }),
    create: jest.fn((user: User) => Promise.resolve(user)),
    reverseGeocode: jest.fn((lat: number, lng: number) =>
      Promise.resolve('Cairo'),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual({
        id: 1,
        name: 'omar',
        email: 'omar@example.com',
        city: 'Alexandria',
      });
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      await expect(controller.findOne(2)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(2);
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'omar',
        email: 'omar@example.com',
        latitude: 30.0444,
        longitude: 31.2357,
      };
      const result = await controller.create(createUserDto);
      expect(result).toEqual({
        name: 'omar',
        email: 'omar@example.com',
        city: 'Alexandria',
      });
      expect(service.reverseGeocode).toHaveBeenCalledWith(30.0444, 31.2357);
      expect(service.create).toHaveBeenCalledWith({
        name: 'omar',
        email: 'omar@example.com',
        city: 'Alexandria',
      });
    });
  });
});
