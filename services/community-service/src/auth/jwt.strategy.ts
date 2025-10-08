import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from 'typeorm'
import { User } from '../users/users.entity'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import {ExtractJwt, Strategy} from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtPayload } from './dto/jwt-payload.dto'


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor (
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService
    ){
        const jwtSecret = configService.get<string>('JWT_PASSWORD');
        if (!jwtSecret) {
            throw new Error('JWT_PASSWORD environment variable is required');
        }
        
        super(
            {jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(), 
                secretOrKey : jwtSecret
            }
        )
    }

async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;
    const user = await this.userRepository.findOneBy({id});
    if (!user) {
        throw new UnauthorizedException('User not found')
    }
    else {
        return user
    }
}
}