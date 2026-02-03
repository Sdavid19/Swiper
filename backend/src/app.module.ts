import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category';
import { QuestioBankModule } from './question-bank/question-bank.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, CategoryModule, QuestioBankModule],
})
export class AppModule {}
