import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class SignupDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    @IsNotEmpty()
    name: string
}