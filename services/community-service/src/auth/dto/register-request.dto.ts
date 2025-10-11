import { IsEmail, IsString, MinLength, IsNumber } from 'class-validator';

export class RegisterRequestDto {
    @IsEmail()
    readonly email: string;

    @IsString()
    @MinLength(8)
    readonly password: string;

    @IsNumber()
    readonly cityId: number;
}