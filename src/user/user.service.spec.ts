import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

import fetch from 'node-fetch';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  const mockRepository = {
    findOneBy: jest.fn((id?: number, email?: string) => {
      if (id)
        return Promise.resolve({
          id,
          name: 'omar',
          email: 'omar@example.com',
          city: 'Alexandria',
        });
      else if (email)
        return Promise.resolve({
          id: 1,
          name: 'omar',
          email,
          city: 'Alexandria',
        });
      return Promise.resolve(null);
    }),
    save: jest.fn((user: User) => Promise.resolve(user)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          // useClass: Repository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = new User();
      user.id = 1;
      user.name = 'omar';
      user.email = 'omar@example.com';
      user.city = 'Alexandria';

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      expect(await service.findOne(1)).toEqual(user);
    });

    it('should throw a NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should save and return the user', async () => {
      const user = new User();
      user.name = 'omar';
      user.email = 'omar@example.com';
      user.city = 'Alexandria';

      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      expect(await service.create(user)).toEqual(user);
    });
    it('should throw a ConflictException when creating a user with duplicate email', async () => {
      const newUser: User = {
        id: 1,
        name: 'omar',
        email: 'omar@example.com',
        city: 'Alexandria',
      };

      jest.spyOn(userRepository, 'save').mockImplementation(() => {
        throw new ConflictException('Email already exists');
      });

      await expect(service.create(newUser)).rejects.toThrow(ConflictException);
    });
  });

  describe('reverseGeoCode', () => {
    it('should return Alexandria in Egypt', async () => {
      const latitude = 31.2001;
      const longitude = 29.9187;

      const city = await service.reverseGeocode(latitude, longitude);
      expect(city).toBe('Alexandria');
    });
    it('should return North Sinai in Egypt', async () => {
      const latitude = 30.747593;
      const longitude = 33.598184;

      const city = await service.reverseGeocode(latitude, longitude);
      expect(city).toBe('North Sinai');
    });

    it('should throw error for being outside Egypt', async () => {
      const latitude = 40.7128;
      const longitude = -74.006;
      await expect(service.reverseGeocode(latitude, longitude)).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should throw error for invalid latitude', async () => {
      const latitude = 91.7128;
      const longitude = -74.006;
      await expect(service.reverseGeocode(latitude, longitude)).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should throw error for invalid longitude', async () => {
      const latitude = 31.7128;
      const longitude = 180.006;
      await expect(service.reverseGeocode(latitude, longitude)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
