import {
  BadRequestException,
  Body,
  ConflictException,
  Get,
  Injectable,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /** * Finds a user by ID from database.
   *
   * @param {number} id - the ID of the user.
   *
   * @throws {NotFoundException} If the user is not found.
   * @returns {Promise<User>} The found user.
   */
  async findOne(@Param('id') id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** Saves a new user in the database.
   *
   * @param {User} newUser - The user entity to be saved.
   *
   * @throws {ConflictException} If provided email already exists in database.
   * @returns {Promise<User>} The saved user.
   */
  async create(@Body() newUser: User): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: newUser.email });
    if (user) throw new ConflictException('Email already exists');
    return this.userRepository.save(newUser);
  }

  /** Performs reverse geocoding to find the city based on the latitude and longitude using OpenCage Geocoding API.
   *
   * @param {number} latitude - The latitude of the location.
   * @param {number} longitude - The longitude of the location.
   *
   * @throws {BadRequestException} if the latitude or longitude are out for normal range or the coordinates outside Egypt.
   * @returns {Promise<string>} The name of the city or the town of the specified coordinates.
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    /**
     * WARN: - In production use .env file to store the key => apiKey = process.env.MAP_API_KEY;
     *       - In development use the key hardcoded for testing
     */
    const apiKey = '55ba4551ce1a445eb58be8f59f3bc31d';

    const url = `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${latitude}%2C+${longitude}&language=en`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status.code === 200) {
        const result = data.results;
        if (result[0].components.country !== 'Egypt')
          throw new BadRequestException('You are outside Egypt');
        const city =
          result[0].components.state !== undefined
            ? result[0].components.state
            : result[0].components.town;
        return city;
      } else {
        throw new BadRequestException(data.status.message);
      }
    } catch (error) {
      throw error;
    }
  }
}
