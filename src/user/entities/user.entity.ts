import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Represents the user in the system.
 */
@Entity()
export class User {
  /**
   * Unique identifier of the user.
   * @type {number}
   * @readonly
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The name of the user.
   * @type {string}
   * @length 50
   * @example "omar shalaby"
   */
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  /**
   * The email of the user. Must be unique.
   * @type {string}
   * @length 40
   * @example "omar.shalaby@example.com"
   */
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 40, nullable: false, unique: true })
  @IsEmail()
  email: string;

  /**
   * The city where the user provide by latitude and longitude.
   * @type {string}
   * @length 50
   * @example "Alexandria"
   */
  @Column({ length: 50 })
  city: string;
}
