// src/users/dto/create-user.dto.ts

import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail() // Validates that the email property is a valid email format.
  readonly email: string;

  @IsString() // Validates that the password property is a string.
  @MinLength(8) // Validates that the password is at least 8 characters long.
  readonly password: string;

  @IsOptional() // Makes the firstName property optional.
  @IsString() // Validates that if firstName is present, it's a string.
  readonly firstName?: string; // '?' also marks the property as optional in TypeScript
}