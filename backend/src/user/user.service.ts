import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma";

@Injectable()
export class UserService { 
    constructor(private readonly prisma: PrismaService) { }
    
    async findUserById(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                name: true,
                email: true,
                imageUrl: true,
            },
        });
    }

    async findUserByEmail(email: string) {
        return this.prisma.user.findFirst({
            where: { email: email },
        });
    }

}