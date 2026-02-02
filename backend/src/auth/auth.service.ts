import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService){}

    async signup(dto: AuthDto) { 
        const hashedPassword = await argon.hash(dto.password)

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash: hashedPassword,
                name: dto.name,
                isAdmin: false
            },
            select: {
                email: true,
                name: true
            }
        });

        return user;
    }

    signin() { 
        return { msg: 'Signed up' }
    }
}