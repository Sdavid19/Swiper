import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as argon from 'argon2'
import { UserDto } from "./dto";
import { UserImageDto } from "./dto/user-image";

@Injectable()
export class UserService { 
    constructor(private readonly prisma: PrismaService) { }
    
    async findUserById(id: number) {
        const user = this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true,
            },
        });

        if(!user){
            throw new NotFoundException(`User with id ${id} not found`);
        }

        return user;
    }

    async findUserByEmail(email: string) {
        return this.prisma.user.findFirst({
            where: { email: email },
        });
    }


    async updateUser(id: number, dto: UpdateUserDto): Promise<UserDto> {
        const data: UpdateUserDto = {};

        if (dto.name) {
            data.name = dto.name;
        }

        if (dto.password) {
            data.password = await argon.hash(dto.password)
        }

        const user = await this.prisma.user.update({
            where: { id },
            data: {
                name: data.name,
                passwordHash: data.password
            },
            select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true,
            }
        });

        return user;
    }

    async updateUserImage(id: number, filename: string): Promise<UserImageDto>{
        const imageUrl = this.prisma.user.update({
            where: {id},
            data: {
                imageUrl: filename
            },
            select: {
                imageUrl: true
            }
        });

        return imageUrl;
    }

}