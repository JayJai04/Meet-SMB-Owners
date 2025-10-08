import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/users.entity";
import { Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor (
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService
) {}


    async login(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const existingUser = await this.usersRepository.findOneBy({email: authCredentialsDto.email});
        if (!existingUser) {
            throw new UnauthorizedException('User not found, please check email');
        }
        else {
            const compare = await bcrypt.compare(authCredentialsDto.password, existingUser.password); // decrypt pw from db
            if (compare) {
                return this.jwtService.sign({id: existingUser.id});
            }
            else {
                throw new UnauthorizedException('Password is incorrect');
            }

        }

    }
}