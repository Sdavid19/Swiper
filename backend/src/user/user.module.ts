import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../prisma';
import { UserController } from './user.controller';

@Module({
    providers: [UserService, PrismaService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}
