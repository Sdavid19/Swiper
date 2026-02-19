import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../prisma';

@Module({
    providers: [UserService, PrismaService],
    exports: [UserService]
})
export class UserModule {}
