// src/users/users.controller.ts

import { Controller, Post, Body, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto'; // We'll create this DTO next

@Controller('users') // This decorator tells NestJS that this class handles requests for the 'users' route.
export class UsersController {
  // Inject the UsersService. NestJS's DI container will provide an instance.
  constructor(private readonly usersService: UsersService) {}

  @Post() // This decorator maps HTTP POST requests to the '/' path (relative to the controller's base route, so POST /users).
  @HttpCode(HttpStatus.CREATED) // Sets the HTTP status code for a successful response to 201 Created.
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Enables validation for the incoming request body.
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> { // Binds the request body to the createUserDto parameter.
    // Call the service method to create the user.
    const newUser = await this.usersService.createUser(createUserDto);
    
    // Return the created user (without the password, as handled by the service).
    // We could also return a DTO here for more control over the response shape.
    return newUser;
  }
}