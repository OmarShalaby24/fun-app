import { ApiProperty } from '@nestjs/swagger';
import {
  IsDecimal,
  IsEmail,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

/**
 * Data Transfer Object for user.
 */
export class CreateUserDto {
  /**
   * The name of the user.
   */
  @ApiProperty({
    description: 'User name',
    example: 'omar shalaby',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * The email address of the user.
   * @example 'omar.shalaby@expmle.com'
   */
  @ApiProperty({
    description: 'User email',
    example: 'omar.shalaby@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * The latitude of user within range -90 to 90
   */
  @ApiProperty({
    description: "The latitude of the user's location. range [-90 : 90]",
    example: 30.8761,
  })
  @IsLatitude()
  @IsNotEmpty()
  @IsNumber()
  @Max(90)
  @Min(-90)
  latitude: number;

  /**
   * The longitude of the user within range -1800 to 180
   */
  @ApiProperty({
    description: "The longitude of the user's location range [-180 : 180]",
    example: 29.7426,
  })
  @IsLongitude()
  @IsNumber()
  @IsNotEmpty()
  @Max(180)
  @Min(-180)
  longitude: number;
}
