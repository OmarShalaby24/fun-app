import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** * Retrieves a user by ID using user.service
   *
   * @param {number} id - the ID of the user to be retrieved.
   *
   * @throws {NotFoundException} If the user is not found. Status code: 404.
   * @returns {Promise<User>} The use object. Status code: 200.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Find user' })
  @ApiResponse({ status: 200, description: 'User Found' })
  async findOne(@Param('id') id: number): Promise<User> {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException(`User with ID: ${id} not found`);
    return user;
  }

  /** Create a new user.
   *
   * @param {CreateUserDt} createUserDto - The Data Transfer Object containing the details of the user.
   *
   * @throws {error} if user's email already exists or coordinates invalid or outside Egypt.
   * @returns {Promise<User>} The new user created.
   */
  @Post('/signup')
  @ApiOperation({ summary: 'Create a new user located in Egypt' })
  @ApiResponse({
    status: 201,
    description: 'User has been save successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid Input' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const newUser: User = new User();
    newUser.name = createUserDto.name;
    newUser.email = createUserDto.email;
    try {
      newUser.city = await this.userService.reverseGeocode(
        createUserDto.latitude,
        createUserDto.longitude,
      );
      return await this.userService.create(newUser);
    } catch (error) {
      throw error;
    }
  }
}
