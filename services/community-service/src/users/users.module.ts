import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity'; // Make sure User entity is imported

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // <-- This is crucial for the service to inject the repository
  ],
  controllers: [UsersController], // <-- Make sure UsersController is listed here
  providers: [UsersService],     // <-- Make sure UsersService is listed here
})
export class UsersModule {}