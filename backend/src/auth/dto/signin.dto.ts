import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SigninDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}