import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as argon from 'argon2'
import { UserService } from "../user";
import { JwtService } from "@nestjs/jwt";
import { SigninDto } from "./dto/signin.dto";
import { SignupDto } from "./dto";

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService, 
        private userService: UserService, 
        private jwtService: JwtService){}

    async signup(dto: SignupDto) {
        const hash = await argon.hash(dto.password);

        const user = await this.prisma.user.create({
        data: {
            email: dto.email,
            name: dto.name,
            passwordHash: hash,
            isAdmin: false,
        },
            select: { id: true, email: true, name: true, },
        });

        return user;
    }


    async signin(dto: SigninDto) { 
        const user = await this.userService.findUserByEmail(dto.email);

        if(!user){
            throw new UnauthorizedException('Invalid credentials!');
        }

        const validPassword = await argon.verify(user.passwordHash, dto.password)

        if(!validPassword){
            throw new UnauthorizedException('Invalid credentials!');
        }

        const payload = {sub: user.id, username: user.name, email: user.email};

        return {access_token: await this.jwtService.signAsync(payload), user: {email: user.email, name: user.name, imageUrl: user.imageUrl}};
    }
}