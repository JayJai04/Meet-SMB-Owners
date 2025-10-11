import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { RegisterRequestDto } from "./dto/register-request.dto";

@Controller('auth')
export class AuthController {
    constructor (
        private readonly authService: AuthService
    ) {}

    @Post('/login')
    async authenticate(@Body() authCredentialsDto: AuthCredentialsDto): Promise<any> {
        return this.authService.login(authCredentialsDto);
    }

    @Post('/register')
    async register(@Body() registerRequestDto: RegisterRequestDto): Promise<any> {
        return this.authService.register(registerRequestDto);
    }
}