// src/users/users.service.ts

import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt'; // We'll need bcrypt for password hashing

@Injectable() // This decorator marks the class as a provider that can be managed by NestJS DI container.
export class UsersService {
  // Inject the repository for our User entity. TypeORM will provide an instance of the repository.
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger(UsersService.name);

  /**
   * Creates a new user.
   * @param createUserDto The data for the new user.
   * @returns The newly created user.
   */
  async createUser(createUserDto: any): Promise<User> {
    // 1. Check if user already exists
    const existingUser = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      this.logger.warn(`User with email ${createUserDto.email} already exists.`);
      throw new ConflictException('Email address already in use.');
    }

    // 2. Hash the password
    const saltRounds = 10; // The number of salt rounds. Higher is more secure but slower. 10 is a common balance.
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    // 3. Create the new user entity
    const newUser = this.usersRepository.create({
      email: createUserDto.email,
      password: hashedPassword, // Store the hashed password!
      firstName: createUserDto.firstName, // firstName is optional, so it might be undefined.
    });

    // 4. Save the user to the database
    try {
      const savedUser = await this.usersRepository.save(newUser);
      this.logger.log(`User created successfully: ${savedUser.email}`);
      // Return the user object, but omit the password hash for security.
      // In a real app, you'd return a UserDto that excludes the password.
      const { password, ...userWithoutPassword } = savedUser;
      return userWithoutPassword as User;
    } catch (error) {
      this.logger.error(`Error saving user ${newUser.email}: ${error.message}`, error.stack);
      // Rethrow a generic error for security. Don't expose database errors.
      throw new Error('An error occurred while creating the user.');
    }
  }

  /**
   * Finds a user by their email.
   * @param email The email to search for.
   * @returns The user if found, otherwise undefined.
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
}