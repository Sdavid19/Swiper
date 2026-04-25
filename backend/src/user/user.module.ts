import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from '../prisma';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { UserImageService } from './services/user-image.service';
import { ImageModule } from '../shared/image/image.module';

@Module({
  imports: [PrismaModule, ImageModule],
  providers: [UserService, UserImageService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
