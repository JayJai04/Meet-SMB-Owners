import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/users.entity";
import { Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { RegisterRequestDto } from "./dto/register-request.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { GroupsService } from "../groups/groups.service";
import { CreateGroupDto } from "../groups/dto/create-group.dto";
import { LocationsService } from "../locations/locations.service";

@Injectable()
export class AuthService {
    constructor (
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly groupsService: GroupsService,
    private readonly locationsService: LocationsService
) {}


    async login(authCredentialsDto: AuthCredentialsDto): Promise<any> {
        const existingUser = await this.usersRepository.findOneBy({email: authCredentialsDto.email});
        if (!existingUser) {
            throw new UnauthorizedException('User not found, please check email');
        }
        else {
            const compare = await bcrypt.compare(authCredentialsDto.password, existingUser.password); // decrypt pw from db
            if (compare) {
                const token = this.jwtService.sign({id: existingUser.id});
                const { password, ...userWithoutPassword } = existingUser;
                return {
                    user: userWithoutPassword,
                    access_token: token
                };
            }
            else {
                throw new UnauthorizedException('Password is incorrect');
            }

        }

    }

    async register(registerRequestDto: RegisterRequestDto): Promise<any> {
        // Check if user already exists
        const existingUser = await this.usersRepository.findOneBy({email: registerRequestDto.email});
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(registerRequestDto.password, 10);

        // Create new user
        const newUser = this.usersRepository.create({
            email: registerRequestDto.email,
            password: hashedPassword,
            cityId: registerRequestDto.cityId,
        });

        const savedUser = await this.usersRepository.save(newUser);

        // Automatically create or join group for the user's city
        try {
            // Get city name for group naming
            const city = await this.locationsService.findCityById(registerRequestDto.cityId);
            const cityName = city?.name || 'Unknown City';
            
            const createGroupDto: CreateGroupDto = {
                cityId: registerRequestDto.cityId,
                groupName: `${cityName} Business Community`
            };
            
            console.log(`Attempting to create/join group for user ${savedUser.email} in city ${cityName} (ID: ${registerRequestDto.cityId})`);
            const result = await this.groupsService.createOrJoin(createGroupDto, savedUser);
            console.log(`Group operation result:`, result);
        } catch (groupError) {
            // Log error but don't fail registration
            console.error('Failed to create/join group during registration:', groupError);
            console.error('User:', savedUser.email, 'CityId:', registerRequestDto.cityId);
        }

        // Generate JWT token
        const token = this.jwtService.sign({id: savedUser.id});

        // Return user data without password and token
        const { password, ...userWithoutPassword } = savedUser;
        return {
            user: userWithoutPassword,
            access_token: token
        };
    }
}