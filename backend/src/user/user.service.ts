import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma";

@Injectable()
export class UserService { 
    constructor(private readonly prisma: PrismaService) { }
    
    async findUserById(userId: number) {
        return this.prisma.user.findFirst({
            where: { id: userId },
        });
    }
}