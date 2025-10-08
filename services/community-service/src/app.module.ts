import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // <-- Add ConfigModule and ConfigService
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- Add TypeOrmModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity'; // <-- Make sure you import your User entity!
import { GroupsModule } from './groups/groups.module'
import { Group } from './groups/entities/groups.entity'
import { GroupMember } from './groups/entities/group-members.entity'
import { AuthModule } from './auth/auth.module'
import { LocationsModule } from './locations/locations.module'
import { City } from './locations/entities/city.entity'
import { State } from './locations/entities/state.entity'
import { Country } from './locations/entities/country.entity'

@Module({
  imports: [
    // 1. Load the .env file globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // 2. Configure the database connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to use ConfigService
      inject: [ConfigService], // Inject the ConfigService
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Group, GroupMember, City, State, Country], // <-- Here is where we tell TypeORM about our entities
        synchronize: true, // For development, this auto-creates tables based on entities.
      }),
    }),

    // 3. Import our modules
    UsersModule,
    GroupsModule,
    AuthModule,
    LocationsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}