import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./jwt.strategy";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { GroupsModule } from '../groups/groups.module';
import { LocationsModule } from '../locations/locations.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]),
        GroupsModule,
        LocationsModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_PASSWORD'),
                signOptions: {
                    expiresIn: '1h',
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy]
})
export class AuthModule {
}