import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from '../prisma';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [PrismaModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
